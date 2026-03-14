import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  CheckCircle,
  XCircle,
  User,
  Star,
  Briefcase,
  Clock,
  TrendingUp,
  PlayCircle,
  Award,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { students } from "../data/mockData";
import { StudentProfileModal } from "./StudentProfileModal";
import type { Project, ProjectApplication, ProjectStatus, Student } from "../data/mockData";

interface ApplicantManagementModalProps {
  open: boolean;
  onClose: () => void;
  project: Project;
}

const statusColors: Record<ProjectStatus, { bg: string; text: string; icon: any }> = {
  applied: { bg: "bg-blue-50 text-blue-700 border-blue-200", text: "Pending", icon: Clock },
  selected: { bg: "bg-purple-50 text-purple-700 border-purple-200", text: "Selected", icon: CheckCircle },
  "in-progress": { bg: "bg-amber-50 text-amber-700 border-amber-200", text: "In Progress", icon: PlayCircle },
  completed: { bg: "bg-green-50 text-green-700 border-green-200", text: "Completed", icon: Award },
};

export function ApplicantManagementModal({ open, onClose, project }: ApplicantManagementModalProps) {
  const { getProjectApplicants, approveApplicant, rejectApplicant, startProject, completeProject } = useAuth();
  const [search, setSearch] = useState("");
  const [selectedTab, setSelectedTab] = useState<"all" | ProjectStatus>("all");
  const [ratingInputs, setRatingInputs] = useState<Record<string, number>>({});
  const [hoursInputs, setHoursInputs] = useState<Record<string, number>>({});
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const applicants = getProjectApplicants(project.id);
  
  // Force re-render when actions occur
  const _ = refreshKey;

  // Filter by search
  const filteredApplicants = applicants.filter((app) => {
    const student = students.find((s) => s.id === app.studentId);
    if (!student) return false;

    const matchesSearch =
      search === "" ||
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.major.toLowerCase().includes(search.toLowerCase());

    const matchesTab = selectedTab === "all" || app.status === selectedTab;

    return matchesSearch && matchesTab;
  });

  const tabCounts = {
    all: applicants.length,
    applied: applicants.filter((a) => a.status === "applied").length,
    selected: applicants.filter((a) => a.status === "selected").length,
    "in-progress": applicants.filter((a) => a.status === "in-progress").length,
    completed: applicants.filter((a) => a.status === "completed").length,
  };

  const handleApprove = (studentId: string, studentName: string) => {
    approveApplicant(project.id, studentId);
    toast.success(`${studentName} has been approved!`, {
      description: "They can now start working on the project.",
    });
    setTimeout(() => setRefreshKey((prev) => prev + 1), 500);
  };

  const handleReject = (studentId: string, studentName: string) => {
    rejectApplicant(project.id, studentId);
    toast.error(`${studentName}'s application has been rejected`, {
      description: "They have been removed from the applicant list.",
    });
    setTimeout(() => setRefreshKey((prev) => prev + 1), 500);
  };

  const handleStart = (studentId: string, studentName: string) => {
    startProject(project.id, studentId);
    toast.success(`Project started with ${studentName}!`, {
      description: "The project is now in progress.",
    });
    setTimeout(() => setRefreshKey((prev) => prev + 1), 500);
  };

  const handleComplete = (studentId: string, studentName: string) => {
    const rating = ratingInputs[studentId] || 5;
    const hours = hoursInputs[studentId] || 0;
    completeProject(project.id, studentId, rating, hours);
    toast.success(`Project completed with ${studentName}!`, {
      description: `Rated ${rating.toFixed(1)} stars · ${hours} hours logged`,
    });
    setTimeout(() => setRefreshKey((prev) => prev + 1), 500);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Manage Applicants — {project.title}
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Review applications, approve candidates, and track project progress
          </p>
        </DialogHeader>

        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or major..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 rounded-lg"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Button
              variant={selectedTab === "all" ? "default" : "outline"}
              size="sm"
              className="rounded-lg flex-shrink-0"
              onClick={() => setSelectedTab("all")}
            >
              All
              <Badge variant="secondary" className="ml-1.5 rounded-full bg-white/20 text-xs">
                {tabCounts.all}
              </Badge>
            </Button>
            <Button
              variant={selectedTab === "applied" ? "default" : "outline"}
              size="sm"
              className="rounded-lg flex-shrink-0"
              onClick={() => setSelectedTab("applied")}
            >
              Pending
              {tabCounts.applied > 0 && (
                <Badge variant="secondary" className="ml-1.5 rounded-full bg-white/20 text-xs">
                  {tabCounts.applied}
                </Badge>
              )}
            </Button>
            <Button
              variant={selectedTab === "selected" ? "default" : "outline"}
              size="sm"
              className="rounded-lg flex-shrink-0"
              onClick={() => setSelectedTab("selected")}
            >
              Selected
              {tabCounts.selected > 0 && (
                <Badge variant="secondary" className="ml-1.5 rounded-full bg-white/20 text-xs">
                  {tabCounts.selected}
                </Badge>
              )}
            </Button>
            <Button
              variant={selectedTab === "in-progress" ? "default" : "outline"}
              size="sm"
              className="rounded-lg flex-shrink-0"
              onClick={() => setSelectedTab("in-progress")}
            >
              Active
              {tabCounts["in-progress"] > 0 && (
                <Badge variant="secondary" className="ml-1.5 rounded-full bg-white/20 text-xs">
                  {tabCounts["in-progress"]}
                </Badge>
              )}
            </Button>
            <Button
              variant={selectedTab === "completed" ? "default" : "outline"}
              size="sm"
              className="rounded-lg flex-shrink-0"
              onClick={() => setSelectedTab("completed")}
            >
              Completed
              {tabCounts.completed > 0 && (
                <Badge variant="secondary" className="ml-1.5 rounded-full bg-white/20 text-xs">
                  {tabCounts.completed}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Applicants List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {filteredApplicants.length === 0 ? (
            <div className="text-center py-12">
              <User className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-sm text-muted-foreground">
                {search
                  ? "No applicants match your search"
                  : selectedTab === "all"
                  ? "No applicants yet"
                  : `No ${selectedTab} applicants`}
              </p>
            </div>
          ) : (
            filteredApplicants.map((app) => {
              const student = students.find((s) => s.id === app.studentId);
              if (!student) return null;

              const StatusIcon = statusColors[app.status].icon;

              return (
                <div
                  key={app.studentId}
                  className="p-4 rounded-xl border border-border hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <Avatar className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0">
                      <AvatarFallback className="bg-transparent text-white font-semibold">
                        {student.avatarInitials}
                      </AvatarFallback>
                    </Avatar>

                    {/* Student Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold truncate">{student.name}</h4>
                          <p className="text-sm text-muted-foreground truncate">
                            {student.major} · {student.year}
                          </p>
                        </div>
                        <Badge className={`rounded-lg text-xs border ${statusColors[app.status].bg}`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusColors[app.status].text}
                        </Badge>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {student.credibilityScore} pts
                        </span>
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-3 h-3" />
                          {student.projectsCompleted} completed
                        </span>
                        {student.avgRating > 0 && (
                          <span className="flex items-center gap-1 text-amber-600">
                            <Star className="w-3 h-3 fill-current" />
                            {student.avgRating.toFixed(1)}
                          </span>
                        )}
                      </div>

                      {/* Skills Preview */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {student.skills.slice(0, 5).map((skill, i) => (
                          <Badge key={i} variant="secondary" className="rounded-full text-xs px-2 py-0">
                            {skill}
                          </Badge>
                        ))}
                        {student.skills.length > 5 && (
                          <Badge variant="secondary" className="rounded-full text-xs px-2 py-0">
                            +{student.skills.length - 5} more
                          </Badge>
                        )}
                      </div>

                      {/* Actions based on status */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {app.status === "applied" && (
                          <>
                            <Button
                              size="sm"
                              className="rounded-lg gap-1"
                              onClick={() => handleApprove(student.id, student.name)}
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="rounded-lg gap-1 text-destructive hover:bg-destructive/10"
                              onClick={() => handleReject(student.id, student.name)}
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              Reject
                            </Button>
                          </>
                        )}

                        {app.status === "selected" && (
                          <Button
                            size="sm"
                            className="rounded-lg gap-1"
                            onClick={() => handleStart(student.id, student.name)}
                          >
                            <PlayCircle className="w-3.5 h-3.5" />
                            Start Project
                          </Button>
                        )}

                        {app.status === "in-progress" && (
                          <div className="flex items-center gap-2 flex-wrap w-full">
                            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                              <div className="flex items-center gap-1.5">
                                <Label className="text-xs whitespace-nowrap">Rating:</Label>
                                <Input
                                  type="number"
                                  min="1"
                                  max="5"
                                  step="0.5"
                                  placeholder="5.0"
                                  value={ratingInputs[student.id] || ""}
                                  onChange={(e) =>
                                    setRatingInputs((prev) => ({
                                      ...prev,
                                      [student.id]: parseFloat(e.target.value) || 5,
                                    }))
                                  }
                                  className="w-16 h-8 text-xs rounded-lg"
                                />
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Label className="text-xs whitespace-nowrap">Hours:</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  placeholder="0"
                                  value={hoursInputs[student.id] || ""}
                                  onChange={(e) =>
                                    setHoursInputs((prev) => ({
                                      ...prev,
                                      [student.id]: parseInt(e.target.value) || 0,
                                    }))
                                  }
                                  className="w-16 h-8 text-xs rounded-lg"
                                />
                              </div>
                            </div>
                            <Button
                              size="sm"
                              className="rounded-lg gap-1"
                              onClick={() => handleComplete(student.id, student.name)}
                            >
                              <Award className="w-3.5 h-3.5" />
                              Mark Complete
                            </Button>
                          </div>
                        )}

                        {app.status === "completed" && (
                          <div className="flex items-center gap-3 text-xs">
                            <span className="flex items-center gap-1 text-amber-600">
                              <Star className="w-3.5 h-3.5 fill-current" />
                              {app.rating?.toFixed(1)} rating
                            </span>
                            {app.hoursSpent && (
                              <span className="flex items-center gap-1 text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                {app.hoursSpent}h
                              </span>
                            )}
                          </div>
                        )}

                        <Button
                          size="sm"
                          variant="ghost"
                          className="rounded-lg gap-1 ml-auto"
                          onClick={() => setSelectedStudent(student)}
                        >
                          View Profile
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            {applicants.length} total applicant{applicants.length !== 1 ? "s" : ""}
          </p>
          <Button variant="outline" onClick={onClose} className="rounded-lg">
            Close
          </Button>
        </div>
      </DialogContent>

      {/* Student Profile Modal */}
      {selectedStudent && (
        <StudentProfileModal
          open={!!selectedStudent}
          onClose={() => setSelectedStudent(null)}
          student={selectedStudent}
        />
      )}
    </Dialog>
  );
}
