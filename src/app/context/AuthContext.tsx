import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import {
  Student,
  Faculty,
  Club,
  Project,
  ProjectStatus,
  ProjectApplication,
} from "../data/mockData";

export type CurrentUser = Student | Faculty | Club;

interface AuthContextType {
  currentUser: CurrentUser | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, profile: Partial<CurrentUser>) => Promise<void>;
  logout: () => Promise<void>;
  switchAccount: (user: CurrentUser) => void;
  updateProfile: (updates: Partial<Student & Faculty & Club>) => void;
  addProject: (project: Project) => void;
  customProjects: Project[];
  appliedProjectIds: string[];
  applyToProject: (projectId: string) => void;
  withdrawApplication: (projectId: string) => void;
  getMyProjects: () => ProjectApplication[];
  getProjectApplicants: (projectId: string) => ProjectApplication[];
  updateProjectStatus: (projectId: string, studentId: string, newStatus: ProjectStatus, rating?: number, hoursSpent?: number) => void;
  approveApplicant: (projectId: string, studentId: string) => void;
  rejectApplicant: (projectId: string, studentId: string) => void;
  startProject: (projectId: string, studentId: string) => void;
  completeProject: (projectId: string, studentId: string, rating: number, hoursSpent: number) => void;
  // Supabase specific data
  allStudents: Student[];
  allFaculty: Faculty[];
  allClubs: Club[];
  allProjects: Project[];
  refreshData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [customProjects, setCustomProjects] = useState<Project[]>([]);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [allFaculty, setAllFaculty] = useState<Faculty[]>([]);
  const [allClubs, setAllClubs] = useState<Club[]>([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [projectApplications, setProjectApplications] = useState<ProjectApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [
        { data: studentsData },
        { data: facultyData },
        { data: clubsData },
        { data: projectsData },
        { data: appsData },
      ] = await Promise.all([
        supabase.from('students').select('*'),
        supabase.from('faculty').select('*'),
        supabase.from('clubs').select('*'),
        supabase.from('projects').select('*'),
        supabase.from('project_applications').select('*'),
      ]);

      if (studentsData) setAllStudents(studentsData.map(s => ({
        ...s,
        avatarInitials: s.avatar_initials,
        credibilityScore: s.credibility_score,
        projectsCompleted: s.projects_completed,
        activeProjects: s.active_projects,
        avgRating: s.avg_rating,
        hoursLogged: s.hours_logged
      })));

      if (facultyData) setAllFaculty(facultyData.map(f => ({
        ...f,
        avatarInitials: f.avatar_initials,
        researchAreas: f.research_areas,
        projectsPosted: f.projects_posted
      })));

      if (clubsData) setAllClubs(clubsData.map(c => ({
        ...c,
        avatarInitials: c.avatar_initials,
        projectsPosted: c.projects_posted,
        foundedYear: c.founded_year
      })));

      if (projectsData) {
        const mappedProjects = projectsData.map(p => ({
          ...p,
          posterId: p.poster_id,
          posterType: p.poster_type,
          durationMonths: p.duration_months,
          isPaid: p.is_paid,
          postedDaysAgo: p.posted_days_ago
        }));
        setAllProjects(mappedProjects);
      }

      if (appsData) {
        setProjectApplications(appsData.map(a => ({
          projectId: a.project_id,
          studentId: a.student_id,
          status: a.status,
          appliedDate: a.applied_date,
          rating: a.rating,
          hoursSpent: a.hours_spent
        })));
      }
    } catch (error) {
      console.error('Error fetching Supabase data:', error);
    }
  };

  useEffect(() => {
    // 1. Fetch initial session
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await handleAuthSession(session.user.id);
        }
      } catch (err) {
        console.error("Auth init error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        try {
          await handleAuthSession(session.user.id);
        } catch (err) {
          console.error("Auth session update error:", err);
        }
      } else {
        setCurrentUser(null);
      }
    });

    initAuth();
    fetchData();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleAuthSession = async (userId: string) => {
    try {
      // Try to find user in any table
      const [
        { data: student },
        { data: faculty },
        { data: club }
      ] = await Promise.all([
        supabase.from('students').select('*').eq('id', userId).maybeSingle(),
        supabase.from('faculty').select('*').eq('id', userId).maybeSingle(),
        supabase.from('clubs').select('*').eq('id', userId).maybeSingle()
      ]);

      if (student) setCurrentUser({ ...student, avatarInitials: student.avatar_initials, credibilityScore: student.credibility_score, projectsCompleted: student.projects_completed, activeProjects: student.active_projects, avgRating: student.avg_rating, hoursLogged: student.hours_logged });
      else if (faculty) setCurrentUser({ ...faculty, avatarInitials: faculty.avatar_initials, researchAreas: faculty.research_areas, projectsPosted: faculty.projects_posted });
      else if (club) setCurrentUser({ ...club, avatarInitials: club.avatar_initials, projectsPosted: club.projects_posted, foundedYear: club.founded_year });
    } catch (err) {
      console.error("Error setting handleAuthSession:", err);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string, profile: Partial<CurrentUser>) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    if (!data.user) throw new Error("Sign up failed");

    const userId = data.user.id;
    const table = profile.type === 'student' ? 'students' : profile.type === 'faculty' ? 'faculty' : 'clubs';

    const dbUser: any = { ...profile, id: userId, email };
    if (profile.avatarInitials) dbUser.avatar_initials = profile.avatarInitials;

    if (profile.type === 'student') {
      const s = profile as Student;
      dbUser.credibility_score = s.credibilityScore || 0;
      dbUser.projects_completed = 0;
      dbUser.active_projects = 0;
      dbUser.avg_rating = 0;
      dbUser.hours_logged = 0;
    } else if (profile.type === 'faculty') {
      const f = profile as Faculty;
      dbUser.research_areas = f.researchAreas || [];
      dbUser.projects_posted = 0;
    } else if (profile.type === 'club') {
      const c = profile as Club;
      dbUser.projects_posted = 0;
      dbUser.founded_year = c.foundedYear || new Date().getFullYear();
    }

    const { error: profileError } = await supabase.from(table).insert(dbUser);
    if (profileError) throw profileError;

    await fetchData();
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
  };

  const switchAccount = (user: CurrentUser) => {
    setCurrentUser(user);
    localStorage.setItem('cq_userId', user.id);
    localStorage.setItem('cq_userType', user.type);
  };

  const updateProfile = async (updates: Partial<Student> | Partial<Faculty> | Partial<Club>) => {
    if (!currentUser) return;
    const table = currentUser.type === 'student' ? 'students' : currentUser.type === 'faculty' ? 'faculty' : 'clubs';

    // Convert camelCase to snake_case for Supabase
    const dbUpdates: any = { ...(updates as any) };
    if ('avatarInitials' in updates) dbUpdates.avatar_initials = (updates as any).avatarInitials;

    const { error } = await supabase.from(table).update(dbUpdates).eq('id', currentUser.id);
    if (!error) {
      setCurrentUser({ ...currentUser, ...updates } as CurrentUser);
    }
  };

  const addProject = async (project: Project) => {
    const { error } = await supabase.from('projects').insert({
      id: project.id,
      title: project.title,
      poster: project.poster,
      poster_id: project.posterId,
      poster_type: project.posterType,
      duration: project.duration,
      duration_months: project.durationMonths,
      difficulty: project.difficulty,
      is_paid: project.isPaid,
      compensation: project.compensation,
      skills: project.skills,
      description: project.description,
      posted_days_ago: project.postedDaysAgo,
      applicants: 0,
      spots: project.spots
    });

    if (!error) {
      await fetchData();
    }
  };

  const applyToProject = async (projectId: string) => {
    if (currentUser?.type !== "student") return;

    const { error } = await supabase.from('project_applications').insert({
      project_id: projectId,
      student_id: currentUser.id,
      status: "applied"
    });

    if (!error) {
      await fetchData();
    }
  };

  const withdrawApplication = async (projectId: string) => {
    if (currentUser?.type !== "student") return;

    const { error } = await supabase.from('project_applications')
      .delete()
      .eq('project_id', projectId)
      .eq('student_id', currentUser.id);

    if (!error) {
      await fetchData();
    }
  };

  const getMyProjects = (): ProjectApplication[] => {
    if (currentUser?.type !== "student") return [];
    return projectApplications.filter(a => a.studentId === currentUser.id);
  };

  const getProjectApplicants = (projectId: string): ProjectApplication[] => {
    if (currentUser?.type === "student") return [];
    return projectApplications.filter(a => a.projectId === projectId);
  };

  const updateProjectStatus = async (
    projectId: string,
    studentId: string,
    newStatus: ProjectStatus,
    rating?: number,
    hoursSpent?: number
  ) => {
    const { error } = await supabase.from('project_applications')
      .update({ status: newStatus, rating, hours_spent: hoursSpent })
      .eq('project_id', projectId)
      .eq('student_id', studentId);

    if (!error) {
      await fetchData();
    }
  };

  const approveApplicant = (projectId: string, studentId: string) => {
    updateProjectStatus(projectId, studentId, "selected");
  };

  const rejectApplicant = async (projectId: string, studentId: string) => {
    const { error } = await supabase.from('project_applications')
      .delete()
      .eq('project_id', projectId)
      .eq('student_id', studentId);

    if (!error) {
      await fetchData();
    }
  };

  const startProject = (projectId: string, studentId: string) => {
    updateProjectStatus(projectId, studentId, "in-progress");
  };

  const completeProject = (
    projectId: string,
    studentId: string,
    rating: number,
    hoursSpent: number
  ) => {
    updateProjectStatus(projectId, studentId, "completed", rating, hoursSpent);
  };

  const appliedProjectIds = currentUser?.type === "student"
    ? projectApplications.filter(a => a.studentId === currentUser.id).map(a => a.projectId)
    : [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading CampusQuest with Supabase...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        signIn,
        signUp,
        logout,
        switchAccount,
        updateProfile,
        addProject,
        customProjects,
        appliedProjectIds,
        applyToProject,
        withdrawApplication,
        getMyProjects,
        getProjectApplicants,
        updateProjectStatus,
        approveApplicant,
        rejectApplicant,
        startProject,
        completeProject,
        allStudents,
        allFaculty,
        allClubs,
        allProjects,
        refreshData: fetchData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
