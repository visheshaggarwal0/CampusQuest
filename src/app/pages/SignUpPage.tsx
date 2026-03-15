import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import {
  Compass,
  GraduationCap,
  Building2,
  Users,
  ChevronRight,
  ArrowLeft,
  X,
  Plus,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import type { Student, Faculty, Club } from "../data/mockData";

type AccountType = "student" | "faculty" | "club";

const YEAR_OPTIONS = ["Freshman", "Sophomore", "Junior", "Senior", "Graduate"];
const CLUB_CATEGORIES = [
  "Technology",
  "Business",
  "Arts & Media",
  "Science",
  "Social Impact",
  "Sports",
] as const;

export function SignUpPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [step, setStep] = useState<1 | 2>(1);
  const [accountType, setAccountType] = useState<AccountType | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [researchInput, setResearchInput] = useState("");

  // Shared fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Student fields
  const [university, setUniversity] = useState("");
  const [major, setMajor] = useState("");
  const [year, setYear] = useState("Junior");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState<string[]>([]);

  // Faculty fields
  const [department, setDepartment] = useState("");
  const [title, setTitle] = useState("");
  const [researchAreas, setResearchAreas] = useState<string[]>([]);
  const [facultyBio, setFacultyBio] = useState("");

  // Club fields
  const [clubUniversity, setClubUniversity] = useState("");
  const [clubCategory, setClubCategory] = useState<typeof CLUB_CATEGORIES[number]>("Technology");
  const [clubDescription, setClubDescription] = useState("");

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) setSkills((p) => [...p, s]);
    setSkillInput("");
  };

  const addResearch = () => {
    const r = researchInput.trim();
    if (r && !researchAreas.includes(r)) setResearchAreas((p) => [...p, r]);
    setResearchInput("");
  };

  const handleContinue = () => {
    if (accountType) setStep(2);
  };

  const [isSigningUp, setIsSigningUp] = useState(false);
  const [error, setError] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSigningUp(true);

    try {
      let profile: Partial<Student | Faculty | Club> = {};

      if (accountType === "student") {
        profile = {
          type: "student",
          name: name.trim(),
          avatarInitials: name.trim().split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase(),
          university: university.trim(),
          major: major.trim(),
          year,
          bio: bio.trim(),
          skills,
          credibilityScore: 100,
        };
      } else if (accountType === "faculty") {
        profile = {
          type: "faculty",
          name: name.trim(),
          avatarInitials: name.trim().split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase(),
          university: university.trim(),
          department: department.trim(),
          title: title.trim(),
          researchAreas,
          bio: facultyBio.trim(),
        };
      } else if (accountType === "club") {
        profile = {
          type: "club",
          name: name.trim(),
          avatarInitials: name.trim().split(" ").map(n => n[0]).join("").slice(0, 3).toUpperCase(),
          university: clubUniversity.trim(),
          category: clubCategory,
          description: clubDescription.trim(),
        };
      }

      await signUp(email.trim(), password, profile);
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Signup failed", err);
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setIsSigningUp(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4 py-10 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl" />

      <div className="w-full max-w-lg space-y-4 relative z-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Compass className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-semibold">CampusQuest</span>
          </Link>
          {error && (
            <div className="flex items-center gap-2 bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-lg border border-destructive/20 mx-auto max-w-sm">
              <p>{error}</p>
            </div>
          )}
        </div>

        <Card className="w-full p-8 rounded-xl border border-border bg-white/90 backdrop-blur-sm shadow-xl">
          {/* Progress indicator */}
          <div className="flex items-center gap-2 mb-6">
            <div
              className={`h-1.5 flex-1 rounded-full transition-colors ${step >= 1 ? "bg-primary" : "bg-border"}`}
            />
            <div
              className={`h-1.5 flex-1 rounded-full transition-colors ${step >= 2 ? "bg-primary" : "bg-border"}`}
            />
          </div>

          {/* ── STEP 1: Choose account type ─────────────────── */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-1">Create your account</h2>
                <p className="text-muted-foreground text-sm">
                  Choose the account type that best describes you
                </p>
              </div>

              <div className="space-y-3">
                {(
                  [
                    {
                      type: "student" as AccountType,
                      icon: GraduationCap,
                      label: "Student",
                      desc: "Browse and apply for micro-internships & projects",
                      color: "bg-blue-50 border-blue-200 text-blue-700",
                      activeColor: "border-primary bg-primary/5",
                    },
                    {
                      type: "faculty" as AccountType,
                      icon: Building2,
                      label: "Faculty / Research Lab",
                      desc: "Post research projects and hire talented students",
                      color: "bg-indigo-50 border-indigo-200 text-indigo-700",
                      activeColor: "border-primary bg-primary/5",
                    },
                    {
                      type: "club" as AccountType,
                      icon: Users,
                      label: "Campus Club / Startup",
                      desc: "Connect with students for club projects and initiatives",
                      color: "bg-purple-50 border-purple-200 text-purple-700",
                      activeColor: "border-primary bg-primary/5",
                    },
                  ] as const
                ).map(({ type, icon: Icon, label, desc, color, activeColor }) => (
                  <button
                    key={type}
                    onClick={() => setAccountType(type)}
                    className={`w-full flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left ${accountType === type
                      ? activeColor + " border-primary"
                      : "border-border hover:border-muted-foreground/30 hover:bg-muted/20"
                      }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">{label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                    </div>
                    {accountType === type && (
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <Button
                className="w-full rounded-lg"
                size="lg"
                disabled={!accountType}
                onClick={handleContinue}
              >
                Continue
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Log in
                </Link>
              </p>
            </div>
          )}

          {/* ── STEP 2: Fill in details ─────────────────────── */}
          {step === 2 && (
            <form onSubmit={handleSignUp} className="space-y-5">
              <div className="flex items-center gap-3 mb-1">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <h2 className="text-xl font-bold">
                    {accountType === "student"
                      ? "Student Profile"
                      : accountType === "faculty"
                        ? "Faculty Profile"
                        : "Club / Startup Profile"}
                  </h2>
                  <p className="text-xs text-muted-foreground">Fill in your details</p>
                </div>
              </div>

              {/* ── Common Fields ── */}
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">
                    {accountType === "club" ? "Club / Startup Name" : "Full Name"}
                  </Label>
                  <Input
                    id="name"
                    placeholder={
                      accountType === "club" ? "e.g. Tech Builders Club" : "e.g. Alex Johnson"
                    }
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="rounded-lg"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="rounded-lg"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="rounded-lg pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* ── Student-specific fields ── */}
              {accountType === "student" && (
                <>
                  <div className="space-y-1.5">
                    <Label htmlFor="university">University</Label>
                    <Input
                      id="university"
                      placeholder="e.g. University of California, Berkeley"
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                      required
                      className="rounded-lg"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="major">Major</Label>
                      <Input
                        id="major"
                        placeholder="e.g. Computer Science"
                        value={major}
                        onChange={(e) => setMajor(e.target.value)}
                        required
                        className="rounded-lg"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="year">Year</Label>
                      <select
                        id="year"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="w-full h-10 rounded-lg border border-input bg-input-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        {YEAR_OPTIONS.map((y) => (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      rows={3}
                      placeholder="Tell us about yourself, your interests and what kind of projects you're looking for..."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="rounded-lg resize-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label>Skills</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a skill (e.g. Python)"
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
                </>
              )}

              {/* ── Faculty-specific fields ── */}
              {accountType === "faculty" && (
                <>
                  <div className="space-y-1.5">
                    <Label htmlFor="faculty-university">University</Label>
                    <Input
                      id="faculty-university"
                      placeholder="e.g. MIT"
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                      required
                      className="rounded-lg"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        placeholder="e.g. Computer Science"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        required
                        className="rounded-lg"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        placeholder="e.g. Associate Professor"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="facultyBio">Bio</Label>
                    <Textarea
                      id="facultyBio"
                      rows={3}
                      placeholder="Describe your research focus and what students can expect working with you..."
                      value={facultyBio}
                      onChange={(e) => setFacultyBio(e.target.value)}
                      className="rounded-lg resize-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label>Research Areas</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a research area (e.g. Machine Learning)"
                        value={researchInput}
                        onChange={(e) => setResearchInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addResearch();
                          }
                        }}
                        className="rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addResearch}
                        className="rounded-lg shrink-0 h-10 px-3"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {researchAreas.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {researchAreas.map((area) => (
                          <Badge
                            key={area}
                            variant="secondary"
                            className="rounded-lg text-xs gap-1 pr-1.5"
                          >
                            {area}
                            <button
                              type="button"
                              onClick={() =>
                                setResearchAreas((p) => p.filter((a) => a !== area))
                              }
                              className="hover:text-destructive transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* ── Club-specific fields ── */}
              {accountType === "club" && (
                <>
                  <div className="space-y-1.5">
                    <Label htmlFor="club-university">University / Institution</Label>
                    <Input
                      id="club-university"
                      placeholder="e.g. Stanford University"
                      value={clubUniversity}
                      onChange={(e) => setClubUniversity(e.target.value)}
                      required
                      className="rounded-lg"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label>Category</Label>
                    <div className="flex flex-wrap gap-2">
                      {CLUB_CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setClubCategory(cat)}
                          className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${clubCategory === cat
                            ? "bg-primary text-primary-foreground border-primary"
                            : "border-border hover:bg-muted/50"
                            }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="clubDescription">Description</Label>
                    <Textarea
                      id="clubDescription"
                      rows={3}
                      placeholder="Describe your club's mission and the kinds of projects you run..."
                      value={clubDescription}
                      onChange={(e) => setClubDescription(e.target.value)}
                      className="rounded-lg resize-none"
                    />
                  </div>
                </>
              )}

              <Button type="submit" className="w-full rounded-lg" size="lg" disabled={isSigningUp}>
                {isSigningUp ? "Creating account..." : "Create Account & Continue"}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                By creating an account, you agree to our{" "}
                <span className="text-primary cursor-pointer hover:underline">Terms of Service</span>{" "}
                and{" "}
                <span className="text-primary cursor-pointer hover:underline">Privacy Policy</span>
              </p>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
