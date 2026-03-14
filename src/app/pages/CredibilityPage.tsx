import { useState } from "react";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Award, Star, Trophy, Target, CheckCircle, TrendingUp, Medal, Info, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useParams } from "react-router";
import type { Student, Project } from "../data/mockData";

// Removed fake completed projects - will be fetched from database

const badges = [
  {
    name: "Quick Learner",
    description: "Completed first project",
    icon: Target,
    color: "bg-blue-100 text-blue-600",
    earned: true,
  },
  {
    name: "5-Star Performer",
    description: "Received 5 perfect ratings",
    icon: Star,
    color: "bg-yellow-100 text-yellow-600",
    earned: true,
  },
  {
    name: "Research Pro",
    description: "Completed 5 research projects",
    icon: Award,
    color: "bg-purple-100 text-purple-600",
    earned: true,
  },
  {
    name: "Team Player",
    description: "Worked with 10+ organizations",
    icon: Trophy,
    color: "bg-green-100 text-green-600",
    earned: true,
  },
  {
    name: "Speed Runner",
    description: "Complete 3 projects in one semester",
    icon: TrendingUp,
    color: "bg-orange-100 text-orange-400",
    earned: false,
  },
  {
    name: "Top 10%",
    description: "Reach top 10% credibility rank",
    icon: Medal,
    color: "bg-pink-100 text-pink-400",
    earned: false,
  },
];

const rankMedal = (i: number) => {
  if (i === 0) return "🥇";
  if (i === 1) return "🥈";
  if (i === 2) return "🥉";
  return `#${i + 1}`;
};

