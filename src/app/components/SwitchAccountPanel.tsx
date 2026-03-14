import { useState } from "react";
import { useNavigate } from "react-router";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Search, GraduationCap, Building2, Users, ChevronDown, ChevronUp, Check } from "lucide-react";
import { students, faculty, clubs } from "../data/mockData";
import { useAuth } from "../context/AuthContext";
import type { CurrentUser } from "../context/AuthContext";

type Tab = "students" | "faculty" | "clubs";

const categoryColors: Record<string, string> = {
  Technology: "bg-blue-100 text-blue-700",
  Business: "bg-emerald-100 text-emerald-700",
  "Arts & Media": "bg-purple-100 text-purple-700",
  Science: "bg-orange-100 text-orange-700",
  "Social Impact": "bg-pink-100 text-pink-700",
  Sports: "bg-yellow-100 text-yellow-700",
};

export function SwitchAccountPanel({ onSwitch }: { onSwitch?: () => void }) {
  const navigate = useNavigate();
  const { currentUser, switchAccount } = useAuth();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("students");
  const [search, setSearch] = useState("");

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.major.toLowerCase().includes(search.toLowerCase())
  );
  const filteredFaculty = faculty.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.department.toLowerCase().includes(search.toLowerCase())
  );
  const filteredClubs = clubs.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (user: CurrentUser) => {
    switchAccount(user);
    setOpen(false);
    setSearch("");
    onSwitch?.();
    navigate("/dashboard");
  };

  return (
    <div className="border-t border-border">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-muted/40 transition-colors"
      >
        <span className="text-xs text-muted-foreground font-medium">Switch Account</span>
        {open ? (
          <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
        )}
      </button>

      {open && (
        <div className="border-t border-border bg-muted/20">
          {/* Search */}
          <div className="px-3 pt-2.5 pb-1.5">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                placeholder="Search accounts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-8 text-xs rounded-lg"
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border">
            {(
              [
                { key: "students" as Tab, icon: GraduationCap },
                { key: "faculty" as Tab, icon: Building2 },
                { key: "clubs" as Tab, icon: Users },
              ] as const
            ).map(({ key, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex-1 flex items-center justify-center gap-1 py-2 text-xs font-medium transition-colors border-b-2 capitalize ${
                  tab === key
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-3 h-3" />
                {key}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="max-h-52 overflow-y-auto divide-y divide-border">
            {tab === "students" &&
              filteredStudents.map((s) => {
                const isActive = currentUser?.id === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => handleSelect(s)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors ${
                      isActive ? "bg-primary/5" : "hover:bg-muted/40"
                    }`}
                  >
                    <Avatar className="w-7 h-7 flex-shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {s.avatarInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{s.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {s.major} · {s.year}
                      </p>
                    </div>
                    {isActive && <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
                  </button>
                );
              })}

            {tab === "faculty" &&
              filteredFaculty.map((f) => {
                const isActive = currentUser?.id === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => handleSelect(f)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors ${
                      isActive ? "bg-primary/5" : "hover:bg-muted/40"
                    }`}
                  >
                    <Avatar className="w-7 h-7 flex-shrink-0">
                      <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                        {f.avatarInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{f.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {f.title} · {f.department}
                      </p>
                    </div>
                    {isActive && <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
                  </button>
                );
              })}

            {tab === "clubs" &&
              filteredClubs.map((c) => {
                const isActive = currentUser?.id === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => handleSelect(c)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors ${
                      isActive ? "bg-primary/5" : "hover:bg-muted/40"
                    }`}
                  >
                    <Avatar className="w-7 h-7 flex-shrink-0">
                      <AvatarFallback className="bg-purple-100 text-purple-700 text-xs">
                        {c.avatarInitials.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{c.name}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Badge
                          className={`text-xs px-1.5 py-0 rounded-full ${categoryColors[c.category] ?? "bg-gray-100 text-gray-600"}`}
                        >
                          {c.category}
                        </Badge>
                      </div>
                    </div>
                    {isActive && <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
                  </button>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
