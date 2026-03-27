import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useApp } from "@/context/AppContext";
import type { Student } from "@/types";
import {
  CalendarDays,
  FileText,
  GraduationCap,
  LogOut,
  User,
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

export default function StudentDashboard({ student }: { student: Student }) {
  const { logout, getStudentAttendance, getStudentLeaves, submitLeave } =
    useApp();
  const records = getStudentAttendance(student.id);
  const leaves = getStudentLeaves(student.id);

  const [leaveForm, setLeaveForm] = useState({
    reason: "",
    fromDate: "",
    toDate: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const presentCount = records.filter((r) => r.status === "Present").length;
  const totalCount = records.length;
  const percentage =
    totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

  const handleLeaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveForm.reason || !leaveForm.fromDate || !leaveForm.toDate) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    submitLeave(
      student.id,
      leaveForm.reason,
      leaveForm.fromDate,
      leaveForm.toDate,
    );
    setLeaveForm({ reason: "", fromDate: "", toDate: "" });
    setSubmitting(false);
    toast.success("Leave request submitted!");
  };

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
          <p className="text-white/70 text-xs">Student Dashboard</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/10"
          onClick={logout}
          data-ocid="student_dashboard.logout.button"
        >
          <LogOut size={14} className="mr-1" /> Logout
        </Button>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6 page-enter max-w-4xl">
        {/* Profile Card */}
        <Card className="mb-6 shadow-card">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              {student.photoBase64 ? (
                <img
                  src={student.photoBase64}
                  alt={student.fullName}
                  className="h-16 w-16 rounded-full object-cover border-2 border-primary/20"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User size={28} className="text-primary" />
                </div>
              )}
              <div className="flex-1">
                <h2 className="font-display font-bold text-xl">
                  {student.fullName}
                </h2>
                <p className="text-muted-foreground text-sm">
                  {student.rollNumber} • {student.department} • {student.year}{" "}
                  Year
                </p>
                <p className="text-muted-foreground text-xs">{student.email}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">{percentage}%</p>
                <p className="text-xs text-muted-foreground">Attendance</p>
                <Badge
                  className={
                    percentage >= 75
                      ? "bg-green-100 text-green-700 border-0"
                      : "bg-red-100 text-red-700 border-0"
                  }
                >
                  {percentage >= 75 ? "Eligible" : "Short"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="attendance" data-ocid="student_dashboard.tab">
          <TabsList className="mb-4">
            <TabsTrigger
              value="attendance"
              data-ocid="student_dashboard.attendance.tab"
            >
              <CalendarDays size={14} className="mr-1" /> Attendance
            </TabsTrigger>
            <TabsTrigger value="leave" data-ocid="student_dashboard.leave.tab">
              <FileText size={14} className="mr-1" /> Leave
            </TabsTrigger>
            <TabsTrigger
              value="profile"
              data-ocid="student_dashboard.profile.tab"
            >
              <GraduationCap size={14} className="mr-1" /> Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="attendance">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-base">Attendance Records</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {records.length === 0 ? (
                  <div
                    className="p-8 text-center text-muted-foreground"
                    data-ocid="attendance.empty_state"
                  >
                    No records yet
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Marked By</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {records.slice(0, 14).map((r, i) => (
                        <TableRow
                          key={r.id}
                          data-ocid={`attendance.item.${i + 1}`}
                        >
                          <TableCell className="text-sm">{r.date}</TableCell>
                          <TableCell>
                            <StatusBadge status={r.status} />
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground capitalize">
                            {r.markedBy}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leave">
            <div className="space-y-4">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-base">Apply for Leave</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLeaveSubmit} className="space-y-3">
                    <div>
                      <Label>Reason</Label>
                      <Textarea
                        value={leaveForm.reason}
                        onChange={(e) =>
                          setLeaveForm((p) => ({
                            ...p,
                            reason: e.target.value,
                          }))
                        }
                        placeholder="Describe the reason for leave..."
                        required
                        rows={2}
                        data-ocid="leave.reason.textarea"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>From Date</Label>
                        <Input
                          type="date"
                          value={leaveForm.fromDate}
                          onChange={(e) =>
                            setLeaveForm((p) => ({
                              ...p,
                              fromDate: e.target.value,
                            }))
                          }
                          required
                          data-ocid="leave.from_date.input"
                        />
                      </div>
                      <div>
                        <Label>To Date</Label>
                        <Input
                          type="date"
                          value={leaveForm.toDate}
                          onChange={(e) =>
                            setLeaveForm((p) => ({
                              ...p,
                              toDate: e.target.value,
                            }))
                          }
                          required
                          data-ocid="leave.to_date.input"
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-primary text-primary-foreground"
                      disabled={submitting}
                      data-ocid="leave.submit.button"
                    >
                      {submitting ? "Submitting..." : "Submit Leave Request"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-base">My Leave Requests</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {leaves.length === 0 ? (
                    <div
                      className="p-6 text-center text-muted-foreground"
                      data-ocid="leaves.empty_state"
                    >
                      No leave requests
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Reason</TableHead>
                          <TableHead>From</TableHead>
                          <TableHead>To</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {leaves.map((l, i) => (
                          <TableRow
                            key={l.id}
                            data-ocid={`leaves.item.${i + 1}`}
                          >
                            <TableCell className="text-sm max-w-xs truncate">
                              {l.reason}
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
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="profile">
            <Card className="shadow-card">
              <CardContent className="p-6 space-y-3">
                {[
                  ["Full Name", student.fullName],
                  ["Roll Number", student.rollNumber],
                  ["Department", student.department],
                  ["Year", `${student.year} Year`],
                  ["Email", student.email],
                  ["Registered On", student.registeredAt],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 py-2 border-b border-border last:border-0"
                  >
                    <span className="text-sm text-muted-foreground w-32 shrink-0">
                      {label}
                    </span>
                    <span className="text-sm font-medium">{value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
