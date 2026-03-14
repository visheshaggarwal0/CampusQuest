import { useState, useMemo } from "react";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { ProjectCard } from "../components/ProjectCard";
import { Search, SlidersHorizontal, Users, GraduationCap, Building2, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../components/ui/sheet";
import { Button } from "../components/ui/button";
import { useAuth } from "../context/AuthContext";
// Removed static imports to use dynamic context data

const skillOptions = [
  "All", "Python", "React", "Machine Learning", "User Research", "Data Analysis",
  "Design", "Social Media", "UI/UX", "NLP", "GIS", "Video Editing",
  "Content Strategy", "Testing", "C++", "R Programming",
];
const durationOptions = ["All", "1-2 months", "3-4 months", "5-6 months"];
const difficultyOptions = ["All", "Beginner", "Intermediate", "Advanced"];
const paymentOptions = ["All", "Paid", "Unpaid"];
const posterTypeOptions = ["All", "Professor", "Research Lab", "Campus Club", "Startup"];

// Reusable filter panel content
function FiltersContent({
  selectedSkill, setSelectedSkill,
  selectedDuration, setSelectedDuration,
  selectedDifficulty, setSelectedDifficulty,
  selectedPayment, setSelectedPayment,
  selectedPosterType, setSelectedPosterType,
  activeFilterCount, clearFilters,
}: {
  selectedSkill: string; setSelectedSkill: (v: string) => void;
  selectedDuration: string; setSelectedDuration: (v: string) => void;
  selectedDifficulty: string; setSelectedDifficulty: (v: string) => void;
  selectedPayment: string; setSelectedPayment: (v: string) => void;
  selectedPosterType: string; setSelectedPosterType: (v: string) => void;
  activeFilterCount: number; clearFilters: () => void;
}) {
  return (
    <div className="space-y-4">
      {activeFilterCount > 0 && (
        <button onClick={clearFilters} className="text-xs text-primary hover:underline">
          Clear all filters ({activeFilterCount})
        </button>
      )}

      {/* Poster Type */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">
          Poster Type
        </label>
        <div className="flex flex-col gap-1">
          {posterTypeOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setSelectedPosterType(opt)}
              className={`text-left text-sm px-2.5 py-1.5 rounded-lg transition-colors ${selectedPosterType === opt
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted/50 text-foreground"
                }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Duration */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">
          Duration
        </label>
        <div className="flex flex-col gap-1">
          {durationOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setSelectedDuration(opt)}
              className={`text-left text-sm px-2.5 py-1.5 rounded-lg transition-colors ${selectedDuration === opt
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted/50 text-foreground"
                }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">
          Difficulty
        </label>
        <div className="flex flex-col gap-1">
          {difficultyOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setSelectedDifficulty(opt)}
              className={`text-left text-sm px-2.5 py-1.5 rounded-lg transition-colors ${selectedDifficulty === opt
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted/50 text-foreground"
                }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Payment */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">
          Payment
        </label>
        <div className="flex flex-col gap-1">
          {paymentOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setSelectedPayment(opt)}
              className={`text-left text-sm px-2.5 py-1.5 rounded-lg transition-colors ${selectedPayment === opt
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted/50 text-foreground"
                }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">
          Skills
        </label>
        <div className="flex flex-wrap gap-1.5">
          {skillOptions.map((skill) => (
            <Badge
              key={skill}
              variant={selectedSkill === skill ? "default" : "outline"}
              className="cursor-pointer rounded-lg text-xs"
              onClick={() => setSelectedSkill(skill)}
            >
              {skill}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProjectsFeed() {
  const { allProjects, allStudents, allFaculty, allClubs } = useAuth();
  const [search, setSearch] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("All");
  const [selectedDuration, setSelectedDuration] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedPayment, setSelectedPayment] = useState("All");
  const [selectedPosterType, setSelectedPosterType] = useState("All");

  const topStudents = useMemo(() =>
    [...allStudents].sort((a, b) => b.credibilityScore - a.credibilityScore).slice(0, 5),
    [allStudents]
  );

  const filteredProjects = useMemo(() => {
    return allProjects.filter((p) => {
      const matchesSearch =
        search === "" ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.poster.toLowerCase().includes(search.toLowerCase()) ||
        p.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()));

      const matchesSkill =
        selectedSkill === "All" ||
        p.skills.some((s) => s.toLowerCase().includes(selectedSkill.toLowerCase()));

      const matchesDuration =
        selectedDuration === "All" ||
        (selectedDuration === "1-2 months" && p.durationMonths <= 2) ||
        (selectedDuration === "3-4 months" && p.durationMonths >= 3 && p.durationMonths <= 4) ||
        (selectedDuration === "5-6 months" && p.durationMonths >= 5);

      const matchesDifficulty =
        selectedDifficulty === "All" || p.difficulty === selectedDifficulty;

      const matchesPayment =
        selectedPayment === "All" ||
        (selectedPayment === "Paid" && p.isPaid) ||
        (selectedPayment === "Unpaid" && !p.isPaid);

      const matchesPosterType =
        selectedPosterType === "All" || p.posterType === selectedPosterType;

      return matchesSearch && matchesSkill && matchesDuration && matchesDifficulty && matchesPayment && matchesPosterType;
    });
  }, [search, selectedSkill, selectedDuration, selectedDifficulty, selectedPayment, selectedPosterType, allProjects]);

  const activeFilterCount = [
    selectedSkill !== "All",
    selectedDuration !== "All",
    selectedDifficulty !== "All",
    selectedPayment !== "All",
    selectedPosterType !== "All",
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSelectedSkill("All");
    setSelectedDuration("All");
    setSelectedDifficulty("All");
    setSelectedPayment("All");
    setSelectedPosterType("All");
  };

  const filterProps = {
    selectedSkill, setSelectedSkill,
    selectedDuration, setSelectedDuration,
    selectedDifficulty, setSelectedDifficulty,
    selectedPayment, setSelectedPayment,
    selectedPosterType, setSelectedPosterType,
    activeFilterCount, clearFilters,
  };

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-5 sm:space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">Browse Projects</h1>
            <p className="text-sm text-muted-foreground">
              {filteredProjects.length} opportunities from {allFaculty.length} faculty &amp; {allClubs.length} clubs
            </p>
          </div>
          <div className="hidden sm:flex gap-2 text-sm text-muted-foreground flex-shrink-0">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{allFaculty.length} Faculty</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg">
              <Users className="w-3.5 h-3.5" />
              <span>{allClubs.length} Clubs</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg">
              <Building2 className="w-3.5 h-3.5" />
              <span>5 Startups</span>
            </div>
          </div>
        </div>

        {/* Search Bar + Mobile Filter Trigger */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
            <Input
              placeholder="Search projects, skills, or organizations..."
              className="pl-11 sm:pl-12 h-11 sm:h-12 rounded-xl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Mobile Filter Sheet Trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden h-11 px-4 rounded-xl gap-2 flex-shrink-0">
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge className="rounded-full px-1.5 py-0 text-xs ml-1">{activeFilterCount}</Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <FiltersContent {...filterProps} />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex gap-5 sm:gap-6">
          {/* Left: Desktop Filters + Leaderboard */}
          <div className="hidden lg:block w-64 flex-shrink-0 space-y-5">
            {/* Filters Card */}
            <Card className="rounded-xl border border-border overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
                  <span className="font-semibold text-sm">Filters</span>
                  {activeFilterCount > 0 && (
                    <Badge className="rounded-full px-1.5 py-0 text-xs">{activeFilterCount}</Badge>
                  )}
                </div>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-muted-foreground hover:text-destructive"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <div className="px-4 pb-4 pt-3">
                <FiltersContent {...filterProps} />
              </div>
            </Card>

            {/* Top Students Leaderboard */}
            <Card className="p-4 rounded-xl border border-border space-y-3">
              <h3 className="font-semibold text-sm">Top Students</h3>
              <div className="space-y-2.5">
                {topStudents.map((s, i) => (
                  <div key={s.id} className="flex items-center gap-2.5">
                    <span className={`text-xs font-bold w-4 text-center ${i === 0 ? "text-yellow-500" : i === 1 ? "text-slate-400" : i === 2 ? "text-amber-600" : "text-muted-foreground"}`}>
                      {i + 1}
                    </span>
                    <Avatar className="w-7 h-7 flex-shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {s.avatarInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{s.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{s.major}</p>
                    </div>
                    <span className="text-xs font-semibold text-primary">{s.credibilityScore}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Active Posters */}
            <Card className="p-4 rounded-xl border border-border space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">Active Posters</h3>
                <Badge variant="secondary" className="text-xs rounded-full">{allFaculty.length + allClubs.length}</Badge>
              </div>
              <div className="space-y-2">
                {allFaculty.slice(0, 4).map((f) => (
                  <div key={f.id} className="flex items-center gap-2">
                    <Avatar className="w-6 h-6 flex-shrink-0">
                      <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                        {f.avatarInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{f.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{f.department}</p>
                    </div>
                  </div>
                ))}
                {allClubs.slice(0, 3).map((c) => (
                  <div key={c.id} className="flex items-center gap-2">
                    <Avatar className="w-6 h-6 flex-shrink-0">
                      <AvatarFallback className="bg-purple-100 text-purple-700 text-xs">
                        {c.avatarInitials.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{c.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{c.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right: Project Results */}
          <div className="flex-1 space-y-4 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{filteredProjects.length}</span> projects found
                {activeFilterCount > 0 && (
                  <span className="ml-1">· {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""}</span>
                )}
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="hidden sm:inline">Sorted by:</span>
                <span className="text-foreground font-medium">Most Recent</span>
              </div>
            </div>

            {filteredProjects.length === 0 ? (
              <Card className="p-8 sm:p-12 rounded-xl border border-border text-center">
                <p className="text-muted-foreground">No projects match your filters.</p>
                <button onClick={clearFilters} className="mt-2 text-sm text-primary hover:underline">
                  Clear all filters
                </button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.id} {...project} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}