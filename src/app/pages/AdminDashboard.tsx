import { useState, useEffect } from "react";
import {
    Users,
    Briefcase,
    Search,
    MoreVertical,
    Trash2,
    Edit,
    Plus,
    Shield,
    Building2,
    User as UserIcon,
    CheckCircle2,
    AlertCircle
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "../components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "../components/ui/dropdown-menu";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../utils/supabaseClient";
import { toast } from "sonner";

export function AdminDashboard() {
    const { allStudents, allFaculty, allClubs, allProjects, refreshData } = useAuth();
    const [searchTerm, setSearchTerm] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    // Combine all users into a single searchable list
    const allUsers = [
        ...allStudents.map(u => ({ ...u, accountType: 'student' })),
        ...allFaculty.map(u => ({ ...u, accountType: 'faculty' })),
        ...allClubs.map(u => ({ ...u, accountType: 'club' }))
    ];

    const filteredUsers = allUsers.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredProjects = allProjects.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.poster.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDeleteUser = async (id: string, type: string) => {
        if (!confirm("Are you sure you want to delete this account? This action cannot be undone.")) return;

        setIsDeleting(true);
        const table = type === 'student' ? 'students' : type === 'faculty' ? 'faculty' : 'clubs';

        try {
            const { error } = await supabase.from(table).delete().eq('id', id);
            if (error) throw error;

            toast.success("Account deleted successfully");
            await refreshData();
        } catch (error: any) {
            toast.error(`Error deleting account: ${error.message}`);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDeleteProject = async (id: string) => {
        if (!confirm("Are you sure you want to delete this project?")) return;

        setIsDeleting(true);
        try {
            const { error } = await supabase.from('projects').delete().eq('id', id);
            if (error) throw error;

            toast.success("Project deleted successfully");
            await refreshData();
        } catch (error: any) {
            toast.error(`Error deleting project: ${error.message}`);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Monitor users, projects, and platform activity.</p>
                </div>
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search everything..."
                        className="pl-9 rounded-xl"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="rounded-2xl border-none shadow-sm bg-blue-50/50">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-blue-600 font-medium">Total Students</CardDescription>
                        <CardTitle className="text-3xl">{allStudents.length}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="rounded-2xl border-none shadow-sm bg-purple-50/50">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-purple-600 font-medium">Total Projects</CardDescription>
                        <CardTitle className="text-3xl">{allProjects.length}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="rounded-2xl border-none shadow-sm bg-green-50/50">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-green-600 font-medium">Faculty/Clubs</CardDescription>
                        <CardTitle className="text-3xl">{allFaculty.length + allClubs.length}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="rounded-2xl border-none shadow-sm bg-orange-50/50">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-orange-600 font-medium">Avg. Completion</CardDescription>
                        <CardTitle className="text-3xl">84%</CardTitle>
                    </CardHeader>
                </Card>
            </div>

            <Tabs defaultValue="accounts" className="space-y-6">
                <TabsList className="bg-muted/50 p-1 rounded-xl">
                    <TabsTrigger value="accounts" className="rounded-lg gap-2">
                        <Users className="w-4 h-4" />
                        Accounts
                    </TabsTrigger>
                    <TabsTrigger value="projects" className="rounded-lg gap-2">
                        <Briefcase className="w-4 h-4" />
                        Projects
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="accounts" className="space-y-4">
                    <Card className="rounded-2xl border-none shadow-sm overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/30">
                                <TableRow>
                                    <TableHead className="w-[300px]">User</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Organization/Major</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.map((user) => (
                                    <TableRow key={user.id} className="hover:bg-muted/20 transition-colors">
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="w-9 h-9 border border-border">
                                                    <AvatarFallback className={user.accountType === 'student' ? 'bg-primary/10 text-primary' : 'bg-orange-100 text-orange-700'}>
                                                        {user.name.slice(0, 2).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span>{user.name}</span>
                                                    <span className="text-xs text-muted-foreground font-normal">{user.email}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="capitalize rounded-full font-normal">
                                                {user.accountType}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {(user as any).university || (user as any).organization || "—"}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1.5 text-green-600 text-xs font-medium">
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                Active
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-40 rounded-xl">
                                                    <DropdownMenuLabel>Manage Account</DropdownMenuLabel>
                                                    <DropdownMenuItem className="gap-2 cursor-pointer">
                                                        <Edit className="w-4 h-4" /> Edit Profile
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className="gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                                                        onClick={() => handleDeleteUser(user.id, user.accountType)}
                                                    >
                                                        <Trash2 className="w-4 h-4" /> Delete Account
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                </TabsContent>

                <TabsContent value="projects" className="space-y-4">
                    <Card className="rounded-2xl border-none shadow-sm overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/30">
                                <TableRow>
                                    <TableHead className="w-[400px]">Project Title</TableHead>
                                    <TableHead>Poster</TableHead>
                                    <TableHead>Compensation</TableHead>
                                    <TableHead>Applicants</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredProjects.map((project) => (
                                    <TableRow key={project.id} className="hover:bg-muted/20 transition-colors">
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{project.title}</span>
                                                <div className="flex gap-2 mt-1">
                                                    {project.skills.slice(0, 2).map(skill => (
                                                        <Badge key={skill} variant="secondary" className="text-[10px] h-4 rounded-full font-normal px-1.5">
                                                            {skill}
                                                        </Badge>
                                                    ))}
                                                    {project.skills.length > 2 && <span className="text-[10px] text-muted-foreground">+{project.skills.length - 2}</span>}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                                                    <Building2 className="w-3 h-3 text-muted-foreground" />
                                                </div>
                                                <span className="text-sm">{project.poster}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm font-medium">{project.isPaid ? project.compensation : "Unpaid"}</span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="rounded-full font-normal">
                                                {project.applicants} / {project.spots}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-40 rounded-xl">
                                                    <DropdownMenuItem className="gap-2 cursor-pointer">
                                                        <Edit className="w-4 h-4" /> Edit Project
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className="gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                                                        onClick={() => handleDeleteProject(project.id)}
                                                    >
                                                        <Trash2 className="w-4 h-4" /> Delete Project
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
