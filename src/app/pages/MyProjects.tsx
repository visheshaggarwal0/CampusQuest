import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import {
  Clock,
  CheckCircle,
  Briefcase,
  Star,
  XCircle,
  Plus,
  FileText,
  TrendingUp,
  Loader,
  PlayCircle,
  Users,
} from "lucide-react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import type { Student, ProjectStatus, Project } from "../data/mockData";
import { PostProjectModal } from "../components/PostProjectModal";
import { ApplicantManagementModal } from "../components/ApplicantManagementModal";
import { useState } from "react";

const posterTypeColor: Record<string, string> = {
  Professor: "bg-blue-50 text-blue-700",
  "Research Lab": "bg-indigo-50 text-indigo-700",
  "Campus Club": "bg-purple-50 text-purple-700",
  Startup: "bg-emerald-50 text-emerald-700",
};

const statusColors: Record<ProjectStatus, { bg: string; text: string; icon: any }> = {
  applied: { bg: "bg-blue-50 text-blue-700", text: "Applied", icon: Loader },
  selected: { bg: "bg-purple-50 text-purple-700", text: "Selected", icon: CheckCircle },
  "in-progress": { bg: "bg-amber-50 text-amber-700", text: "In Progress", icon: PlayCircle },
  completed: { bg: "bg-green-50 text-green-700", text: "Completed", icon: CheckCircle },
};

