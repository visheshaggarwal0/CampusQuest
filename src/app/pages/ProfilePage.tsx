import { useState, useEffect } from "react";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Camera, Plus, X, CheckCircle2, Save } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import type { Student, Faculty, Club } from "../data/mockData";

const YEAR_OPTIONS = ["Freshman", "Sophomore", "Junior", "Senior", "Graduate"];
const CLUB_CATEGORIES = [
  "Technology",
  "Business",
  "Arts & Media",
  "Science",
  "Social Impact",
  "Sports",
] as const;

export function ProfilePage() {
  const { currentUser, updateProfile } = useAuth();
  const [saved, setSaved] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [researchInput, setResearchInput] = useState("");

  // ── Shared state ──
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // ── Student fields ──
  const [university, setUniversity] = useState("");
  const [major, setMajor] = useState("");
  const [year, setYear] = useState("Junior");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState<string[]>([]);

  // ── Faculty fields ──
  const [department, setDepartment] = useState("");
  const [title, setTitle] = useState("");
  const [researchAreas, setResearchAreas] = useState<string[]>([]);
  const [facultyBio, setFacultyBio] = useState("");
  const [facultyUniversity, setFacultyUniversity] = useState("");

  // ── Club fields ──
  const [clubUniversity, setClubUniversity] = useState("");
  const [clubCategory, setClubCategory] = useState<typeof CLUB_CATEGORIES[number]>("Technology");
  const [clubDescription, setClubDescription] = useState("");
  const [clubMembers, setClubMembers] = useState("");

  // Populate form from currentUser
  useEffect(() => {
    if (!currentUser) return;
    setName(currentUser.name ?? "");
    setEmail(currentUser.email ?? "");

    if (currentUser.type === "student") {
      const s = currentUser as Student;
      setUniversity(s.university ?? "");
      setMajor(s.major ?? "");
      setYear(s.year ?? "Junior");
      setBio(s.bio ?? "");
      setSkills(s.skills ?? []);
    } else if (currentUser.type === "faculty") {
      const f = currentUser as Faculty;
      setFacultyUniversity(f.university ?? "");
      setDepartment(f.department ?? "");
      setTitle(f.title ?? "");
      setFacultyBio(f.bio ?? "");
      setResearchAreas(f.researchAreas ?? []);
    } else if (currentUser.type === "club") {
      const c = currentUser as Club;
      setClubUniversity(c.university ?? "");
      setClubCategory((c.category as typeof CLUB_CATEGORIES[number]) ?? "Technology");
      setClubDescription(c.description ?? "");
      setClubMembers(String(c.members ?? ""));
    }
  }, [currentUser?.id]);

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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const newInitials = name.trim().split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

    const baseUpdates = {
      name: name.trim(),
      email: email.trim(),
      avatarInitials: newInitials,
    };

    if (currentUser.type === "student") {
      updateProfile({
        ...baseUpdates,
        university: university.trim(),
        major: major.trim(),
        year,
        bio: bio.trim(),
        skills,
      });
    } else if (currentUser.type === "faculty") {
      updateProfile({
        ...baseUpdates,
        university: facultyUniversity.trim(),
        department: department.trim(),
        title: title.trim(),
        bio: facultyBio.trim(),
        researchAreas,
      });
    } else if (currentUser.type === "club") {
      updateProfile({
        ...baseUpdates,
        university: clubUniversity.trim(),
        category: clubCategory,
        description: clubDescription.trim(),
        members: parseInt(clubMembers, 10) || 0,
      });
    }

    setSaved(true);
    toast.success("Profile updated successfully!", {
      description: "Your changes have been saved.",
    });
    setTimeout(() => setSaved(false), 3000);
  };

  if (!currentUser) return null;

  const avatarColor =
    currentUser.type === "student"
      ? "bg-primary text-primary-foreground"
      : currentUser.type === "faculty"
      ? "bg-blue-600 text-white"
      : "bg-purple-600 text-white";

  const subtitleLine =
    currentUser.type === "student"
      ? `${(currentUser as Student).major} Student`
      : currentUser.type === "faculty"
      ? `${(currentUser as Faculty).title}`
      : `${(currentUser as Club).category} Club`;

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">Profile Settings</h1>
            <p className="text-muted-foreground text-sm">Manage your account information and preferences</p>
          </div>
          {saved && (
            <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-lg text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>Saved!</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Profile Picture */}
          <Card className="p-5 sm:p-6 rounded-xl border border-border">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="relative flex-shrink-0">
                <Avatar className="w-20 h-20 sm:w-24 sm:h-24">
                  <AvatarFallback className={`text-xl sm:text-2xl ${avatarColor}`}>
                    {(name || currentUser.name || "?")
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <button
                  type="button"
                  className="absolute bottom-0 right-0 w-7 h-7 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
              <div>
                <h3 className="font-semibold text-base sm:text-lg">{name || currentUser.name}</h3>
                <p className="text-sm text-muted-foreground">{subtitleLine}</p>
                {currentUser.type === "student" && (
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <Badge variant="secondary" className="rounded-full text-xs">
                      {(currentUser as Student).credibilityScore} pts
                    </Badge>
                    <Badge variant="outline" className="rounded-full text-xs">
                      {(currentUser as Student).projectsCompleted} projects
                    </Badge>
                  </div>
                )}
                {currentUser.type === "faculty" && (
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    {(currentUser as Faculty).university.split(",")[0]}
                  </p>
                )}
                {currentUser.type === "club" && (
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <Badge variant="secondary" className="rounded-full text-xs">
                      {(currentUser as Club).members} members
                    </Badge>
                    <Badge variant="outline" className="rounded-full text-xs">
                      Founded {(currentUser as Club).foundedYear}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Basic Information */}
          <Card className="p-5 sm:p-6 rounded-xl border border-border space-y-4">
            <h3 className="text-lg sm:text-xl font-semibold">
              {currentUser.type === "club" ? "Club Information" : "Basic Information"}
            </h3>

            <div className="space-y-2">
              <Label htmlFor="name">
                {currentUser.type === "club" ? "Club / Startup Name" : "Full Name"}
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-lg"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-lg"
                required
              />
            </div>

            {/* Student-specific */}
            {currentUser.type === "student" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="university">University</Label>
                  <Input
                    id="university"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    className="rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="major">Major</Label>
                    <Input
                      id="major"
                      value={major}
                      onChange={(e) => setMajor(e.target.value)}
                      className="rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <select
                      id="year"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      {YEAR_OPTIONS.map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* Faculty-specific */}
            {currentUser.type === "faculty" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="facultyUniversity">University</Label>
                  <Input
                    id="facultyUniversity"
                    value={facultyUniversity}
                    onChange={(e) => setFacultyUniversity(e.target.value)}
                    className="rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="rounded-lg"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Club-specific */}
            {currentUser.type === "club" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="clubUniversity">University / Institution</Label>
                  <Input
                    id="clubUniversity"
                    value={clubUniversity}
                    onChange={(e) => setClubUniversity(e.target.value)}
                    className="rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <div className="flex flex-wrap gap-2">
                      {CLUB_CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setClubCategory(cat)}
                          className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                            clubCategory === cat
                              ? "bg-primary text-primary-foreground border-primary"
                              : "border-border hover:bg-muted/50"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clubMembers">Members</Label>
                    <Input
                      id="clubMembers"
                      type="number"
                      min="1"
                      value={clubMembers}
                      onChange={(e) => setClubMembers(e.target.value)}
                      className="rounded-lg"
                    />
                  </div>
                </div>
              </>
            )}
          </Card>

          {/* About / Bio */}
          <Card className="p-5 sm:p-6 rounded-xl border border-border space-y-4">
            <h3 className="text-lg sm:text-xl font-semibold">
              {currentUser.type === "club" ? "About the Club" : "About"}
            </h3>

            {currentUser.type === "student" && (
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself, your interests and what kind of projects you're looking for..."
                  className="rounded-lg resize-none"
                />
              </div>
            )}

            {currentUser.type === "faculty" && (
              <div className="space-y-2">
                <Label htmlFor="facultyBio">Bio</Label>
                <Textarea
                  id="facultyBio"
                  rows={4}
                  value={facultyBio}
                  onChange={(e) => setFacultyBio(e.target.value)}
                  placeholder="Describe your research focus and what students can expect working with you..."
                  className="rounded-lg resize-none"
                />
              </div>
            )}

            {currentUser.type === "club" && (
              <div className="space-y-2">
                <Label htmlFor="clubDescription">Description</Label>
                <Textarea
                  id="clubDescription"
                  rows={4}
                  value={clubDescription}
                  onChange={(e) => setClubDescription(e.target.value)}
                  placeholder="Describe your club's mission and the kinds of projects you run..."
                  className="rounded-lg resize-none"
                />
              </div>
            )}
          </Card>

          {/* Skills (Student) */}
          {currentUser.type === "student" && (
            <Card className="p-5 sm:p-6 rounded-xl border border-border space-y-4">
              <h3 className="text-lg sm:text-xl font-semibold">Skills</h3>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a skill (e.g. Python, Figma)"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") { e.preventDefault(); addSkill(); }
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
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="rounded-lg gap-1 pr-1.5">
                      {skill}
                      <button
                        type="button"
                        onClick={() => setSkills((p) => p.filter((s) => s !== skill))}
                        className="hover:text-destructive transition-colors ml-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              {skills.length === 0 && (
                <p className="text-sm text-muted-foreground">No skills added yet. Add your skills to match better projects.</p>
              )}
            </Card>
          )}

          {/* Research Areas (Faculty) */}
          {currentUser.type === "faculty" && (
            <Card className="p-5 sm:p-6 rounded-xl border border-border space-y-4">
              <h3 className="text-lg sm:text-xl font-semibold">Research Areas</h3>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a research area (e.g. Machine Learning)"
                  value={researchInput}
                  onChange={(e) => setResearchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") { e.preventDefault(); addResearch(); }
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
                <div className="flex flex-wrap gap-1.5">
                  {researchAreas.map((area) => (
                    <Badge key={area} variant="secondary" className="rounded-lg gap-1 pr-1.5">
                      {area}
                      <button
                        type="button"
                        onClick={() => setResearchAreas((p) => p.filter((a) => a !== area))}
                        className="hover:text-destructive transition-colors ml-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </Card>
          )}

          {/* Save / Cancel */}
          <div className="flex justify-end gap-3 pb-4">
            <Button
              type="button"
              variant="outline"
              className="rounded-lg"
              onClick={() => {
                // Reset to current saved values
                if (!currentUser) return;
                setName(currentUser.name ?? "");
                setEmail(currentUser.email ?? "");
              }}
            >
              Cancel
            </Button>
            <Button type="submit" className="rounded-lg gap-2">
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
