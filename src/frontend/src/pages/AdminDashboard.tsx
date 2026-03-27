import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApp } from "@/context/AppContext";
import type { AttendanceStatus, Student } from "@/types";
import {
  CalendarCheck,
  CheckCircle,
  ChevronDown,
  Clock,
  LogOut,
  UserX,
  Users,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function StatusBadge({ status }: { status: string }) {
  if (status === "Present")
    return (
      <span className="status-present inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium">
        Present
      </span>
    );
  if (status === "Absent")
    return (
      <span className="status-absent inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium">
        Absent
      </span>
    );
  if (status === "Late")
    return (
      <span className="status-late inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium">
        Late
      </span>
    );
  if (status === "Approved")
    return (
      <Badge className="bg-green-100 text-green-700 border-0">Approved</Badge>
    );
  if (status === "Rejected")
    return <Badge className="bg-red-100 text-red-700 border-0">Rejected</Badge>;
  return <Badge variant="secondary">{status}</Badge>;
}

export default function AdminDashboard() {
  const {
    logout,
    students,
    attendance,
    leaveRequests,
    markAttendance,
    reviewLeave,
  } = useApp();
  const today = new Date().toISOString().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState(today);

  const todayRecords = attendance.filter((r) => r.date === today);
  const presentToday = todayRecords.filter(
    (r) => r.status === "Present",
  ).length;
  const absentToday = todayRecords.filter((r) => r.status === "Absent").length;
  const pendingLeaves = leaveRequests.filter(
    (l) => l.status === "Pending",
  ).length;

  const getStudentById = (id: string) => students.find((s) => s.id === id);
  const getAttendanceForDate = (studentId: string, date: string) =>
    attendance.find((r) => r.studentId === studentId && r.date === date);

  const handleMark = (studentId: string, status: AttendanceStatus) => {
    markAttendance(studentId, selectedDate, status);
    toast.success(
      `Marked ${status} for ${getStudentById(studentId)?.fullName}`,
    );
  };

  const handleReview = (
    leaveId: string,
    approved: boolean,
    studentId: string,
  ) => {
    reviewLeave(leaveId, approved ? "Approved" : "Rejected");
    const s = getStudentById(studentId);
    toast.success(
      `Leave ${approved ? "approved" : "rejected"} for ${s?.fullName}`,
    );
  };

  const [search, setSearch] = useState("");
  const filteredStudents = students.filter(
    (s) =>
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="navy-gradient text-white px-4 py-4 flex items-center gap-3">
        <img
          src="/assets/generated/vignan-logo-transparent.dim_200x200.png"
          alt="logo"
          className="h-9 w-9 rounded-full border border-white/30 object-cover"
        />
        <div className="flex-1">
          <p className="font-semibold text-sm">Vignan Nirula</p>
          <p className="text-white/70 text-xs">Admin Dashboard</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/10"
          onClick={logout}
          data-ocid="admin_dashboard.logout.button"
        >
          <LogOut size={14} className="mr-1" /> Logout
        </Button>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6 page-enter max-w-5xl">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            {
              label: "Total Students",
              value: students.length,
              icon: Users,
              color: "bg-primary/10 text-primary",
            },
            {
              label: "Present Today",
              value: presentToday,
              icon: CalendarCheck,
              color: "bg-green-100 text-green-600",
            },
            {
              label: "Absent Today",
              value: absentToday,
              icon: UserX,
              color: "bg-red-100 text-red-600",
            },
            {
              label: "Pending Leaves",
              value: pendingLeaves,
              icon: Clock,
              color: "bg-amber-100 text-amber-600",
            },
          ].map((s, i) => (
            <Card
              key={s.label}
              className="shadow-card"
              data-ocid={`stats.card.${i + 1}`}
            >
              <CardContent className="p-4 flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.color}`}
                >
                  <s.icon size={18} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="students">
          <TabsList className="mb-4">
            <TabsTrigger value="students" data-ocid="admin.students.tab">
              Students ({students.length})
            </TabsTrigger>
            <TabsTrigger value="attendance" data-ocid="admin.attendance.tab">
              Mark Attendance
            </TabsTrigger>
            <TabsTrigger value="leaves" data-ocid="admin.leaves.tab">
              Leaves
              {pendingLeaves > 0 && (
                <Badge className="ml-1 bg-amber-500 text-white text-xs border-0">
                  {pendingLeaves}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Students Tab */}
          <TabsContent value="students">
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className="text-base">All Students</CardTitle>
                  <Input
                    placeholder="Search by name or roll..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-xs"
                    data-ocid="admin.students.search_input"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Roll No.</TableHead>
                      <TableHead>Dept</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Registered</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center py-8 text-muted-foreground"
                          data-ocid="students.empty_state"
                        >
                          No students found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredStudents.map((s: Student, i) => (
                        <TableRow
                          key={s.id}
                          data-ocid={`students.item.${i + 1}`}
                        >
                          <TableCell className="text-muted-foreground text-xs">
                            {i + 1}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {s.photoBase64 ? (
                                <img
                                  src={s.photoBase64}
                                  alt={s.fullName}
                                  className="h-7 w-7 rounded-full object-cover"
                                />
                              ) : (
                                <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary font-bold">
                                  {s.fullName[0]}
                                </div>
                              )}
                              <span className="font-medium text-sm">
                                {s.fullName}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm font-mono">
                            {s.rollNumber}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {s.department}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs">
                            {s.year} Year
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {s.registeredAt}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Attendance Tab */}
          <TabsContent value="attendance">
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className="text-base">Mark Attendance</CardTitle>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-44"
                    data-ocid="admin.attendance_date.input"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Roll No.</TableHead>
                      <TableHead>Current</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((s, i) => {
                      const rec = getAttendanceForDate(s.id, selectedDate);
                      return (
                        <TableRow
                          key={s.id}
                          data-ocid={`attendance.item.${i + 1}`}
                        >
                          <TableCell className="font-medium text-sm">
                            {s.fullName}
                          </TableCell>
                          <TableCell className="text-xs font-mono">
                            {s.rollNumber}
                          </TableCell>
                          <TableCell>
                            {rec ? (
                              <StatusBadge status={rec.status} />
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                —
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {(
                                [
                                  "Present",
                                  "Absent",
                                  "Late",
                                ] as AttendanceStatus[]
                              ).map((st) => (
                                <Button
                                  key={st}
                                  variant={
                                    rec?.status === st ? "default" : "outline"
                                  }
                                  size="sm"
                                  className={`text-xs h-7 px-2 ${
                                    rec?.status === st && st === "Present"
                                      ? "bg-green-600 hover:bg-green-700"
                                      : rec?.status === st && st === "Absent"
                                        ? "bg-red-600 hover:bg-red-700"
                                        : rec?.status === st && st === "Late"
                                          ? "bg-amber-500 hover:bg-amber-600"
                                          : ""
                                  }`}
                                  onClick={() => handleMark(s.id, st)}
                                  data-ocid={`attendance.mark_${st.toLowerCase()}.button`}
                                >
                                  {st}
                                </Button>
                              ))}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leaves Tab */}
          <TabsContent value="leaves">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-base">Leave Requests</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {leaveRequests.length === 0 ? (
                  <div
                    className="p-8 text-center text-muted-foreground"
                    data-ocid="leaves.empty_state"
                  >
                    No leave requests
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>From</TableHead>
                        <TableHead>To</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leaveRequests.map((l, i) => {
                        const s = getStudentById(l.studentId);
                        return (
                          <TableRow
                            key={l.id}
                            data-ocid={`leaves.item.${i + 1}`}
                          >
                            <TableCell className="text-sm font-medium">
                              {s?.fullName ?? "Unknown"}
                            </TableCell>
                            <TableCell className="text-sm max-w-xs">
                              <p
                                className="truncate text-muted-foreground"
                                title={l.reason}
                              >
                                {l.reason}
                              </p>
                            </TableCell>
                            <TableCell className="text-xs">
                              {l.fromDate}
                            </TableCell>
                            <TableCell className="text-xs">
                              {l.toDate}
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={l.status} />
                            </TableCell>
                            <TableCell>
                              {l.status === "Pending" ? (
                                <div className="flex gap-1">
                                  <Button
                                    size="sm"
                                    className="h-7 px-2 bg-green-600 hover:bg-green-700 text-white text-xs"
                                    onClick={() =>
                                      handleReview(l.id, true, l.studentId)
                                    }
                                    data-ocid={`leaves.approve.button.${i + 1}`}
                                  >
                                    <CheckCircle size={12} className="mr-1" />{" "}
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 px-2 text-red-600 border-red-200 hover:bg-red-50 text-xs"
                                    onClick={() =>
                                      handleReview(l.id, false, l.studentId)
                                    }
                                    data-ocid={`leaves.reject.button.${i + 1}`}
                                  >
                                    <XCircle size={12} className="mr-1" />{" "}
                                    Reject
                                  </Button>
                                </div>
                              ) : (
                                <span className="text-xs text-muted-foreground">
                                  Reviewed
                                </span>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
