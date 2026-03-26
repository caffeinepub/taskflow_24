import AttendLayout from "@/components/AttendLayout";
import { Toaster } from "@/components/ui/sonner";
import AttendAnalytics from "@/pages/AttendAnalytics";
import AttendDashboard from "@/pages/AttendDashboard";
import AttendEmployees from "@/pages/AttendEmployees";
import AttendManagement from "@/pages/AttendManagement";
import AttendRecords from "@/pages/AttendRecords";
import { useState } from "react";

type Page = "dashboard" | "employees" | "records" | "analytics" | "management";

export default function App() {
  const [page, setPage] = useState<Page>("dashboard");

  return (
    <>
      <AttendLayout activePage={page} onNavigate={setPage}>
        {page === "dashboard" && <AttendDashboard />}
        {page === "employees" && <AttendEmployees />}
        {page === "records" && <AttendRecords />}
        {page === "analytics" && <AttendAnalytics />}
        {page === "management" && <AttendManagement />}
      </AttendLayout>
      <Toaster />
    </>
  );
}
