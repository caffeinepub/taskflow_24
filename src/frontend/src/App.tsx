import { Toaster } from "@/components/ui/sonner";
import { AppProvider, useApp } from "@/context/AppContext";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminLogin from "@/pages/AdminLogin";
import Landing from "@/pages/Landing";
import StudentDashboard from "@/pages/StudentDashboard";
import StudentLogin from "@/pages/StudentLogin";
import StudentRegister from "@/pages/StudentRegister";
import { useState } from "react";

type Page = "landing" | "student-login" | "student-register" | "admin-login";

function AppContent() {
  const { auth } = useApp();
  const [page, setPage] = useState<Page>("landing");

  if (auth.role === "student")
    return <StudentDashboard student={auth.student} />;
  if (auth.role === "admin") return <AdminDashboard />;

  if (page === "student-login")
    return (
      <StudentLogin
        onBack={() => setPage("landing")}
        onRegister={() => setPage("student-register")}
      />
    );
  if (page === "student-register")
    return (
      <StudentRegister
        onBack={() => setPage("landing")}
        onLogin={() => setPage("student-login")}
      />
    );
  if (page === "admin-login")
    return <AdminLogin onBack={() => setPage("landing")} />;

  return (
    <Landing
      onStudentLogin={() => setPage("student-login")}
      onAdminLogin={() => setPage("admin-login")}
      onStudentRegister={() => setPage("student-register")}
    />
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
      <Toaster richColors position="top-right" />
    </AppProvider>
  );
}
