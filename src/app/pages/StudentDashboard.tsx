import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { ProjectCard } from "../components/ProjectCard";
import { PostProjectModal } from "../components/PostProjectModal";
import { ApplicantManagementModal } from "../components/ApplicantManagementModal";
import {
  Award,
  TrendingUp,
  Clock,
  Star,
  Users,
  Zap,
  ArrowRight,
  Briefcase,
  FileText,
  Plus,
  GraduationCap
} from "lucide-react";
import { useState, useMemo } from "react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import type { Student, Faculty, Club, Project } from "../data/mockData";

const recentActivity = [
  { icon: Star, color: "text-yellow-500 bg-yellow-50", text: "You received a 5-star rating on 'Website Redesign'", time: "2h ago" },
  { icon: Award, color: "text-purple-500 bg-purple-50", text: "You earned the 'Research Pro' badge", time: "1d ago" },
  { icon: Zap, color: "text-blue-500 bg-blue-50", text: "New project match: ML Model for Student Learning", time: "1d ago" },
  { icon: TrendingUp, color: "text-green-500 bg-green-50", text: "Your credibility score increased by +25 pts", time: "3d ago" },
];

// ─── Student Dashboard ─────────────────────────────────
function StudentView({ student, recommendedProjects, activePosters, communityStats }: {
  student: Student;
  recommendedProjects: Project[];
  activePosters: any[];
  communityStats: any
}) {
  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        <Card className="p-4 sm:p-5 rounded-xl border border-border bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 sm:w-11 sm:h-11 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Award className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold">{student.credibilityScore}</p>
              <p className="text-xs text-muted-foreground">Credibility Score</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-5 rounded-xl border border-border bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 sm:w-11 sm:h-11 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold">{student.projectsCompleted}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-5 rounded-xl border border-border bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 sm:w-11 sm:h-11 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold">{student.activeProjects}</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-5 rounded-xl border border-border bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 sm:w-11 sm:h-11 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold">{student.avgRating || "—"}</p>
              <p className="text-xs text-muted-foreground">Avg Rating</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* Recommended Projects — takes 2/3 width on desktop */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold">Recommended for You</h2>
            <Link
              to="/dashboard/projects"
              className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
              View all
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recommendedProjects.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4 sm:space-y-5">
          {/* Skills */}
          <Card className="p-4 sm:p-5 rounded-xl border border-border space-y-3 bg-white/80 backdrop-blur-sm shadow-md">
            <h3 className="font-semibold">Your Skills</h3>
            <div className="flex flex-wrap gap-1.5">
              {student.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="rounded-lg text-xs">
                  {skill}
                </Badge>
              ))}
              {student.skills.length === 0 && (
                <p className="text-xs text-muted-foreground">No skills added yet.</p>
              )}
            </div>
            <Link to="/dashboard/profile" className="text-xs text-primary hover:underline block">
              + Add skills
            </Link>
          </Card>

          {/* Recent Activity */}
          <Card className="p-4 sm:p-5 rounded-xl border border-border space-y-3 bg-white/80 backdrop-blur-sm shadow-md">
            <h3 className="font-semibold">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivity.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${item.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-foreground/80 leading-snug">{item.text}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Active Posters */}
          <Card className="p-4 sm:p-5 rounded-xl border border-border space-y-3 bg-white/80 backdrop-blur-sm shadow-md">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Active Posters</h3>
              <Badge variant="secondary" className="text-xs rounded-full">
                {communityStats.faculty + communityStats.clubs} total
              </Badge>
            </div>
            <div className="space-y-2.5">
              {activePosters.map((poster, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <Avatar className="w-7 h-7 flex-shrink-0">
                    <AvatarFallback className={`text-xs ${poster.color}`}>
                      {poster.initials?.slice(0, 2) || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{poster.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{poster.role}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              to="/dashboard/projects"
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              Browse all posters
              <ArrowRight className="w-3 h-3" />
            </Link>
          </Card>

          {/* Community Stats */}
          <Card className="p-4 sm:p-5 rounded-xl border border-border space-y-3 bg-white/80 backdrop-blur-sm shadow-md">
            <h3 className="font-semibold">Community Stats</h3>
            <div className="space-y-2">
              {[
                { icon: Users, label: "Students", value: communityStats.students },
                { icon: Award, label: "Faculty", value: communityStats.faculty },
                { icon: TrendingUp, label: "Clubs", value: communityStats.clubs },
                { icon: Clock, label: "Open Projects", value: communityStats.openProjects },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon className="w-3.5 h-3.5" />
                    <span>{label}</span>
                  </div>
                  <span className="text-sm font-semibold">{value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

// ─── Faculty Dashboard ─────────────────────────────────
function FacultyView({ facultyUser, customProjects, allProjects, allStudents, allFaculty, allClubs }: {
  facultyUser: Faculty;
  customProjects: Project[];
  allProjects: Project[];
  allStudents: Student[];
  allFaculty: Faculty[];
  allClubs: Club[];
}) {
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Projects posted by this faculty
  const myPostedProjects = [
    ...allProjects.filter((p) => p.posterId === facultyUser.id),
    ...customProjects,
  ];

  const totalApplicants = myPostedProjects.reduce((sum, p) => sum + p.applicants, 0);

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        <Card className="p-4 sm:p-5 rounded-xl border border-border bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 sm:w-11 sm:h-11 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold">{myPostedProjects.length}</p>
              <p className="text-xs text-muted-foreground">Projects Posted</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 sm:p-5 rounded-xl border border-border bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 sm:w-11 sm:h-11 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold">{totalApplicants}</p>
              <p className="text-xs text-muted-foreground">Total Applicants</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 sm:p-5 rounded-xl border border-border bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 sm:w-11 sm:h-11 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Award className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold">{facultyUser.researchAreas.length}</p>
              <p className="text-xs text-muted-foreground">Research Areas</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 sm:p-5 rounded-xl border border-border bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 sm:w-11 sm:h-11 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold">{allStudents.length}</p>
              <p className="text-xs text-muted-foreground">Students Available</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold">Your Posted Projects</h2>
            <Button size="sm" className="rounded-lg gap-1.5" onClick={() => setPostModalOpen(true)}>
              <Plus className="w-3.5 h-3.5" />
              Post New
            </Button>
          </div>
          {myPostedProjects.length === 0 ? (
            <Card className="p-8 rounded-xl border border-border border-dashed text-center space-y-3">
              <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="font-medium">No projects posted yet</p>
              <p className="text-sm text-muted-foreground">Post your first project to start receiving applications from talented students.</p>
              <Button size="sm" className="rounded-lg" onClick={() => setPostModalOpen(true)}>
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                Post a Project
              </Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {myPostedProjects.slice(0, 4).map((project) => (
                <Card key={project.id} className="p-4 rounded-xl border border-border">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold mb-1 truncate">{project.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">{project.description}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {project.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {project.applicants} applicants
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {project.applicants > 0 && (
                        <Button
                          size="sm"
                          className="rounded-lg gap-1"
                          onClick={() => setSelectedProject(project)}
                        >
                          <Users className="w-3.5 h-3.5" />
                          Manage
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
              {myPostedProjects.length > 4 && (
                <Link to="/dashboard/my-projects">
                  <Button variant="outline" size="sm" className="w-full rounded-lg">
                    View All Projects
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>

        <div className="space-y-4 sm:space-y-5">
          {/* Research Areas */}
          <Card className="p-4 sm:p-5 rounded-xl border border-border space-y-3 bg-white/80 backdrop-blur-sm shadow-md">
            <h3 className="font-semibold">Research Areas</h3>
            <div className="flex flex-wrap gap-1.5">
              {facultyUser.researchAreas.map((area) => (
                <Badge key={area} variant="secondary" className="rounded-lg text-xs">{area}</Badge>
              ))}
            </div>
            <Link to="/dashboard/profile" className="text-xs text-primary hover:underline block">
              Edit profile
            </Link>
          </Card>

          {/* Recent Activity */}
          <Card className="p-4 sm:p-5 rounded-xl border border-border space-y-3 bg-white/80 backdrop-blur-sm shadow-md">
            <h3 className="font-semibold">Recent Activity</h3>
            <div className="space-y-3">
              {[
                { icon: Users, color: "text-blue-500 bg-blue-50", text: "3 new applications to your ML project", time: "2h ago" },
                { icon: Star, color: "text-yellow-500 bg-yellow-50", text: "Student completed 'User Research' milestone", time: "1d ago" },
                { icon: Zap, color: "text-green-500 bg-green-50", text: "New student match for your open project", time: "2d ago" },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${item.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-foreground/80 leading-snug">{item.text}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Community Stats */}
          <Card className="p-4 sm:p-5 rounded-xl border border-border space-y-3 bg-white/80 backdrop-blur-sm shadow-md">
            <h3 className="font-semibold">Community Stats</h3>
            <div className="space-y-2">
              {[
                { icon: Users, label: "Students", value: allStudents.length },
                { icon: Award, label: "Faculty", value: allFaculty.length },
                { icon: TrendingUp, label: "Clubs", value: allClubs.length },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon className="w-3.5 h-3.5" />
                    <span>{label}</span>
                  </div>
                  <span className="text-sm font-semibold">{value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <PostProjectModal open={postModalOpen} onClose={() => setPostModalOpen(false)} />

      {selectedProject && (
        <ApplicantManagementModal
          open={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          project={selectedProject}
        />
      )}
    </>
  );
}

// ─── Club Dashboard ─────────────────────────────────
function ClubView({ club, customProjects, allProjects, allStudents, allFaculty, allClubs }: {
  club: Club;
  customProjects: Project[];
  allProjects: Project[];
  allStudents: Student[];
  allFaculty: Faculty[];
  allClubs: Club[];
}) {
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const myPostedProjects = [
    ...allProjects.filter((p) => p.posterId === club.id),
    ...customProjects,
  ];

  const totalApplicants = myPostedProjects.reduce((sum, p) => sum + p.applicants, 0);

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        <Card className="p-4 sm:p-5 rounded-xl border border-border bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 sm:w-11 sm:h-11 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Award className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold">{club.foundedYear}</p>
              <p className="text-xs text-muted-foreground">Founded</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 sm:p-5 rounded-xl border border-border bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 sm:w-11 sm:h-11 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold">{myPostedProjects.length}</p>
              <p className="text-xs text-muted-foreground">Projects Posted</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 sm:p-5 rounded-xl border border-border bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 sm:w-11 sm:h-11 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold">{totalApplicants}</p>
              <p className="text-xs text-muted-foreground">Total Applicants</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 sm:p-5 rounded-xl border border-border bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 sm:w-11 sm:h-11 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold">{new Date().getFullYear() - club.foundedYear}</p>
              <p className="text-xs text-muted-foreground">Years Active</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold">Your Posted Projects</h2>
            <Button size="sm" className="rounded-lg gap-1.5" onClick={() => setPostModalOpen(true)}>
              <Plus className="w-3.5 h-3.5" />
              Post New
            </Button>
          </div>
          {myPostedProjects.length === 0 ? (
            <Card className="p-8 rounded-xl border border-border border-dashed text-center space-y-3">
              <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="font-medium">No projects posted yet</p>
              <p className="text-sm text-muted-foreground">Post a project to connect with talented students.</p>
              <Button size="sm" className="rounded-lg" onClick={() => setPostModalOpen(true)}>
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                Post a Project
              </Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {myPostedProjects.slice(0, 4).map((project) => (
                <Card key={project.id} className="p-4 rounded-xl border border-border">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold mb-1 truncate">{project.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">{project.description}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {project.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {project.applicants} applicants
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {project.applicants > 0 && (
                        <Button
                          size="sm"
                          className="rounded-lg gap-1"
                          onClick={() => setSelectedProject(project)}
                        >
                          <Users className="w-3.5 h-3.5" />
                          Manage
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
              {myPostedProjects.length > 4 && (
                <Link to="/dashboard/my-projects">
                  <Button variant="outline" size="sm" className="w-full rounded-lg">
                    View All Projects
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>

        <div className="space-y-4 sm:space-y-5">
          <Card className="p-4 sm:p-5 rounded-xl border border-border space-y-3 bg-white/80 backdrop-blur-sm shadow-md">
            <h3 className="font-semibold">About {club.name}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{club.description}</p>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="rounded-full text-xs">
                {club.category}
              </Badge>
              <span className="text-xs text-muted-foreground">Founded {club.foundedYear}</span>
            </div>
            <Link to="/dashboard/profile" className="text-xs text-primary hover:underline block">
              Edit profile
            </Link>
          </Card>

          <Card className="p-4 sm:p-5 rounded-xl border border-border space-y-3 bg-white/80 backdrop-blur-sm shadow-md">
            <h3 className="font-semibold">Community Stats</h3>
            <div className="space-y-2">
              {[
                { icon: Users, label: "Students", value: allStudents.length },
                { icon: Award, label: "Faculty", value: allFaculty.length },
                { icon: TrendingUp, label: "Clubs", value: allClubs.length },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon className="w-3.5 h-3.5" />
                    <span>{label}</span>
                  </div>
                  <span className="text-sm font-semibold">{value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <PostProjectModal open={postModalOpen} onClose={() => setPostModalOpen(false)} />

      {selectedProject && (
        <ApplicantManagementModal
          open={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          project={selectedProject}
        />
      )}
    </>
  );
}

// ─── Main Component ────────────────────────────────────
export function StudentDashboard() {
  const { currentUser, customProjects, allProjects, allStudents, allFaculty, allClubs } = useAuth();

  if (!currentUser) return null;

  const recommendedProjects = allProjects.slice(0, 4);

  const activePosters = [
    ...allFaculty.slice(0, 3).map((f) => ({
      name: f.name,
      role: f.title,
      initials: f.avatarInitials,
      color: "bg-blue-100 text-blue-700",
    })),
    ...allClubs.slice(0, 2).map((c) => ({
      name: c.name,
      role: c.category,
      initials: c.avatarInitials,
      color: "bg-purple-100 text-purple-700",
    })),
  ];

  const communityStats = {
    students: allStudents.length,
    faculty: allFaculty.length,
    clubs: allClubs.length,
    openProjects: allProjects.length
  };

  const firstName =
    currentUser.type === "student" || currentUser.type === "faculty"
      ? (currentUser as Student | Faculty).name.split(" ")[0]
      : (currentUser as Club).name;

  const welcomeSubtitle =
    currentUser.type === "student"
      ? `${(currentUser as Student).major} • ${(currentUser as Student).year}`
      : currentUser.type === "faculty"
        ? `${(currentUser as Faculty).title} • ${(currentUser as Faculty).department}`
        : `${(currentUser as Club).category} Club • ${(currentUser as Club).university.split(",")[0]}`;

  const topBadge =
    currentUser.type === "student"
      ? "Top 15%"
      : currentUser.type === "faculty"
        ? "Faculty"
        : "Club";

  const avatarColor =
    currentUser.type === "student"
      ? "bg-primary text-primary-foreground"
      : currentUser.type === "faculty"
        ? "bg-blue-600 text-white"
        : "bg-purple-600 text-white";

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Welcome Section */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <Avatar className="w-11 h-11 sm:w-14 sm:h-14 flex-shrink-0">
              <AvatarFallback className={`text-base sm:text-lg ${avatarColor}`}>
                {currentUser.avatarInitials?.slice(0, 2) ?? "?"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">
                Welcome back, {firstName}!
              </h1>
              <p className="text-sm text-muted-foreground">
                {welcomeSubtitle}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Badge variant="secondary" className="rounded-full px-2 sm:px-3 text-xs sm:text-sm whitespace-nowrap">
              {topBadge}
            </Badge>
          </div>
        </div>

        {/* Render account-type-specific dashboard */}
        {currentUser.type === "student" && (
          <StudentView
            student={currentUser as Student}
            recommendedProjects={recommendedProjects}
            activePosters={activePosters}
            communityStats={communityStats}
          />
        )}
        {currentUser.type === "faculty" && (
          <FacultyView
            facultyUser={currentUser as Faculty}
            customProjects={customProjects}
            allProjects={allProjects}
            allStudents={allStudents}
            allFaculty={allFaculty}
            allClubs={allClubs}
          />
        )}
        {currentUser.type === "club" && (
          <ClubView
            club={currentUser as Club}
            customProjects={customProjects}
            allProjects={allProjects}
            allStudents={allStudents}
            allFaculty={allFaculty}
            allClubs={allClubs}
          />
        )}
      </div>
    </div>
  );
}