import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { ScrollToTop } from "./ScrollToTop";
import {
  Compass,
  LayoutDashboard,
  Briefcase,
  FolderOpen,
  Award,
  User,
  LogOut,
  Menu,
  X,
  Plus,
  Building2,
  Users,
  Shield,
} from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { cn } from "./ui/utils";
import { SwitchAccountPanel } from "./SwitchAccountPanel";
import { PostProjectModal } from "./PostProjectModal";
import { useAuth } from "../context/AuthContext";
import type { CurrentUser } from "../context/AuthContext";
import type { Student, Faculty, Club } from "../data/mockData";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/dashboard/projects", label: "Browse Projects", icon: Briefcase },
  { path: "/dashboard/my-projects", label: "My Projects", icon: FolderOpen },
  { path: "/dashboard/credibility", label: "Credibility", icon: Award },
  { path: "/dashboard/profile", label: "Profile", icon: User },
  { path: "/dashboard/admin", label: "Admin", icon: Shield },
];

function getUserDisplayInfo(user: CurrentUser) {
  if (user.type === "student") {
    const s = user as Student;
    return {
      name: s.name,
      subtitle: `${s.major} · ${s.year}`,
      stat: `${s.credibilityScore} pts`,
      statLabel: `${s.projectsCompleted} projects`,
      avatarColor: "bg-primary text-primary-foreground",
    };
  } else if (user.type === "faculty") {
    const f = user as Faculty;
    return {
      name: f.name,
      subtitle: `${f.title} · ${f.department}`,
      stat: `${f.projectsPosted} posted`,
      statLabel: f.university.split(",")[0],
      avatarColor: "bg-blue-600 text-white",
    };
  } else {
    const c = user as Club;
    return {
      name: c.name,
      subtitle: `${c.category} Club`,
      stat: `${(c as any).members || 0} members`,
      statLabel: `${c.projectsPosted} posted`,
      avatarColor: "bg-purple-600 text-white",
    };
  }
}

export function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [postModalOpen, setPostModalOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // If not logged in, show a minimal redirect message
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Compass className="w-7 h-7 text-primary" />
          </div>
          <h2 className="text-xl font-semibold">Please sign in to continue</h2>
          <p className="text-muted-foreground text-sm">You need an account to access the dashboard.</p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => navigate("/login")} className="rounded-lg">
              Log In
            </Button>
            <Button onClick={() => navigate("/signup")} className="rounded-lg">
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const displayInfo = getUserDisplayInfo(currentUser);
  const canPostProject = currentUser.type === "faculty" || currentUser.type === "club";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative">
      {/* Decorative background pattern */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230066cc' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />
      <div className="relative z-10">
        {/* ── Mobile Top Bar ──────────────────────────────────── */}
        <header className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-card border-b border-border flex items-center justify-between px-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <Compass className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">CampusQuest</span>
          </Link>
          <Avatar className="w-8 h-8">
            <AvatarFallback className={`text-xs ${displayInfo.avatarColor}`}>
              {currentUser.avatarInitials?.slice(0, 2) ?? "?"}
            </AvatarFallback>
          </Avatar>
        </header>

        {/* ── Mobile Backdrop ─────────────────────────────────── */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={closeSidebar}
          />
        )}

        {/* ── Sidebar ─────────────────────────────────────────── */}
        <aside
          className={cn(
            "fixed top-0 left-0 h-screen w-64 bg-card border-r border-border flex flex-col z-50 transition-transform duration-300 ease-in-out",
            "lg:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          )}
        >
          {/* Logo + Close button */}
          <div className="p-5 border-b border-border flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2" onClick={closeSidebar}>
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Compass className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold">CampusQuest</span>
            </Link>
            <button
              onClick={closeSidebar}
              className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
              aria-label="Close menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* User Profile Snippet */}
          <div className="px-4 py-4 border-b border-border">
            <div className="flex items-center gap-3">
              <Avatar className="w-9 h-9 flex-shrink-0">
                <AvatarFallback className={`text-sm ${displayInfo.avatarColor}`}>
                  {currentUser.avatarInitials?.slice(0, 2) ?? "?"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{displayInfo.name}</p>
                <p className="text-xs text-muted-foreground truncate">{displayInfo.subtitle}</p>
              </div>
              {/* Account type icon */}
              {currentUser.type === "faculty" && (
                <Building2 className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
              )}
              {currentUser.type === "club" && (
                <Users className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-2 mt-2.5">
              <Badge variant="secondary" className="text-xs rounded-full px-2">
                {displayInfo.stat}
              </Badge>
              <span className="text-xs text-muted-foreground truncate">{displayInfo.statLabel}</span>
            </div>
          </div>

          {/* Post Project CTA (faculty/club only) */}
          {canPostProject && (
            <div className="px-3 pt-3">
              <Button
                size="sm"
                className="w-full rounded-lg gap-2"
                onClick={() => { setPostModalOpen(true); closeSidebar(); }}
              >
                <Plus className="w-4 h-4" />
                Post a Project
              </Button>
            </div>
          )}

          {/* Nav Items */}
          <nav className="px-3 py-3 space-y-0.5 flex-1 overflow-y-auto">
            {navItems.map((item) => {
              // Hide credibility for faculty and club accounts
              if (item.path === "/dashboard/credibility" && currentUser.type !== "student") {
                return null;
              }

              const Icon = item.icon;
              const isActive =
                item.path === "/dashboard"
                  ? location.pathname === "/dashboard"
                  : location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeSidebar}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground/70 hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Switch Account Panel */}
          <SwitchAccountPanel onSwitch={closeSidebar} />

          {/* Logout */}
          <div className="px-3 pb-4 pt-3">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-foreground/60 hover:bg-destructive/10 hover:text-destructive transition-colors w-full"
            >
              <LogOut className="w-4 h-4" />
              <span className="font-medium text-sm">Log Out</span>
            </button>
          </div>
        </aside>

        {/* ── Main Content ────────────────────────────────────── */}
        <main className="lg:ml-64 pt-14 lg:pt-0">
          <ScrollToTop />
          <Outlet />
        </main>

        {/* Post Project Modal */}
        <PostProjectModal open={postModalOpen} onClose={() => setPostModalOpen(false)} />
      </div>
    </div>
  );
}