// ── Student View ────────────────────────────────────────
function StudentMyProjects() {
  const { getMyProjects, withdrawApplication, customProjects, currentUser, allProjects: supabaseProjects } = useAuth();

  const allProjects = [...customProjects, ...supabaseProjects];
  const myProjectApplications = getMyProjects();
  const student = currentUser as Student;

  // Categorize projects by status
  const appliedProjects = myProjectApplications
    .filter((app) => app.status === "applied")
    .map((app) => {
      const project = allProjects.find((p) => p.id === app.projectId);
      return { ...app, project };
    })
    .filter((item) => item.project);

  const activeProjects = myProjectApplications
    .filter((app) => app.status === "selected" || app.status === "in-progress")
    .map((app) => {
      const project = allProjects.find((p) => p.id === app.projectId);
      return { ...app, project };
    })
    .filter((item) => item.project);

  const completedProjects = myProjectApplications
    .filter((app) => app.status === "completed")
    .map((app) => {
      const project = allProjects.find((p) => p.id === app.projectId);
      return { ...app, project };
    })
    .filter((item) => item.project);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">My Projects</h1>
          <p className="text-muted-foreground text-sm">Track your applications and completed projects</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Badge variant="secondary" className="rounded-full text-sm px-3">
            {student?.credibilityScore ?? 0} pts
          </Badge>
        </div>
      </div>

      {/* Pending Applications */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-semibold">
            Applications
            {appliedProjects.length > 0 && (
              <Badge variant="secondary" className="ml-2 rounded-full text-xs">
                {appliedProjects.length}
              </Badge>
            )}
          </h2>
          <Link to="/dashboard/projects">
            <Button variant="outline" size="sm" className="rounded-lg gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              Find More
            </Button>
          </Link>
        </div>

        {appliedProjects.length === 0 ? (
          <Card className="p-8 rounded-xl border border-border border-dashed text-center space-y-3">
            <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center mx-auto">
              <Briefcase className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="font-medium">No pending applications</p>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              Browse projects and apply to ones that match your skills.
            </p>
            <Link to="/dashboard/projects">
              <Button size="sm" className="rounded-lg mt-1">Browse Projects</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {appliedProjects.map((item) => {
              const project = item.project!;
              return (
                <Card key={project.id} className="p-5 sm:p-6 rounded-xl border border-border space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base mb-1 truncate">{project.title}</h3>
                      <p className="text-sm text-muted-foreground truncate">{project.poster}</p>
                    </div>
                    <Badge
                      className={`rounded-lg flex-shrink-0 text-xs ${posterTypeColor[project.posterType] ?? "bg-gray-100 text-gray-600"
                        }`}
                    >
                      {project.posterType}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {project.duration}
                    </span>
                    {project.isPaid && (
                      <span className="text-green-600 font-medium">
                        {project.compensation ?? "Paid"}
                      </span>
                    )}
                    <Badge variant="secondary" className={`rounded-full text-xs px-2 py-0 ${statusColors.applied.bg}`}>
                      {statusColors.applied.text}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <Link to={`/dashboard/projects/${project.id}`}>
                      <Button size="sm" className="rounded-lg">View Details</Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:bg-destructive/10 rounded-lg gap-1 text-xs"
                      onClick={() => withdrawApplication(project.id)}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Withdraw
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Active Projects (Selected + In Progress) */}
      {activeProjects.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-semibold">
            Active Projects
            <Badge variant="secondary" className="ml-2 rounded-full text-xs">
              {activeProjects.length}
            </Badge>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {activeProjects.map((item) => {
              const project = item.project!;
              const StatusIcon = statusColors[item.status].icon;
              return (
                <Card key={project.id} className="p-5 sm:p-6 rounded-xl border border-border space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base mb-1 truncate">{project.title}</h3>
                      <p className="text-sm text-muted-foreground truncate">{project.poster}</p>
                    </div>
                    <Badge
                      className={`rounded-lg flex-shrink-0 text-xs ${posterTypeColor[project.posterType] ?? "bg-gray-100 text-gray-600"
                        }`}
                    >
                      {project.posterType}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {project.duration}
                    </span>
                    <Badge className={`rounded-full text-xs px-2 py-0 gap-1 ${statusColors[item.status].bg}`}>
                      <StatusIcon className="w-3 h-3" />
                      {statusColors[item.status].text}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <Link to={`/dashboard/projects/${project.id}`}>
                      <Button size="sm" className="rounded-lg">View Details</Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Completed Projects */}
      {completedProjects.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-semibold">
            Completed Projects
            <Badge variant="secondary" className="ml-2 rounded-full text-xs">
              {completedProjects.length}
            </Badge>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {completedProjects.map((item) => {
              const project = item.project!;
              return (
                <Card key={project.id} className="p-5 sm:p-6 rounded-xl border border-border space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base mb-1 truncate">{project.title}</h3>
                      <p className="text-sm text-muted-foreground truncate">{project.poster}</p>
                    </div>
                    <Badge className={`rounded-lg flex-shrink-0 text-xs ${statusColors.completed.bg}`}>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {statusColors.completed.text}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    {item.rating && (
                      <div className="flex items-center gap-1 text-amber-600">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="font-medium">{item.rating.toFixed(1)}</span>
                      </div>
                    )}
                    {item.hoursSpent && (
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.hoursSpent}h logged
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <Link to={`/dashboard/projects/${project.id}`}>
                      <Button size="sm" variant="outline" className="rounded-lg">View Details</Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state for all */}
      {myProjectApplications.length === 0 && (
        <Card className="p-12 rounded-xl border border-border border-dashed text-center space-y-4">
          <div className="w-16 h-16 bg-muted rounded-xl flex items-center justify-center mx-auto">
            <Briefcase className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <p className="font-semibold text-lg mb-1">No projects yet</p>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Start building your credibility by applying to projects that match your skills and interests.
            </p>
          </div>
          <Link to="/dashboard/projects">
            <Button size="lg" className="rounded-lg mt-2">
              <Plus className="w-4 h-4 mr-1.5" />
              Browse Projects
            </Button>
          </Link>
        </Card>
      )}
    </div>
  );
}

// ── Faculty / Club View ──────────────────────────────────
function FacultyClubMyProjects() {
  const { currentUser, customProjects, allProjects: supabaseProjects } = useAuth();
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const postedProjects = [...customProjects, ...supabaseProjects].filter(
    (p) => p.posterId === currentUser?.id
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">My Projects</h1>
          <p className="text-muted-foreground text-sm">Manage projects you've posted</p>
        </div>
        <Button size="default" className="rounded-lg gap-1.5" onClick={() => setPostModalOpen(true)}>
          <Plus className="w-4 h-4" />
          Post Project
        </Button>
      </div>

      {postedProjects.length === 0 ? (
        <Card className="p-12 rounded-xl border border-border border-dashed text-center space-y-4">
          <div className="w-16 h-16 bg-muted rounded-xl flex items-center justify-center mx-auto">
            <FileText className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <p className="font-semibold text-lg mb-1">No projects posted yet</p>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Post your first project to start receiving applications from talented students.
            </p>
          </div>
          <Button size="lg" className="rounded-lg mt-2" onClick={() => setPostModalOpen(true)}>
            <Plus className="w-4 h-4 mr-1.5" />
            Post a Project
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {postedProjects.map((project) => (
            <Card key={project.id} className="p-6 rounded-xl border border-border">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{project.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-wrap text-xs text-muted-foreground mt-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {project.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {project.applicants} applicants
                    </span>
                    <Badge variant="outline" className="rounded-full text-xs">
                      {project.spots} {project.spots === 1 ? "spot" : "spots"}
                    </Badge>
                    {project.isPaid && (
                      <Badge className="rounded-full text-xs bg-green-50 text-green-700">
                        {project.compensation}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {project.applicants > 0 && (
                    <Button
                      size="sm"
                      className="rounded-lg gap-1.5"
                      onClick={() => setSelectedProject(project)}
                    >
                      <Users className="w-3.5 h-3.5" />
                      Manage Applicants
                      <Badge variant="secondary" className="ml-1 rounded-full bg-white/20 text-xs">
                        {project.applicants}
                      </Badge>
                    </Button>
                  )}
                  <Link to={`/dashboard/projects/${project.id}`}>
                    <Button variant="outline" size="sm" className="rounded-lg">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <PostProjectModal open={postModalOpen} onClose={() => setPostModalOpen(false)} />

      {selectedProject && (
        <ApplicantManagementModal
          open={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          project={selectedProject}
        />
      )}
    </div>
  );
}

// ── Main Export ──────────────────────────────────────────
export function MyProjects() {
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  return currentUser.type === "student" ? <StudentMyProjects /> : <FacultyClubMyProjects />;
}
