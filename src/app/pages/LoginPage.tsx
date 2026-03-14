import { useState } from "react";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Link, useNavigate } from "react-router";
import {
  Compass,
  ChevronDown,
  ChevronUp,
  Users,
  GraduationCap,
  Building2,
  Search,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import { students, faculty, clubs } from "../data/mockData";
import { useAuth } from "../context/AuthContext";
import type { CurrentUser } from "../context/AuthContext";

type QuickLoginTab = "students" | "faculty" | "clubs";

const categoryColors: Record<string, string> = {
  Technology: "bg-blue-100 text-blue-700",
  Business: "bg-emerald-100 text-emerald-700",
  "Arts & Media": "bg-purple-100 text-purple-700",
  Science: "bg-orange-100 text-orange-700",
  "Social Impact": "bg-pink-100 text-pink-700",
  Sports: "bg-yellow-100 text-yellow-700",
};

export function LoginPage() {
  const navigate = useNavigate();
  const { login, allStudents, allFaculty, allClubs } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showQuickLogin, setShowQuickLogin] = useState(false);
  const [quickTab, setQuickTab] = useState<QuickLoginTab>("students");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");

  // Find user by email across all mock data
  const findUserByEmail = (emailVal: string): CurrentUser | null => {
    const s = allStudents.find((u) => u.email.toLowerCase() === emailVal.toLowerCase());
    if (s) return s;
    const f = allFaculty.find((u) => u.email.toLowerCase() === emailVal.toLowerCase());
    if (f) return f;
    const c = allClubs.find((u) => u.email.toLowerCase() === emailVal.toLowerCase());
    if (c) return c;
    return null;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const user = findUserByEmail(email);
    if (user) {
      login(user);
      navigate("/dashboard");
    } else {
      setError("No account found with that email. Try the Quick Login below.");
    }
  };

  const handleQuickLogin = (user: CurrentUser) => {
    login(user);
    setShowQuickLogin(false);
    navigate("/dashboard");
  };

  const filteredStudents = allStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.major.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.university.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFaculty = allFaculty.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.university.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredClubs = allClubs.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.university.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4 py-8 sm:py-12 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl" />

      <div className="w-full max-w-md space-y-4 relative z-10">
        {/* Main Login Card */}
        <Card className="w-full p-8 rounded-xl border border-border bg-white/90 backdrop-blur-sm shadow-xl">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Link to="/" className="inline-flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Compass className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="text-2xl font-semibold">CampusQuest</span>
              </Link>
              <h2 className="text-2xl font-bold">Welcome back</h2>
              <p className="text-muted-foreground">Sign in to your account</p>
            </div>

            {error && (
              <div className="flex items-start gap-2.5 bg-destructive/10 text-destructive rounded-lg px-3 py-2.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@university.edu"
                  className="rounded-lg"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="rounded-lg pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
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

              <Button type="submit" className="w-full rounded-lg" size="lg">
                Log In
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </Card>

        {/* Quick Login Demo Panel */}
        <Card className="w-full rounded-xl border border-border overflow-hidden bg-white/90 backdrop-blur-sm shadow-xl">
          <button
            onClick={() => setShowQuickLogin((v) => !v)}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/40 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center">
                <Users className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="font-medium text-sm">Quick Login — Demo Accounts</span>
              <Badge variant="secondary" className="rounded-full text-xs px-2">
                {allStudents.length + allFaculty.length + allClubs.length} accounts
              </Badge>
            </div>
            {showQuickLogin ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </button>

          {showQuickLogin && (
            <div className="border-t border-border">
              {/* Search */}
              <div className="px-4 pt-3 pb-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, major, department..."
                    className="pl-8 h-8 text-sm rounded-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-border">
                {(
                  [
                    { key: "students", label: "Students", icon: GraduationCap, count: filteredStudents.length },
                    { key: "faculty", label: "Faculty", icon: Building2, count: filteredFaculty.length },
                    { key: "clubs", label: "Clubs", icon: Users, count: filteredClubs.length },
                  ] as const
                ).map(({ key, label, icon: Icon, count }) => (
                  <button
                    key={key}
                    onClick={() => setQuickTab(key)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors border-b-2 ${quickTab === key
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                    <span className="text-xs opacity-60">({count})</span>
                  </button>
                ))}
              </div>

              {/* Account List */}
              <div className="max-h-72 overflow-y-auto divide-y divide-border">
                {quickTab === "students" &&
                  (filteredStudents.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-6">No students found</p>
                  ) : (
                    filteredStudents.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => handleQuickLogin(s)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/40 transition-colors text-left"
                      >
                        <Avatar className="w-8 h-8 flex-shrink-0">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {s.avatarInitials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{s.name}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {s.major} • {s.year}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs font-semibold text-primary">{s.credibilityScore} pts</p>
                          <p className="text-xs text-muted-foreground">{s.projectsCompleted} projects</p>
                        </div>
                      </button>
                    ))
                  ))}

                {quickTab === "faculty" &&
                  (filteredFaculty.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-6">No faculty found</p>
                  ) : (
                    filteredFaculty.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => handleQuickLogin(f)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/40 transition-colors text-left"
                      >
                        <Avatar className="w-8 h-8 flex-shrink-0">
                          <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                            {f.avatarInitials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{f.name}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {f.title} • {f.department}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs text-muted-foreground truncate max-w-24">
                            {f.university.split(",")[0]}
                          </p>
                          <p className="text-xs text-primary font-medium">{f.projectsPosted} posted</p>
                        </div>
                      </button>
                    ))
                  ))}

                {quickTab === "clubs" &&
                  (filteredClubs.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-6">No clubs found</p>
                  ) : (
                    filteredClubs.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => handleQuickLogin(c)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/40 transition-colors text-left"
                      >
                        <Avatar className="w-8 h-8 flex-shrink-0">
                          <AvatarFallback className="bg-purple-100 text-purple-700 text-xs">
                            {c.avatarInitials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{c.name}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {c.university.split(",")[0]}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0 space-y-0.5">
                          <Badge
                            className={`text-xs px-1.5 py-0 rounded-full ${categoryColors[c.category] ?? "bg-gray-100 text-gray-600"
                              }`}
                          >
                            {c.category}
                          </Badge>
                          <p className="text-xs text-muted-foreground">{c.members} members</p>
                        </div>
                      </button>
                    ))
                  ))}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
