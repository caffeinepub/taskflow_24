import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  activityFeed,
  attendanceRecords,
  generate30DayTrend,
} from "@/data/mockData";
import {
  Bot,
  CalendarClock,
  CheckCircle,
  Clock,
  FileText,
  TrendingDown,
  TrendingUp,
  UserCheck,
  UserPlus,
  UserX,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const DONUT_COLORS = ["#18A6B8", "#F59E0B", "#EF4444"];
const AREA_COLOR = "#18A6B8";

const donutData = [
  { name: "Present", value: 198 },
  { name: "Late", value: 23 },
  { name: "Absent", value: 26 },
];

const kpis = [
  {
    label: "Total Employees",
    value: "247",
    delta: "+3",
    deltaType: "up",
    sub: "3 new this month",
    icon: Users,
    color: "text-primary",
  },
  {
    label: "Present Today",
    value: "198",
    delta: "80.2%",
    deltaType: "up",
    sub: "of total workforce",
    icon: UserCheck,
    color: "text-green-600",
  },
  {
    label: "Late Arrivals",
    value: "23",
    delta: "9.3%",
    deltaType: "neutral",
    sub: "arrived after 9:00 AM",
    icon: Clock,
    color: "text-amber-600",
  },
  {
    label: "Absences",
    value: "26",
    delta: "10.5%",
    deltaType: "down",
    sub: "unexcused + excused",
    icon: UserX,
    color: "text-red-500",
  },
];

const trendData = generate30DayTrend();

export default function AttendDashboard() {
  const [branch, setBranch] = useState("all");

  const todayRecords = useMemo(
    () => attendanceRecords.filter((r) => r.date === "2026-03-24"),
    [],
  );

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Page Header */}
      <div
        className="flex items-start justify-between mb-6"
        data-ocid="dashboard.page"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Employee Attendance Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            AI-powered attendance management system
          </p>
        </div>
        <Select value={branch} onValueChange={setBranch}>
          <SelectTrigger
            className="w-40 h-8 text-sm"
            data-ocid="dashboard.branch.select"
          >
            <SelectValue placeholder="Branch" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Branches</SelectItem>
            <SelectItem value="hq">HQ</SelectItem>
            <SelectItem value="branch-a">Branch A</SelectItem>
            <SelectItem value="branch-b">Branch B</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map((kpi, i) => (
          <Card
            key={kpi.label}
            className="card-shadow"
            data-ocid={`dashboard.kpi.card.${i + 1}`}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-muted-foreground">
                  {kpi.label}
                </span>
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
                </div>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-foreground">
                  {kpi.value}
                </span>
                <span
                  className={`text-xs font-medium px-1.5 py-0.5 rounded mb-1 flex items-center gap-0.5 ${
                    kpi.deltaType === "up"
                      ? "status-present"
                      : kpi.deltaType === "down"
                        ? "status-absent"
                        : "status-late"
                  }`}
                >
                  {kpi.deltaType === "up" ? (
                    <TrendingUp className="w-2.5 h-2.5" />
                  ) : kpi.deltaType === "down" ? (
                    <TrendingDown className="w-2.5 h-2.5" />
                  ) : null}
                  {kpi.delta}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
        <Card
          className="card-shadow lg:col-span-2"
          data-ocid="dashboard.donut.card"
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">
              Today&apos;s Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  dataKey="value"
                  stroke="none"
                >
                  {donutData.map((entry, idx) => (
                    <Cell key={entry.name} fill={DONUT_COLORS[idx]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => [`${v} employees`]} />
                <Legend
                  iconSize={8}
                  iconType="circle"
                  wrapperStyle={{ fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-1 grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-lg font-bold text-foreground">80%</p>
                <p className="text-[10px] text-muted-foreground">Present</p>
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">9%</p>
                <p className="text-[10px] text-muted-foreground">Late</p>
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">11%</p>
                <p className="text-[10px] text-muted-foreground">Absent</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className="card-shadow lg:col-span-3"
          data-ocid="dashboard.trend.card"
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">
              Attendance Overview — Last 30 Days
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={230}>
              <AreaChart
                data={trendData}
                margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="colorAttendance"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={AREA_COLOR}
                      stopOpacity={0.2}
                    />
                    <stop offset="95%" stopColor={AREA_COLOR} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={4} />
                <YAxis tick={{ fontSize: 10 }} domain={[60, 100]} />
                <Tooltip
                  formatter={(v: number) => [`${v}%`, "Attendance Rate"]}
                />
                <Area
                  type="monotone"
                  dataKey="attendance"
                  stroke={AREA_COLOR}
                  strokeWidth={2}
                  fill="url(#colorAttendance)"
                  connectNulls={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Activity + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
        <Card
          className="card-shadow lg:col-span-3"
          data-ocid="dashboard.activity.card"
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">
                Real-Time Activity
              </CardTitle>
              <span className="flex items-center gap-1 text-[10px] text-green-600 font-medium">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                Live
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {activityFeed.map((item, i) => (
              <div
                key={item.id}
                className="flex items-center gap-3 py-2 border-b border-border last:border-0"
                data-ocid={`activity.item.${i + 1}`}
              >
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback
                    style={{ backgroundColor: item.avatarColor }}
                    className="text-white text-[10px] font-semibold"
                  >
                    {item.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.action}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                  <span
                    className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                      item.status === "present"
                        ? "status-present"
                        : item.status === "late"
                          ? "status-late"
                          : "status-absent"
                    }`}
                  >
                    {item.status === "present"
                      ? "On Time"
                      : item.status === "late"
                        ? "Late"
                        : "Absent"}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card
          className="card-shadow lg:col-span-2"
          data-ocid="dashboard.quickactions.card"
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start gap-2 h-9 text-sm"
              data-ocid="quickactions.approve.button"
            >
              <CheckCircle className="w-4 h-4 text-green-600" />
              Approve Requests
              <Badge className="ml-auto status-present border-0 text-[10px]">
                3
              </Badge>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-2 h-9 text-sm"
              data-ocid="quickactions.report.button"
            >
              <FileText className="w-4 h-4 text-primary" />
              Generate Report
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-2 h-9 text-sm"
              data-ocid="quickactions.addemployee.button"
            >
              <UserPlus className="w-4 h-4 text-purple-600" />
              Add Employee
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-2 h-9 text-sm"
              data-ocid="quickactions.shift.button"
            >
              <CalendarClock className="w-4 h-4 text-amber-600" />
              Shift Management
            </Button>
            <div className="mt-3 p-3 rounded-lg bg-accent border border-border">
              <div className="flex items-center gap-2 mb-1">
                <Bot className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-primary">
                  AI Insight
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Late arrivals increased by 2.1% vs last week. Engineering dept
                shows highest punctuality this month.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Records Table */}
      <Card className="card-shadow" data-ocid="dashboard.records.card">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">
              Today&apos;s Attendance Records
            </CardTitle>
            <span className="text-xs text-muted-foreground">
              March 24, 2026
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">
                    Employee
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
                </tr>
              </thead>
              <tbody>
                {todayRecords.map((rec, i) => (
                  <tr
                    key={rec.id}
                    className="border-b border-border hover:bg-muted/30 transition-colors"
                    data-ocid={`dashboard.records.item.${i + 1}`}
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
