import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { departmentStats, monthlyTrend, topPerformers } from "@/data/mockData";
import { Award, TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function AttendAnalytics() {
  const avgRate = (
    (departmentStats.reduce((a, d) => a + d.present / d.total, 0) /
      departmentStats.length) *
    100
  ).toFixed(1);

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Attendance insights and performance metrics
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="card-shadow">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">
              Avg Attendance Rate
            </p>
            <p className="text-3xl font-bold text-foreground">{avgRate}%</p>
            <p className="text-xs status-present px-1.5 py-0.5 rounded mt-1 inline-block">
              This Month
            </p>
          </CardContent>
        </Card>
        <Card className="card-shadow">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">
              Peak Attendance Day
            </p>
            <p className="text-3xl font-bold text-foreground">Mon</p>
            <p className="text-xs text-muted-foreground mt-1">
              92.3% avg attendance
            </p>
          </CardContent>
        </Card>
        <Card className="card-shadow">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Avg Work Hours</p>
            <p className="text-3xl font-bold text-foreground">8.6h</p>
            <p className="text-xs text-muted-foreground mt-1">
              per employee/day
            </p>
          </CardContent>
        </Card>
        <Card className="card-shadow">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Overtime Hours</p>
            <p className="text-3xl font-bold text-foreground">342h</p>
            <p className="text-xs status-late px-1.5 py-0.5 rounded mt-1 inline-block">
              +12% vs last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
        <Card
          className="card-shadow lg:col-span-3"
          data-ocid="analytics.dept.card"
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">
              Department-wise Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={departmentStats}
                margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="department" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Bar
                  dataKey="present"
                  name="Present"
                  fill="#18A6B8"
                  radius={[3, 3, 0, 0]}
                />
                <Bar
                  dataKey="late"
                  name="Late"
                  fill="#F59E0B"
                  radius={[3, 3, 0, 0]}
                />
                <Bar
                  dataKey="absent"
                  name="Absent"
                  fill="#EF4444"
                  radius={[3, 3, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card
          className="card-shadow lg:col-span-2"
          data-ocid="analytics.monthly.card"
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">
              Monthly Attendance Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart
                data={monthlyTrend}
                margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} domain={[70, 100]} />
                <Tooltip
                  formatter={(v: number) => [`${v}%`, "Attendance Rate"]}
                />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="#18A6B8"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#18A6B8" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers */}
      <Card className="card-shadow" data-ocid="analytics.performers.card">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            <CardTitle className="text-sm font-semibold">
              Top Performers — Attendance Rate
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topPerformers.map((p, i) => (
              <div
                key={p.name}
                className="flex items-center gap-3"
                data-ocid={`analytics.performer.item.${i + 1}`}
              >
                <span className="text-sm font-bold text-muted-foreground w-5 text-right">
                  {i + 1}
                </span>
                <Avatar className="w-8 h-8">
                  <AvatarFallback
                    style={{ backgroundColor: p.avatarColor }}
                    className="text-white text-[10px] font-semibold"
                  >
                    {p.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {p.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {p.department}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${p.rate}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-foreground w-12 text-right">
                    {p.rate}%
                  </span>
                </div>
                {i === 0 && <TrendingUp className="w-4 h-4 text-green-500" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
