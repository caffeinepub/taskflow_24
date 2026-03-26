import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { attendanceRecords } from "@/data/mockData";
import { Bot, Eye, Filter } from "lucide-react";
import { useState } from "react";

type Status = "all" | "present" | "late" | "absent";

export default function AttendRecords() {
  const [statusFilter, setStatusFilter] = useState<Status>("all");
  const [dateFilter, setDateFilter] = useState("");

  const filtered = attendanceRecords.filter((r) => {
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    const matchDate = !dateFilter || r.date === dateFilter;
    return matchStatus && matchDate;
  });

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Attendance Records
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {filtered.length} records found
          </p>
        </div>
        <Button
          variant="outline"
          className="gap-2 h-8 text-sm"
          data-ocid="records.export.button"
        >
          <Filter className="w-3.5 h-3.5" />
          Export
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <Input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="w-44 text-sm"
          data-ocid="records.date.input"
        />
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as Status)}
        >
          <SelectTrigger className="w-40" data-ocid="records.status.select">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="present">Present</SelectItem>
            <SelectItem value="late">Late</SelectItem>
            <SelectItem value="absent">Absent</SelectItem>
          </SelectContent>
        </Select>
        {(statusFilter !== "all" || dateFilter) && (
          <Button
            variant="ghost"
            className="h-9 text-sm text-muted-foreground"
            onClick={() => {
              setStatusFilter("all");
              setDateFilter("");
            }}
            data-ocid="records.clear.button"
          >
            Clear filters
          </Button>
        )}
      </div>

      <Card className="card-shadow" data-ocid="records.table">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">
            Attendance Records
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div
              className="text-center py-16 text-muted-foreground"
              data-ocid="records.empty_state"
            >
              <p className="text-sm">No records match your filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">
                      Employee
                    </th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">
                      Date
                    </th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">
                      Clock In
                    </th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">
                      Clock Out
                    </th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">
                      Duration
                    </th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">
                      Location
                    </th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">
                      AI
                    </th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((rec, i) => (
                    <tr
                      key={rec.id}
                      className="border-b border-border hover:bg-muted/30 transition-colors"
                      data-ocid={`records.row.${i + 1}`}
                    >
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-7 h-7">
                            <AvatarFallback
                              style={{ backgroundColor: rec.avatarColor }}
                              className="text-white text-[9px] font-semibold"
                            >
                              {rec.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-xs font-medium text-foreground">
                              {rec.employeeName}
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              {rec.employeeId}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-xs text-foreground">
                        {rec.date}
                      </td>
                      <td className="px-4 py-2.5 text-xs text-foreground">
                        {rec.clockIn}
                      </td>
                      <td className="px-4 py-2.5 text-xs text-foreground">
                        {rec.clockOut}
                      </td>
                      <td className="px-4 py-2.5 text-xs text-foreground">
                        {rec.duration}
                      </td>
                      <td className="px-4 py-2.5">
                        <span
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                            rec.status === "present"
                              ? "status-present"
                              : rec.status === "late"
                                ? "status-late"
                                : "status-absent"
                          }`}
                        >
                          {rec.status.charAt(0).toUpperCase() +
                            rec.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-xs text-muted-foreground">
                        {rec.location}
                      </td>
                      <td className="px-4 py-2.5">
                        {rec.aiVerified && (
                          <span className="flex items-center gap-1 text-[10px] font-medium text-primary">
                            <Bot className="w-3 h-3" />
                            AI Verified
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs gap-1"
                          data-ocid={`records.view.button.${i + 1}`}
                        >
                          <Eye className="w-3 h-3" />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
