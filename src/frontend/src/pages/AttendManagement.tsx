import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type LeaveRequest, leaveRequests, shifts } from "@/data/mockData";
import { Calendar, CheckCircle, Clock, Users, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function AttendManagement() {
  const [requests, setRequests] = useState<LeaveRequest[]>(leaveRequests);

  function handleApprove(id: string) {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "approved" } : r)),
    );
    toast.success("Leave request approved");
  }

  function handleReject(id: string) {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "rejected" } : r)),
    );
    toast.error("Leave request rejected");
  }

  const pending = requests.filter((r) => r.status === "pending");
  const resolved = requests.filter((r) => r.status !== "pending");

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Management</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Leave requests and shift management
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="card-shadow">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Pending Requests</p>
            <p className="text-3xl font-bold text-foreground mt-1">
              {pending.length}
            </p>
          </CardContent>
        </Card>
        <Card className="card-shadow">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Approved This Month</p>
            <p className="text-3xl font-bold text-foreground mt-1">
              {requests.filter((r) => r.status === "approved").length}
            </p>
          </CardContent>
        </Card>
        <Card className="card-shadow">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total Shifts</p>
            <p className="text-3xl font-bold text-foreground mt-1">
              {shifts.length}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        {/* Leave Requests */}
        <Card
          className="card-shadow xl:col-span-3"
          data-ocid="management.leaves.card"
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">
                Leave Requests
              </CardTitle>
              {pending.length > 0 && (
                <Badge className="status-present border-0 text-[10px]">
                  {pending.length} pending
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Pending
            </p>
            {pending.length === 0 ? (
              <p
                className="text-sm text-muted-foreground py-4 text-center"
                data-ocid="management.leaves.empty_state"
              >
                No pending requests
              </p>
            ) : (
              pending.map((req, i) => (
                <div
                  key={req.id}
                  className="border border-border rounded-lg p-3"
                  data-ocid={`management.leave.item.${i + 1}`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback
                        style={{ backgroundColor: req.avatarColor }}
                        className="text-white text-[10px] font-semibold"
                      >
                        {req.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground">
                          {req.employeeName}
                        </p>
                        <span className="text-[10px] status-late px-1.5 py-0.5 rounded">
                          {req.leaveType}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {req.department}
                      </p>
                      <div className="flex items-center gap-1 mt-1 text-[11px] text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {req.startDate} → {req.endDate} ({req.days} day
                        {req.days > 1 ? "s" : ""})
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 italic">
                        &ldquo;{req.reason}&rdquo;
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      className="h-7 text-xs gap-1 flex-1"
                      onClick={() => handleApprove(req.id)}
                      data-ocid={`management.approve.button.${i + 1}`}
                    >
                      <CheckCircle className="w-3 h-3" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs gap-1 flex-1 text-destructive hover:bg-destructive/10"
                      onClick={() => handleReject(req.id)}
                      data-ocid={`management.reject.button.${i + 1}`}
                    >
                      <XCircle className="w-3 h-3" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))
            )}

            {resolved.length > 0 && (
              <>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide pt-2">
                  Resolved
                </p>
                {resolved.map((req, i) => (
                  <div
                    key={req.id}
                    className="border border-border rounded-lg p-3 opacity-70"
                    data-ocid={`management.resolved.item.${i + 1}`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-7 h-7">
                        <AvatarFallback
                          style={{ backgroundColor: req.avatarColor }}
                          className="text-white text-[9px] font-semibold"
                        >
                          {req.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-foreground">
                          {req.employeeName}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {req.leaveType} · {req.days} day
                          {req.days > 1 ? "s" : ""}
                        </p>
                      </div>
                      <span
                        className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                          req.status === "approved"
                            ? "status-present"
                            : "status-absent"
                        }`}
                      >
                        {req.status.charAt(0).toUpperCase() +
                          req.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </>
            )}
          </CardContent>
        </Card>

        {/* Shift Management */}
        <Card
          className="card-shadow xl:col-span-2"
          data-ocid="management.shifts.card"
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">
              Shift Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {shifts.map((shift, i) => (
              <div
                key={shift.id}
                className="border border-border rounded-lg p-3"
                data-ocid={`management.shift.item.${i + 1}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {shift.shiftName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {shift.department}
                    </p>
                  </div>
                  <span className="text-[10px] bg-accent text-primary font-medium px-1.5 py-0.5 rounded">
                    {shift.daysOfWeek}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {shift.startTime} – {shift.endTime}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="w-3 h-3" />
                    {shift.assignedCount} employees
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
