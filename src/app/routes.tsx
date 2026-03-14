import { createBrowserRouter } from "react-router";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { SignUpPage } from "./pages/SignUpPage";
import { DashboardLayout } from "./components/DashboardLayout";
import { StudentDashboard } from "./pages/StudentDashboard";
import { ProjectsFeed } from "./pages/ProjectsFeed";
import { ProjectDetails } from "./pages/ProjectDetails";
import { CredibilityPage } from "./pages/CredibilityPage";
import { MyProjects } from "./pages/MyProjects";
import { ProfilePage } from "./pages/ProfilePage";
import { AdminDashboard } from "./pages/AdminDashboard";
import { ErrorBoundary } from "./components/ErrorBoundary";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/login",
    Component: LoginPage,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/signup",
    Component: SignUpPage,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/dashboard",
    Component: DashboardLayout,
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, Component: StudentDashboard },
      { path: "projects", Component: ProjectsFeed },
      { path: "projects/:id", Component: ProjectDetails },
      { path: "my-projects", Component: MyProjects },
      { path: "credibility/:studentId?", Component: CredibilityPage },
      { path: "profile", Component: ProfilePage },
      { path: "admin", Component: AdminDashboard },
    ],
  },
]);