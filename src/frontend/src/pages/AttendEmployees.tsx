import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type Employee, employees } from "@/data/mockData";
import { Building2, Mail, Phone, Search, UserPlus, Users } from "lucide-react";
import { useState } from "react";

const departments = [
  "All",
  "Engineering",
  "Marketing",
  "Finance",
  "Sales",
  "HR",
  "Operations",
];

export default function AttendEmployees() {
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("All");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    department: "",
    position: "",
    email: "",
    phone: "",
  });
  const [list, setList] = useState<Employee[]>(employees);

  const filtered = list.filter((e) => {
    const matchSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase());
    const matchDept = dept === "All" || e.department === dept;
    return matchSearch && matchDept;
  });

  function handleAdd() {
    if (!form.name || !form.department || !form.email) return;
    const newEmp: Employee = {
      id: `E${String(list.length + 1).padStart(3, "0")}`,
      name: form.name,
      department: form.department,
      position: form.position || "Employee",
      email: form.email,
      phone: form.phone,
      status: "active",
      initials: form.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
      joinDate: new Date().toISOString().split("T")[0],
      avatarColor: "#18A6B8",
    };
    setList((prev) => [...prev, newEmp]);
    setForm({ name: "", department: "", position: "", email: "", phone: "" });
    setOpen(false);
  }

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Employees</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {list.length} total employees registered
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" data-ocid="employees.open_modal_button">
              <UserPlus className="w-4 h-4" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent
            className="sm:max-w-md"
            data-ocid="employees.add.dialog"
          >
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <div>
                <Label className="text-xs mb-1 block">Full Name *</Label>
                <Input
                  placeholder="e.g. Jane Smith"
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  data-ocid="employees.name.input"
                />
              </div>
              <div>
                <Label className="text-xs mb-1 block">Department *</Label>
                <Select
                  value={form.department}
                  onValueChange={(v) =>
                    setForm((p) => ({ ...p, department: v }))
                  }
                >
                  <SelectTrigger data-ocid="employees.department.select">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments
                      .filter((d) => d !== "All")
                      .map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs mb-1 block">Position</Label>
                <Input
                  placeholder="e.g. Software Engineer"
                  value={form.position}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, position: e.target.value }))
                  }
                  data-ocid="employees.position.input"
                />
              </div>
              <div>
                <Label className="text-xs mb-1 block">Email *</Label>
                <Input
                  type="email"
                  placeholder="jane@company.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                  data-ocid="employees.email.input"
                />
              </div>
              <div>
                <Label className="text-xs mb-1 block">Phone</Label>
                <Input
                  placeholder="+1 (555) 000-0000"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, phone: e.target.value }))
                  }
                  data-ocid="employees.phone.input"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                data-ocid="employees.cancel.button"
              >
                Cancel
              </Button>
              <Button onClick={handleAdd} data-ocid="employees.save.button">
                Add Employee
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email…"
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-ocid="employees.search_input"
          />
        </div>
        <Select value={dept} onValueChange={setDept}>
          <SelectTrigger className="w-44" data-ocid="employees.filter.select">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {departments.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Employee Grid */}
      {filtered.length === 0 ? (
        <div
          className="text-center py-16 text-muted-foreground"
          data-ocid="employees.empty_state"
        >
          <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm">No employees found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((emp, i) => (
            <Card
              key={emp.id}
              className="card-shadow hover:card-shadow-md transition-shadow"
              data-ocid={`employees.item.${i + 1}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback
                      style={{ backgroundColor: emp.avatarColor }}
                      className="text-white font-semibold"
                    >
                      {emp.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground text-sm truncate">
                        {emp.name}
                      </p>
                      <Badge
                        className={`text-[10px] px-1.5 flex-shrink-0 border-0 ${
                          emp.status === "active"
                            ? "status-present"
                            : "status-absent"
                        }`}
                      >
                        {emp.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {emp.position}
                    </p>
                    <p className="text-[10px] font-medium text-primary mt-1">
                      {emp.department}
                    </p>
                  </div>
                </div>
                <div className="mt-3 space-y-1.5 border-t border-border pt-3">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                    <span className="text-xs text-muted-foreground truncate">
                      {emp.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                    <span className="text-xs text-muted-foreground">
                      {emp.phone}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                    <span className="text-xs text-muted-foreground">
                      ID: {emp.id} · Joined {emp.joinDate}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
