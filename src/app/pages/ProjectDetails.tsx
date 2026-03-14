import { useState } from "react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Card } from "../components/ui/card";
import {
  ArrowLeft,
  Clock,
  TrendingUp,
  DollarSign,
  Calendar,
  CheckCircle,
  CheckCircle2,
  Users,
  MapPin,
  XCircle,
  Briefcase,
} from "lucide-react";
import { Link, useParams } from "react-router";
import { useAuth } from "../context/AuthContext";
import { PosterProfileModal } from "../components/PosterProfileModal";
import { toast } from "sonner";
import type { Faculty, Club, Student, Project } from "../data/mockData";

const posterTypeColor: Record<string, string> = {
  Professor: "bg-blue-50 text-blue-700",
  "Research Lab": "bg-indigo-50 text-indigo-700",
  "Campus Club": "bg-purple-50 text-purple-700",
  Startup: "bg-emerald-50 text-emerald-700",
};

const difficultyColor: Record<string, string> = {
  Beginner: "bg-green-50 text-green-700",
  Intermediate: "bg-yellow-50 text-yellow-700",
  Advanced: "bg-red-50 text-red-700",
};

// Static deliverables/timeline per difficulty for the demo
function getDeliverables(difficulty: string) {
  const base = [
    "Review existing documentation and onboard to the project tools",
    "Attend weekly sync meetings with the project team",
    "Submit progress updates and a final summary report",
  ];
  if (difficulty === "Beginner") {
    return [
      ...base,
      "Complete assigned tasks with guidance from a senior team member",
    ];
  } else if (difficulty === "Intermediate") {
    return [
      ...base,
      "Own a discrete module or workstream end-to-end",
      "Present findings or deliverables to the team at mid-point",
    ];
  } else {
    return [
      ...base,
      "Design and implement a core technical component independently",
      "Produce a technical write-up or research contribution",
      "Lead a final presentation to stakeholders",
    ];
  }
}

function getTimeline(durationMonths: number) {
  if (durationMonths <= 2) {
    return [
      { period: "Week 1–2", desc: "Onboarding, setup, and planning" },
      { period: "Week 3–6", desc: "Core work and delivery" },
      { period: "Week 7–8", desc: "Review, polish, and handoff" },
    ];
  } else if (durationMonths <= 4) {
    return [
      { period: "Month 1", desc: "Onboarding and initial planning" },
      { period: "Month 2–3", desc: "Core development and execution" },
      { period: "Month 4", desc: "Testing, refinement, and final report" },
    ];
  } else {
    return [
      { period: "Month 1", desc: "Research, onboarding, and planning" },
      { period: "Month 2–4", desc: "Core execution and iterative development" },
      { period: "Month 5–6", desc: "Finalization, presentation, and handoff" },
    ];
  }
}

