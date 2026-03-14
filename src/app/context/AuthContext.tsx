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
  login: (user: CurrentUser) => void;
  signUp: (user: CurrentUser) => Promise<void>;
  logout: () => void;
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
    const initAuth = async () => {
      await fetchData();
      const savedUserId = localStorage.getItem('cq_userId');
      const savedUserType = localStorage.getItem('cq_userType');

      if (savedUserId && savedUserType) {
        // Find user in fetched data
        let user: CurrentUser | undefined;
        if (savedUserType === 'student') user = allStudents.find(s => s.id === savedUserId);
        else if (savedUserType === 'faculty') user = allFaculty.find(f => f.id === savedUserId);
        else if (savedUserType === 'club') user = allClubs.find(c => c.id === savedUserId);

        if (user) setCurrentUser(user);
        else setCurrentUser(allStudents[0] || null);
      } else {
        setCurrentUser(allStudents[0] || null);
      }
      setIsLoading(false);
    };
    initAuth();
  }, [isLoading]);

  const login = (user: CurrentUser) => {
    setCurrentUser(user);
    localStorage.setItem('cq_userId', user.id);
    localStorage.setItem('cq_userType', user.type);
  };

  const signUp = async (user: CurrentUser) => {
    const table = user.type === 'student' ? 'students' : user.type === 'faculty' ? 'faculty' : 'clubs';

    // Map data to DB fields
    const dbUser: any = { ...user };
    dbUser.avatar_initials = user.avatarInitials;

    if (user.type === 'student') {
      dbUser.credibility_score = (user as Student).credibilityScore;
      dbUser.projects_completed = (user as Student).projectsCompleted;
      dbUser.active_projects = (user as Student).activeProjects;
      dbUser.avg_rating = (user as Student).avgRating;
      dbUser.hours_logged = (user as Student).hoursLogged;
    } else if (user.type === 'faculty') {
      dbUser.research_areas = (user as Faculty).researchAreas;
      dbUser.projects_posted = (user as Faculty).projectsPosted;
    } else if (user.type === 'club') {
      dbUser.projects_posted = (user as Club).projectsPosted;
      dbUser.founded_year = (user as Club).foundedYear;
    }

    const { error } = await supabase.from(table).insert(dbUser);
    if (!error) {
      await fetchData();
      login(user);
    } else {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('cq_userId');
    localStorage.removeItem('cq_userType');
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
        login,
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