export function CredibilityPage() {
  const { currentUser, allStudents } = useAuth();
  const { studentId } = useParams<{ studentId?: string }>();
  const [showInfo, setShowInfo] = useState(false);

  // Leaderboard: top 10 students by credibility
  const leaderboard = [...allStudents]
    .sort((a, b) => b.credibilityScore - a.credibilityScore)
    .slice(0, 10);

  // Determine which student to display:
  const currentStudent = studentId
    ? allStudents.find((s) => s.id === studentId) || allStudents[0]
    : (currentUser?.type === "student" ? currentUser : allStudents[0]) as Student;

  if (!currentStudent) return null;

  const currentRank = leaderboard.findIndex((s) => s.id === currentStudent.id);
  const isViewingOwnProfile = currentUser?.id === currentStudent.id;

  return (
    <div className="min-h-screen">
      {/* Hero Header with Background */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 relative z-10">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-white/30">
                <AvatarFallback className="bg-white/20 text-white text-xl sm:text-2xl font-bold">
                  {currentStudent.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="text-white">
                <h1 className="text-2xl sm:text-4xl font-bold mb-1">
                  {isViewingOwnProfile ? "Your Credibility" : currentStudent.name}
                </h1>
                <p className="text-white/90 text-sm sm:text-base">
                  {isViewingOwnProfile
                    ? "Track your achievements and build your reputation"
                    : `${currentStudent.major} • ${currentStudent.year}`}
                </p>
              </div>
            </div>
            <Button
              onClick={() => setShowInfo(true)}
              variant="secondary"
              size="sm"
              className="rounded-lg gap-2 bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              <Info className="w-4 h-4" />
              <span className="hidden sm:inline">How it works</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-8 -mt-8">
        <div className="space-y-6 sm:space-y-8">

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Left Column — Score + Stats */}
            <div className="lg:col-span-1 space-y-5">
              <Card className="p-6 sm:p-8 rounded-xl border border-border bg-white/80 backdrop-blur-sm shadow-lg">
                <div className="text-center space-y-6">
                  {/* Circular Progress */}
                  <div className="relative w-44 h-44 sm:w-56 sm:h-56 mx-auto flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 224 224">
                      <circle
                        cx="112"
                        cy="112"
                        r="100"
                        stroke="currentColor"
                        strokeWidth="16"
                        fill="none"
                        className="text-muted"
                      />
                      <circle
                        cx="112"
                        cy="112"
                        r="100"
                        stroke="currentColor"
                        strokeWidth="16"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 100}`}
                        strokeDashoffset={`${2 * Math.PI * 100 * (1 - currentStudent.credibilityScore / 1000)}`}
                        className="text-primary"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl sm:text-5xl font-bold">{currentStudent.credibilityScore}</span>
                      <span className="text-xs sm:text-sm text-muted-foreground">/ 1000</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="space-y-3 pt-4 border-t border-border">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm">Ranking</span>
                      <span className="font-semibold">
                        {currentRank >= 0 ? `Top ${Math.round(((currentRank + 1) / allStudents.length) * 100)}%` : "Top 15%"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm">Projects</span>
                      <span className="font-semibold">{currentStudent.projectsCompleted}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm">Avg Rating</span>
                      <span className="font-semibold">{currentStudent.avgRating} ★</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm">Hours</span>
                      <span className="font-semibold">{currentStudent.hoursLogged}h</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Skills from projects */}
              <Card className="p-5 rounded-xl border border-border space-y-3">
                <h3 className="font-semibold text-sm">Verified Skills</h3>
                <div className="flex flex-wrap gap-1.5">
                  {currentStudent.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="rounded-lg text-xs flex items-center gap-1">
                      <CheckCircle className="w-2.5 h-2.5 text-green-500" />
                      {skill}
                    </Badge>
                  ))}
                </div>
              </Card>
            </div>

            {/* Right Column — Badges + Projects + Leaderboard */}
            <div className="lg:col-span-2 space-y-6">
              {/* Badges */}
              <Card className="p-5 sm:p-6 rounded-xl border border-border">
                <h2 className="text-lg sm:text-xl font-semibold mb-4">Badges</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {badges.map((badge) => {
                    const Icon = badge.icon;
                    return (
                      <div
                        key={badge.name}
                        className={`flex items-start gap-3 p-3.5 rounded-lg transition-opacity ${badge.earned ? "bg-muted/50" : "bg-muted/20 opacity-50"
                          }`}
                      >
                        <div
                          className={`w-9 h-9 ${badge.color} rounded-lg flex items-center justify-center flex-shrink-0`}
                        >
                          <Icon className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold leading-tight">{badge.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{badge.description}</p>
                          {!badge.earned && (
                            <Badge variant="outline" className="text-xs px-1.5 mt-1 rounded-full">
                              Locked
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Community Leaderboard */}
              <Card className="p-5 sm:p-6 rounded-xl border border-border">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg sm:text-xl font-semibold">Community Leaderboard</h2>
                  <Badge variant="secondary" className="rounded-full">
                    {allStudents.length} students
                  </Badge>
                </div>
                <div className="space-y-2">
                  {leaderboard.map((student, i) => {
                    const isCurrentUser = student.id === currentStudent.id;
                    return (
                      <div
                        key={student.id}
                        className={`flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg transition-colors ${isCurrentUser
                          ? "bg-primary/5 border border-primary/20"
                          : "hover:bg-muted/30"
                          }`}
                      >
                        <span className="w-7 sm:w-8 text-center text-sm font-bold flex-shrink-0">{rankMedal(i)}</span>
                        <Avatar className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0">
                          <AvatarFallback
                            className={`text-xs ${isCurrentUser
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                              }`}
                          >
                            {student.avatarInitials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {student.name}
                            {isCurrentUser && (
                              <span className="ml-2 text-xs text-primary font-normal">(You)</span>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {student.major}
                            <span className="hidden sm:inline"> • {student.university.split(",")[0]}</span>
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-bold text-primary">{student.credibilityScore}</p>
                          <p className="text-xs text-muted-foreground">{student.projectsCompleted} projects</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Info Modal */}
      {showInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowInfo(false)}>
          <Card className="max-w-2xl w-full p-6 sm:p-8 rounded-xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Info className="w-6 h-6 text-primary" />
                  How Credibility Works
                </h2>
                <p className="text-muted-foreground text-sm mt-1">Understanding the points system</p>
              </div>
              <button
                onClick={() => setShowInfo(false)}
                className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Earning Points</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm">Complete Projects</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Earn 50-150 points based on project duration and complexity
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                    <Star className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm">Receive High Ratings</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        5-star ratings give +20% bonus points, 4-star gives +10%
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <Trophy className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm">Unlock Badges</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Each badge earned adds 25-50 bonus points
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm">Maintain Consistency</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Active students with multiple projects get visibility boost
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <h3 className="font-semibold text-lg mb-3">Why It Matters</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Higher credibility scores increase your visibility to faculty and clubs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Demonstrates your reliability and commitment to potential collaborators</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Top performers get featured in the community leaderboard</span>
                  </li>
                </ul>
              </div>

              <Button onClick={() => setShowInfo(false)} className="w-full rounded-lg">
                Got it!
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}