export function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const {
    currentUser,
    customProjects,
    appliedProjectIds,
    applyToProject,
    withdrawApplication,
    getProjectApplicants,
    allProjects: supabaseProjects,
    allFaculty: supabaseFaculty,
    allClubs: supabaseClubs,
    allStudents: supabaseStudents
  } = useAuth();

  const [showPosterProfile, setShowPosterProfile] = useState(false);

  // Find project from mock data + custom projects
  const allProjects = [...customProjects, ...supabaseProjects];
  const project = allProjects.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="min-h-screen p-4 sm:p-8 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 bg-muted rounded-full flex items-center justify-center mx-auto">
            <Briefcase className="w-7 h-7 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold">Project Not Found</h2>
          <p className="text-muted-foreground text-sm">
            This project may have been removed or the link is invalid.
          </p>
          <Link to="/dashboard/projects">
            <Button variant="outline" className="rounded-lg gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Projects
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const hasApplied = appliedProjectIds.includes(project.id);
  const isStudentUser = currentUser?.type === "student";
  const isProjectOwner = currentUser?.id === project.posterId;

  // Get applicants if user is the project owner
  const applicants = isProjectOwner ? getProjectApplicants(project.id) : [];

  // Find poster info
  const posterFaculty = supabaseFaculty.find((f) => f.id === project.posterId);
  const posterClub = supabaseClubs.find((c) => c.id === project.posterId);
  const posterInfo = posterFaculty || posterClub;

  const posterSubtitle = posterFaculty
    ? `${posterFaculty.title} · ${posterFaculty.department}`
    : posterClub
      ? `${posterClub.category} · ${posterClub.university.split(",")[0]}`
      : project.posterType;

  const posterAvatarColor = posterFaculty
    ? "bg-blue-100 text-blue-700"
    : "bg-purple-100 text-purple-700";

  const deliverables = getDeliverables(project.difficulty);
  const timeline = getTimeline(project.durationMonths);

  const handleApply = () => {
    if (!isStudentUser) return;
    applyToProject(project.id);
    toast.success(`Application submitted for ${project.title}!`, {
      description: "The project poster will review your application.",
    });
  };

  const handleWithdraw = () => {
    withdrawApplication(project.id);
    toast.info(`Withdrew application from ${project.title}`, {
      description: "You can reapply to this project anytime.",
    });
  };

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-5 sm:space-y-6">
        {/* Back Button */}
        <Link to="/dashboard/projects">
          <Button variant="ghost" className="gap-2 -ml-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Button>
        </Link>

        {/* Project Header */}
        <Card className="p-5 sm:p-8 rounded-xl border border-border space-y-5 sm:space-y-6 bg-white/80 backdrop-blur-sm shadow-lg">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${posterTypeColor[project.posterType] ?? "bg-gray-100 text-gray-600"
                    }`}
                >
                  {project.posterType}
                </span>
                {project.postedDaysAgo === 0 && (
                  <Badge className="rounded-full text-xs bg-green-50 text-green-700 border-0">New</Badge>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold mb-4">{project.title}</h1>

              <button
                onClick={() => setShowPosterProfile(true)}
                className="flex items-center gap-3 sm:gap-4 mb-4 hover:opacity-80 transition-opacity cursor-pointer group"
              >
                <Avatar className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                  <AvatarFallback className={posterAvatarColor}>
                    {(posterInfo?.avatarInitials ?? project.poster.slice(0, 2)).slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className="font-semibold group-hover:underline">{project.poster}</p>
                  <p className="text-sm text-muted-foreground">{posterSubtitle}</p>
                </div>
              </button>

              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary" className="flex items-center gap-1 rounded-lg">
                  <Clock className="w-3 h-3" />
                  {project.duration}
                </Badge>
                <span
                  className={`text-xs px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 ${difficultyColor[project.difficulty] ?? "bg-gray-100 text-gray-600"
                    }`}
                >
                  <TrendingUp className="w-3 h-3" />
                  {project.difficulty}
                </span>
                {project.isPaid ? (
                  <div className="flex items-center gap-1 text-green-600 bg-green-50 px-3 py-1 rounded-lg">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm font-medium">{project.compensation ?? "Paid"}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-muted-foreground bg-muted/50 px-3 py-1 rounded-lg">
                    <span className="text-sm font-medium">Unpaid / Credit</span>
                  </div>
                )}
                <Badge variant="secondary" className="flex items-center gap-1 rounded-lg">
                  <Calendar className="w-3 h-3" />
                  {project.postedDaysAgo === 0
                    ? "Today"
                    : project.postedDaysAgo === 1
                      ? "1 day ago"
                      : `${project.postedDaysAgo} days ago`}
                </Badge>
                {project.applicants > 0 && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="w-3 h-3" />
                    {project.applicants} applicants
                  </span>
                )}
                {project.spots > 0 && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {project.spots} spot{project.spots > 1 ? "s" : ""} open
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Apply / Withdraw Button — only for students */}
          {isStudentUser && (
            hasApplied ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-green-800">Application submitted</p>
                    <p className="text-xs text-green-700">Track this in My Projects.</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:bg-destructive/10 rounded-lg text-xs gap-1 flex-shrink-0"
                    onClick={handleWithdraw}
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Withdraw
                  </Button>
                </div>
                <Link to="/dashboard/my-projects">
                  <Button variant="outline" size="lg" className="w-full rounded-xl">
                    View in My Projects
                  </Button>
                </Link>
              </div>
            ) : (
              <Button size="lg" className="w-full rounded-xl" onClick={handleApply}>
                Apply to This Project
              </Button>
            )
          )}

          {/* Non-student view */}
          {!isStudentUser && currentUser && (
            <div className="bg-muted/40 rounded-xl px-4 py-3 text-sm text-muted-foreground">
              You're viewing as a {currentUser.type === "faculty" ? "faculty member" : "club organizer"}. Switch to a student account to apply.
            </div>
          )}

          {!currentUser && (
            <Link to="/login">
              <Button size="lg" className="w-full rounded-xl">
                Log in to Apply
              </Button>
            </Link>
          )}
        </Card>

        {/* Project Description */}
        <Card className="p-5 sm:p-8 rounded-xl border border-border space-y-4">
          <h2 className="text-lg sm:text-xl font-semibold">Description</h2>
          <p className="text-foreground/80 leading-relaxed text-sm sm:text-base">
            {project.description}
          </p>
        </Card>

        {/* Required Skills */}
        <Card className="p-5 sm:p-8 rounded-xl border border-border space-y-4">
          <h2 className="text-lg sm:text-xl font-semibold">Required Skills</h2>
          <div className="flex items-center gap-2 flex-wrap">
            {project.skills.map((skill) => (
              <Badge key={skill} variant="outline" className="rounded-lg">
                {skill}
              </Badge>
            ))}
          </div>
        </Card>

        {/* Deliverables */}
        <Card className="p-5 sm:p-8 rounded-xl border border-border space-y-4 bg-white/80 backdrop-blur-sm shadow-lg">
          <h2 className="text-lg sm:text-xl font-semibold">Deliverables</h2>
          <ul className="space-y-3">
            {deliverables.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm sm:text-base">{item}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Timeline */}
        <Card className="p-5 sm:p-8 rounded-xl border border-border space-y-4 bg-white/80 backdrop-blur-sm shadow-lg">
          <h2 className="text-lg sm:text-xl font-semibold">Timeline</h2>
          <div className="space-y-3">
            {timeline.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm sm:text-base">{step.period}</p>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>



        {/* Applicants Section - Only for Project Owner */}
        {isProjectOwner && applicants.length > 0 && (
          <Card className="p-5 sm:p-6 rounded-xl border border-border">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Users className="w-5 h-5" />
                Applicants
                <Badge variant="secondary" className="rounded-full text-xs">
                  {applicants.length}
                </Badge>
              </h3>
            </div>

            <div className="space-y-3">
              {applicants.map((app) => {
                const student = supabaseStudents.find((s) => s.id === app.studentId);
                if (!student) return null;

                return (
                  <div
                    key={app.studentId}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Avatar className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600">
                        <AvatarFallback className="bg-transparent text-white font-semibold">
                          {student.avatarInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{student.name}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {student.major} · {student.year}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium">{student.credibilityScore} pts</p>
                        <p className="text-xs text-muted-foreground">
                          {student.projectsCompleted} completed
                        </p>
                      </div>
                      <Link to={`/dashboard/credibility?user=${student.id}`}>
                        <Button variant="outline" size="sm" className="rounded-lg">
                          View Profile
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Bottom Apply Button */}
        {isStudentUser && !hasApplied && (
          <div className="pb-4">
            <Button size="lg" className="w-full rounded-xl" onClick={handleApply}>
              Apply to This Project
            </Button>
          </div>
        )}
      </div>

      {/* Poster Profile Modal */}
      {posterInfo && (
        <PosterProfileModal
          open={showPosterProfile}
          onClose={() => setShowPosterProfile(false)}
          poster={posterInfo}
        />
      )}
    </div>
  );
}
