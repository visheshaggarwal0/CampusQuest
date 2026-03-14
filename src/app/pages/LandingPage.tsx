import { Navbar } from "../components/Navbar";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Link } from "react-router";
import { Search, Upload, CheckCircle, Award, Clock, Users } from "lucide-react";
import { ProjectCard } from "../components/ProjectCard";
import { projects } from "../data/mockData";

const mockProjects = projects.slice(0, 2);

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl" />
      
      <div className="relative z-10">
        <Navbar />
        
        {/* Hero Section */}
        <section className="max-w-[1440px] mx-auto px-4 sm:px-8 py-12 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
              Build Real Experience<br className="hidden sm:block" />in Months, Not Years.
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground">
              Discover micro-internships and short projects from professors, research labs, campus clubs, and startups. Gain hands-on experience, build your portfolio, and increase your credibility—in 1–6 month projects designed for students.
            </p>
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
              <Link to="/dashboard/projects">
                <Button size="lg" className="rounded-xl">Find Projects</Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="rounded-xl">Post a Project</Button>
              </Link>
            </div>
          </div>
          
          <div className="space-y-4">
            {mockProjects.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="bg-muted/30 py-12 sm:py-20">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            <Card className="p-6 sm:p-8 text-center space-y-4 rounded-xl border border-border">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold">Browse Projects</h3>
              <p className="text-muted-foreground text-sm sm:text-base">
                Explore micro-projects from professors, labs, clubs, and startups tailored to your skills and interests.
              </p>
            </Card>
            
            <Card className="p-6 sm:p-8 text-center space-y-4 rounded-xl border border-border">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Upload className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold">Apply & Deliver</h3>
              <p className="text-muted-foreground text-sm sm:text-base">
                Apply to projects that match your schedule. Complete deliverables within 1–6 months.
              </p>
            </Card>
            
            <Card className="p-6 sm:p-8 text-center space-y-4 rounded-xl border border-border">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold">Build Credibility</h3>
              <p className="text-muted-foreground text-sm sm:text-base">
                Earn credibility points, badges, and verified portfolio pieces for every completed project.
              </p>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Credibility Score Example */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-8 py-12 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold">
              Build Your Credibility Score
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground">
              Every project you complete increases your credibility score. Stand out to recruiters and project posters with a verified track record of real work.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Award className="w-6 h-6 text-primary flex-shrink-0" />
                <span>Earn badges for completing projects</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-primary flex-shrink-0" />
                <span>Track your experience hours</span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-primary flex-shrink-0" />
                <span>Get verified endorsements</span>
              </div>
            </div>
          </div>
          
          <Card className="p-6 sm:p-8 rounded-xl border border-border">
            <div className="text-center space-y-6">
              <div className="relative w-40 h-40 sm:w-48 sm:h-48 mx-auto">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 192 192">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-muted"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 88}`}
                    strokeDashoffset={`${2 * Math.PI * 88 * (1 - 0.75)}`}
                    className="text-primary"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl sm:text-5xl font-bold">750</span>
                  <span className="text-xs sm:text-sm text-muted-foreground">Credibility Score</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Projects Completed</span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Badges Earned</span>
                  <span className="font-semibold">5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Experience Hours</span>
                  <span className="font-semibold">156</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>
      </div>
    </div>
  );
}