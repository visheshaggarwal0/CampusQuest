import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Plus, X, CheckCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import type { Project } from "../data/mockData";

interface PostProjectModalProps {
  open: boolean;
  onClose: () => void;
}

const DURATION_OPTIONS = [
  { label: "1 month", months: 1 },
  { label: "2 months", months: 2 },
  { label: "3 months", months: 3 },
  { label: "4 months", months: 4 },
  { label: "5 months", months: 5 },
  { label: "6 months", months: 6 },
];

const DIFFICULTY_OPTIONS: Array<"Beginner" | "Intermediate" | "Advanced"> = [
  "Beginner",
  "Intermediate",
  "Advanced",
];

const POSTER_TYPE_OPTIONS: Array<Project["posterType"]> = [
  "Professor",
  "Research Lab",
  "Campus Club",
  "Startup",
];

export function PostProjectModal({ open, onClose }: PostProjectModalProps) {
  const { currentUser, addProject } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("2 months");
  const [durationMonths, setDurationMonths] = useState(2);
  const [difficulty, setDifficulty] = useState<"Beginner" | "Intermediate" | "Advanced">(
    "Intermediate"
  );
  const [isPaid, setIsPaid] = useState(false);
  const [compensation, setCompensation] = useState("");
  const [spots, setSpots] = useState("2");
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  // Auto-set poster type based on account type
  const defaultPosterType: Project["posterType"] =
    currentUser?.type === "faculty"
      ? "Professor"
      : currentUser?.type === "club"
      ? "Campus Club"
      : "Startup";
  const [posterType, setPosterType] = useState<Project["posterType"]>(defaultPosterType);

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) setSkills((p) => [...p, s]);
    setSkillInput("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const posterName =
      currentUser.type === "faculty"
        ? (currentUser as any).name
        : currentUser.type === "club"
        ? (currentUser as any).name
        : (currentUser as any).name;

    const newProject: Project = {
      id: `proj_${Date.now()}`,
      title: title.trim(),
      poster: posterName,
      posterId: currentUser.id,
      posterType,
      duration,
      durationMonths,
      difficulty,
      isPaid,
      compensation: isPaid ? compensation.trim() : undefined,
      skills,
      description: description.trim(),
      postedDaysAgo: 0,
      applicants: 0,
      spots: parseInt(spots, 10) || 1,
    };

    addProject(newProject);
    setSubmitted(true);
  };

  const handleClose = () => {
    // Reset form
    setTitle("");
    setDescription("");
    setDuration("2 months");
    setDurationMonths(2);
    setDifficulty("Intermediate");
    setIsPaid(false);
    setCompensation("");
    setSpots("2");
    setSkillInput("");
    setSkills([]);
    setSubmitted(false);
    setPosterType(defaultPosterType);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl">
        {submitted ? (
          /* ── Success State ── */
          <div className="flex flex-col items-center justify-center py-10 text-center gap-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold">Project Posted!</h3>
              <p className="text-muted-foreground text-sm">
                Your project is now live and visible to students in the Browse Projects feed.
              </p>
            </div>
            <Button onClick={handleClose} className="rounded-lg mt-2">
              Done
            </Button>
          </div>
        ) : (
          /* ── Form ── */
          <form onSubmit={handleSubmit} className="space-y-5">
            <DialogHeader>
              <DialogTitle>Post a New Project</DialogTitle>
              <p className="text-sm text-muted-foreground">
                Fill in the details below to post a project for students to apply to.
              </p>
            </DialogHeader>

            {/* Title */}
            <div className="space-y-1.5">
              <Label htmlFor="proj-title">Project Title</Label>
              <Input
                id="proj-title"
                placeholder="e.g. Machine Learning Research Assistant"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="rounded-lg"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="proj-desc">Description</Label>
              <Textarea
                id="proj-desc"
                rows={4}
                placeholder="Describe the project goals, responsibilities, and what the student will gain..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="rounded-lg resize-none"
              />
            </div>

            {/* Poster Type */}
            <div className="space-y-1.5">
              <Label>Poster Type</Label>
              <div className="flex flex-wrap gap-2">
                {POSTER_TYPE_OPTIONS.map((pt) => (
                  <button
                    key={pt}
                    type="button"
                    onClick={() => setPosterType(pt)}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                      posterType === pt
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border hover:bg-muted/50"
                    }`}
                  >
                    {pt}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration & Difficulty */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Duration</Label>
                <div className="flex flex-wrap gap-2">
                  {DURATION_OPTIONS.map(({ label, months }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => {
                        setDuration(label);
                        setDurationMonths(months);
                      }}
                      className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
                        duration === label
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border hover:bg-muted/50"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Difficulty Level</Label>
                <div className="flex gap-2">
                  {DIFFICULTY_OPTIONS.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDifficulty(d)}
                      className={`flex-1 text-xs py-1.5 rounded-lg border transition-all ${
                        difficulty === d
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border hover:bg-muted/50"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Compensation & Spots */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Compensation</Label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsPaid(false)}
                    className={`flex-1 text-xs py-2 rounded-lg border transition-all ${
                      !isPaid
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border hover:bg-muted/50"
                    }`}
                  >
                    Unpaid / Credit
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPaid(true)}
                    className={`flex-1 text-xs py-2 rounded-lg border transition-all ${
                      isPaid
                        ? "bg-green-600 text-white border-green-600"
                        : "border-border hover:bg-muted/50"
                    }`}
                  >
                    Paid
                  </button>
                </div>
                {isPaid && (
                  <Input
                    placeholder="e.g. $1,200"
                    value={compensation}
                    onChange={(e) => setCompensation(e.target.value)}
                    className="rounded-lg"
                  />
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="spots">Open Spots</Label>
                <Input
                  id="spots"
                  type="number"
                  min="1"
                  max="20"
                  value={spots}
                  onChange={(e) => setSpots(e.target.value)}
                  className="rounded-lg"
                />
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-1.5">
              <Label>Required Skills</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a skill (e.g. Python, Figma)"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                  className="rounded-lg"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addSkill}
                  className="rounded-lg shrink-0 h-10 px-3"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="rounded-lg text-xs gap-1 pr-1.5"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => setSkills((p) => p.filter((s) => s !== skill))}
                        className="hover:text-destructive transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={handleClose} className="rounded-lg">
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-lg"
                disabled={!title.trim() || !description.trim() || skills.length === 0}
              >
                Post Project
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
