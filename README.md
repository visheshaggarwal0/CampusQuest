# 🎓 CampusQuest
<img width="1920" height="1080" alt="Screenshot (51)" src="https://github.com/user-attachments/assets/069f4155-3c5e-4ce5-b84f-5132dd5fc923" />

**CampusQuest** is a state-of-the-art collaboration platform designed to bridge the gap between students, faculty, and campus clubs. By facilitating micro-internships and project-based learning, it empowers students to build professional portfolios while solving real-world campus challenges.

---

## 🌟 Key Features

### 🚀 Student Empowerment
- **Micro-Internships**: Discover high-impact, short-term projects across various departments.
- **Credibility System**: A gamified experience where students earn points and ratings for successful completions.
- **Dynamic Portfolio**: Automatically track and showcase your contributions to recruiters.

### 🏛 Faculty & Club Integration
- **Project Hosting**: Easily post and manage micro-internships.
- **Talent Discovery**: Find the right student skills for your specific needs.
- **Performance Analytics**: Real-time insights into project progress and student engagement.

### 🛡 Administrative Control
- **Integrity Management**: Centralized dashboard to oversee accounts and ensure project quality.
- **Role-Based Access**: Secure, tiered permissions for Students, Faculty, and Admins.

---

## 🛠 Tech Stack

CampusQuest is built using a modern, enterprise-grade technology stack:

| Component | Technology |
| :--- | :--- |
| **Frontend Framework** | [React 19](https://react.dev/) + [Vite 6](https://vitejs.dev/) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) (Beta) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **UI Components** | [Radix UI](https://www.radix-ui.com/) + [Shadcn UI](https://ui.shadcn.com/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Charts** | [Recharts](https://recharts.org/) |
| **Backend & Database** | [Supabase](https://supabase.com/) (PostgreSQL, Realtime, Auth) |
| **Routing** | [React Router 7](https://reactrouter.com/) |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**(v18+)
- **Supabase**: An active project and access to the SQL Editor.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/visheshaggarwal0/CampusQuest.git
   cd CampusQuest
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Supabase**:
   Update `utils/supabase/info.tsx` with your credentials:
   ```typescript
   export const projectId = "your-project-id";
   export const publicAnonKey = "your-public-anon-key";
   ```

4. **Initialize Database**:
   Run the `supabase_schema.sql` provided in the `supabase/` directory within your Supabase SQL Editor.

5. **Start Development Server**:
   ```bash
   npm run dev
   ```

---

## 📂 Project Structure

```bash
CampusQuest/
├── public/          # Static assets
├── src/
│   ├── app/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page-level components (Admin, Profile, Feed, etc.)
│   │   ├── context/     # React Context for state management
│   │   └── routes.tsx   # Application routing logic
│   ├── styles/      # Global CSS and Tailwind directives
│   └── main.tsx     # Application entry point
├── supabase/        # Database schemas and migrations
└── utils/           # Utility functions (Supabase clients, helpers)
```

---

## 🤝 Contributing

We welcome contributions! Whether it's a bug fix, new feature, or documentation improvement, please feel free to open a Pull Request.

---

*Built with ☕ for Campus Collaborators by the CampusQuest Team.*
