# CampusQuest

CampusQuest is a modern platform designed to connect university students with faculty and student-run clubs for micro-internships, projects, and collaboration.

## ✨ Features

- **Micro-Internships**: Discover and apply to short-term projects that build your resume.
- **Credibility System**: Earn points and ratings for every project you complete.
- **Unified Dashboard**: Personalized views for Students, Faculty, and Clubs.
- **Admin Control**: Centralized dashboard to manage accounts and project integrity.
- **Supabase Powered**: High-performance real-time database and secure authentication.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- A Supabase Project

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your Supabase credentials in `utils/supabase/info.tsx`:
   ```typescript
   export const projectId = "your-project-id";
   export const publicAnonKey = "your-public-anon-key";
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

### Database Setup

To initialize the database, run the `supabase_schema.sql` (found in the brain directory or provided in documentation) in your Supabase SQL Editor.

## 🛠 Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Icons**: Lucide React
- **Backend**: Supabase (PostgreSQL, Auth, RLS)
- **UI Components**: Radix UI, Shadcn/UI (v0)

---
*Built with ❤️ for Campus Collaborators.*
