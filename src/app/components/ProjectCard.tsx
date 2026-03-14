import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Clock, DollarSign, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router";

interface ProjectCardProps {
  id?: string;
  title: string;
  poster: string;
  posterType: string;
  duration: string;
  difficulty: string;
  isPaid: boolean;
  compensation?: string;
  skills: string[];
  description: string;
  applicants?: number;
  spots?: number;
  postedDaysAgo?: number;
}

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

export function ProjectCard({
  id = "1",
  title,
  poster,
  posterType,
  duration,
  difficulty,
  isPaid,
  compensation,
  skills,
  description,
  applicants,
  spots,
  postedDaysAgo,
}: ProjectCardProps) {
  return (
    <Link to={`/dashboard/projects/${id}`}>
      <Card className="p-5 hover:shadow-xl transition-all duration-300 cursor-pointer border border-border rounded-xl hover:border-primary/40 group hover:-translate-y-1 bg-white/80 backdrop-blur-sm">
        <div className="space-y-3">
          {/* Header Row */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base mb-1 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                {title}
              </h3>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-sm text-muted-foreground">{poster}</span>
                <span className="text-muted-foreground">•</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    posterTypeColor[posterType] ?? "bg-gray-100 text-gray-600"
                  }`}
                >
                  {posterType}
                </span>
              </div>
            </div>
            {isPaid ? (
              <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2.5 py-1 rounded-lg flex-shrink-0">
                <DollarSign className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">{compensation ?? "Paid"}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-lg flex-shrink-0">
                <span className="text-xs font-medium">Unpaid</span>
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-foreground/75 line-clamp-2 leading-relaxed">
            {description}
          </p>

          {/* Duration + Difficulty Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="flex items-center gap-1 rounded-lg text-xs">
              <Clock className="w-3 h-3" />
              {duration}
            </Badge>
            <span
              className={`text-xs px-2 py-0.5 rounded-lg font-medium flex items-center gap-1 ${
                difficultyColor[difficulty] ?? "bg-gray-100 text-gray-600"
              }`}
            >
              <TrendingUp className="w-3 h-3" />
              {difficulty}
            </span>
            {applicants !== undefined && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Users className="w-3 h-3" />
                {applicants} applicants
              </span>
            )}
            {postedDaysAgo !== undefined && (
              <span className="text-xs text-muted-foreground ml-auto">
                {postedDaysAgo === 0 ? "Today" : postedDaysAgo === 1 ? "1d ago" : `${postedDaysAgo}d ago`}
              </span>
            )}
          </div>

          {/* Skills — show first 4 + overflow count */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {skills.slice(0, 4).map((skill, i) => (
              <Badge key={i} variant="outline" className="rounded-lg text-xs">
                {skill}
              </Badge>
            ))}
            {skills.length > 4 && (
              <span className="text-xs text-muted-foreground">+{skills.length - 4} more</span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
