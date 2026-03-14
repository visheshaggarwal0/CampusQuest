import { createClient } from '@supabase/supabase-js';
import { students, faculty, clubs, projects } from '../src/app/data/mockData';
import { projectId, publicAnonKey } from '../utils/supabase/info';

const supabaseUrl = `https://${projectId}.supabase.co`;
const supabase = createClient(supabaseUrl, publicAnonKey);

async function migrate() {
    console.log('Starting migration...');

    // 1. Migrate Students
    console.log('Migrating students...');
    const { error: studentError } = await supabase.from('students').upsert(
        students.map(s => ({
            id: s.id,
            name: s.name,
            email: s.email,
            avatar_initials: s.avatarInitials,
            university: s.university,
            major: s.major,
            year: s.year,
            bio: s.bio,
            skills: s.skills,
            credibility_score: s.credibilityScore,
            projects_completed: s.projectsCompleted,
            active_projects: s.activeProjects,
            avg_rating: s.avgRating,
            hours_logged: s.hoursLogged
        }))
    );
    if (studentError) console.error('Error migrating students:', studentError);

    // 2. Migrate Faculty
    console.log('Migrating faculty...');
    const { error: facultyError } = await supabase.from('faculty').upsert(
        faculty.map(f => ({
            id: f.id,
            name: f.name,
            email: f.email,
            avatar_initials: f.avatarInitials,
            university: f.university,
            department: f.department,
            title: f.title,
            research_areas: f.researchAreas,
            projects_posted: f.projectsPosted,
            bio: f.bio
        }))
    );
    if (facultyError) console.error('Error migrating faculty:', facultyError);

    // 3. Migrate Clubs
    console.log('Migrating clubs...');
    const { error: clubError } = await supabase.from('clubs').upsert(
        clubs.map(c => ({
            id: c.id,
            name: c.name,
            email: c.email,
            avatar_initials: c.avatarInitials,
            university: c.university,
            category: c.category,
            description: c.description,
            projects_posted: c.projectsPosted,
            founded_year: c.foundedYear,
            members: (c as any).members || 0
        }))
    );
    if (clubError) console.error('Error migrating clubs:', clubError);

    // 4. Migrate Projects
    console.log('Migrating projects...');
    const { error: projectError } = await supabase.from('projects').upsert(
        projects.map(p => ({
            id: p.id,
            title: p.title,
            poster: p.poster,
            poster_id: p.posterId,
            poster_type: p.posterType,
            duration: p.duration,
            duration_months: p.durationMonths,
            difficulty: p.difficulty,
            is_paid: p.isPaid,
            compensation: p.compensation,
            skills: p.skills,
            description: p.description,
            posted_days_ago: p.postedDaysAgo,
            applicants: p.applicants,
            spots: p.spots
        }))
    );
    if (projectError) console.error('Error migrating projects:', projectError);

    console.log('Migration finished!');
}

migrate();
