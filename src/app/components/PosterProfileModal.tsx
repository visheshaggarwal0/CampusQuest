import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { Briefcase, Building2, Mail, Calendar, Users } from "lucide-react";
import type { Faculty, Club } from "../data/mockData";

interface PosterProfileModalProps {
  open: boolean;
  onClose: () => void;
  poster: Faculty | Club;
}

export function PosterProfileModal({ open, onClose, poster }: PosterProfileModalProps) {
  const isFaculty = poster.type === "faculty";
  const isClub = poster.type === "club";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">
            {isFaculty ? "Faculty" : "Club"} Profile
          </DialogTitle>
        </DialogHeader>

        {/* Header Section */}
        <div className="flex items-start gap-4 pb-4 border-b border-border">
          <Avatar className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-blue-600 flex-shrink-0">
            <AvatarFallback className="bg-transparent text-white font-bold text-2xl">
              {poster.avatarInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold mb-1">{poster.name}</h2>
            {isFaculty && (
              <p className="text-muted-foreground mb-2">
                {(poster as Faculty).title} · {(poster as Faculty).department}
              </p>
            )}
            {isClub && (
              <div className="flex items-center gap-2 mb-2">
                <Badge className="rounded-lg">
                  {(poster as Club).category}
                </Badge>
              </div>
            )}
            <div className="flex items-center gap-4 flex-wrap text-sm">
              <div className="flex items-center gap-1.5">
                <Briefcase className="w-4 h-4" />
                <span>{poster.projectsPosted} projects posted</span>
              </div>
            </div>
          </div>
        </div>

        {/* Description/Bio */}
        <div className="space-y-2">
          <h3 className="font-semibold text-sm">
            {isFaculty ? "About" : `About ${poster.name}`}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {poster.description}
          </p>
        </div>

        {/* Faculty-specific: Research Areas */}
        {isFaculty && (poster as Faculty).researchAreas && (
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Research Areas</h3>
            <div className="flex flex-wrap gap-2">
              {(poster as Faculty).researchAreas.map((area, i) => (
                <Badge key={i} variant="secondary" className="rounded-lg">
                  {area}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Club-specific: Focus Areas */}
        {isClub && (poster as Club).focusAreas && (
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Focus Areas</h3>
            <div className="flex flex-wrap gap-2">
              {(poster as Club).focusAreas.map((area, i) => (
                <Badge key={i} variant="secondary" className="rounded-lg">
                  {area}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Club-specific: Founded Year */}
        {isClub && (poster as Club).foundedYear && (
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Founded</h3>
            <p className="text-sm text-muted-foreground">
              {(poster as Club).foundedYear}
            </p>
          </div>
        )}

        {/* Contact Info */}
        <div className="space-y-3 pt-2 border-t border-border">
          <h3 className="font-semibold text-sm">Contact Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="w-4 h-4" />
              <span>{poster.email}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end pt-4 border-t border-border">
          <Button variant="outline" onClick={onClose} className="rounded-lg">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
