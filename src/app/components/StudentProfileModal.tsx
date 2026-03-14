import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { Star, TrendingUp, Briefcase, Clock, Award, Mail, Calendar } from "lucide-react";
import { Link } from "react-router";
import type { Student } from "../data/mockData";

interface StudentProfileModalProps {
  open: boolean;
  onClose: () => void;
  student: Student;
}

export function StudentProfileModal({ open, onClose, student }: StudentProfileModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Student Profile</DialogTitle>
        </DialogHeader>

        {/* Header Section */}
        <div className="flex items-start gap-4 pb-4 border-b border-border">
          <Avatar className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0">
            <AvatarFallback className="bg-transparent text-white font-bold text-2xl">
              {student.avatarInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold mb-1">{student.name}</h2>
            <p className="text-muted-foreground mb-3">
              {student.major} · {student.year}
            </p>
            <div className="flex items-center gap-4 flex-wrap text-sm">
              <div className="flex items-center gap-1.5 text-primary">
                <TrendingUp className="w-4 h-4" />
                <span className="font-semibold">{student.credibilityScore} pts</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Briefcase className="w-4 h-4" />
                <span>{student.projectsCompleted} completed</span>
              </div>
              {student.avgRating > 0 && (
                <div className="flex items-center gap-1.5 text-amber-600">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-semibold">{student.avgRating.toFixed(1)}</span>
                </div>
              )}
              {student.hoursLogged > 0 && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>{student.hoursLogged}h</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bio */}
        {student.bio && (
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">About</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{student.bio}</p>
          </div>
        )}

        {/* Skills */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {student.skills.map((skill, i) => (
              <Badge key={i} variant="secondary" className="rounded-lg">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Interests */}
        {student.interests && student.interests.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {student.interests.map((interest, i) => (
                <Badge key={i} variant="outline" className="rounded-lg">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Contact Info */}
        <div className="space-y-3 pt-2 border-t border-border">
          <h3 className="font-semibold text-sm">Contact Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="w-4 h-4" />
              <span>{student.email}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Joined {student.joinedDate || "recently"}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4 border-t border-border">
          <Link to={`/dashboard/credibility/${student.id}`} className="flex-1">
            <Button variant="outline" className="rounded-lg w-full" onClick={onClose}>
              <Award className="w-4 h-4 mr-2" />
              View Full Credibility
            </Button>
          </Link>
          <Button variant="outline" onClick={onClose} className="rounded-lg">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
