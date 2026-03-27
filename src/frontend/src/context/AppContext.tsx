import { createContext, useContext, useEffect, useState } from "react";
import type {
  AttendanceRecord,
  AttendanceStatus,
  AuthState,
  LeaveRequest,
  LeaveStatus,
  Student,
} from "../types";
import type { Department, Year } from "../types";

function generateId() {
  return Math.random().toString(36).slice(2);
}

function dateStr(daysAgo: number) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

const SEED_STUDENTS: Student[] = [
  {
    id: "s1",
    fullName: "Ravi Kumar",
    rollNumber: "22CS001",
    department: "CSE",
    year: "3rd",
    email: "ravi.kumar@vignan.ac.in",
    password: "ravi123",
    registeredAt: dateStr(30),
  },
  {
    id: "s2",
    fullName: "Priya Sharma",
    rollNumber: "22EC001",
    department: "ECE",
    year: "3rd",
    email: "priya.sharma@vignan.ac.in",
    password: "priya123",
    registeredAt: dateStr(28),
  },
  {
    id: "s3",
    fullName: "Arjun Reddy",
    rollNumber: "21ME001",
    department: "MECH",
    year: "4th",
    email: "arjun.reddy@vignan.ac.in",
    password: "arjun123",
    registeredAt: dateStr(25),
  },
  {
    id: "s4",
    fullName: "Sneha Patel",
    rollNumber: "23CS002",
    department: "CSE",
    year: "2nd",
    email: "sneha.patel@vignan.ac.in",
    password: "sneha123",
    registeredAt: dateStr(20),
  },
  {
    id: "s5",
    fullName: "Kiran Rao",
    rollNumber: "22EE001",
    department: "EEE",
    year: "3rd",
    email: "kiran.rao@vignan.ac.in",
    password: "kiran123",
    registeredAt: dateStr(15),
  },
];

const STATUSES: AttendanceStatus[] = [
  "Present",
  "Present",
  "Present",
  "Late",
  "Absent",
];

function seedAttendance(): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  for (const s of SEED_STUDENTS) {
    for (let i = 1; i <= 7; i++) {
      records.push({
        id: generateId(),
        studentId: s.id,
        date: dateStr(i),
        status: STATUSES[Math.floor(Math.random() * STATUSES.length)],
        markedBy: "admin",
      });
    }
  }
  return records;
}

const SEED_LEAVES: LeaveRequest[] = [
  {
    id: "l1",
    studentId: "s1",
    reason: "Family function — attending sister's wedding ceremony",
    fromDate: dateStr(-2),
    toDate: dateStr(-4),
    status: "Pending",
    submittedAt: dateStr(1),
  },
  {
    id: "l2",
    studentId: "s3",
    reason: "Medical appointment — follow-up checkup at hospital",
    fromDate: dateStr(-1),
    toDate: dateStr(-1),
    status: "Pending",
    submittedAt: dateStr(2),
  },
];

interface AppContextValue {
  auth: AuthState;
  students: Student[];
  attendance: AttendanceRecord[];
  leaveRequests: LeaveRequest[];
  loginStudent: (roll: string, password: string) => boolean;
  loginAdmin: (username: string, password: string) => boolean;
  logout: () => void;
  registerStudent: (data: Omit<Student, "id" | "registeredAt">) => void;
  markAttendance: (
    studentId: string,
    date: string,
    status: AttendanceStatus,
  ) => void;
  submitLeave: (
    studentId: string,
    reason: string,
    fromDate: string,
    toDate: string,
  ) => void;
  reviewLeave: (leaveId: string, status: LeaveStatus) => void;
  getStudentAttendance: (studentId: string) => AttendanceRecord[];
  getStudentLeaves: (studentId: string) => LeaveRequest[];
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({ role: "none" });

  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const s = localStorage.getItem("vn_students");
      return s ? JSON.parse(s) : SEED_STUDENTS;
    } catch {
      return SEED_STUDENTS;
    }
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    try {
      const a = localStorage.getItem("vn_attendance");
      return a ? JSON.parse(a) : seedAttendance();
    } catch {
      return seedAttendance();
    }
  });

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => {
    try {
      const l = localStorage.getItem("vn_leaves");
      return l ? JSON.parse(l) : SEED_LEAVES;
    } catch {
      return SEED_LEAVES;
    }
  });

  useEffect(() => {
    localStorage.setItem("vn_students", JSON.stringify(students));
  }, [students]);
  useEffect(() => {
    localStorage.setItem("vn_attendance", JSON.stringify(attendance));
  }, [attendance]);
  useEffect(() => {
    localStorage.setItem("vn_leaves", JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  const loginStudent = (roll: string, password: string) => {
    const found = students.find(
      (s) =>
        s.rollNumber.toLowerCase() === roll.toLowerCase() &&
        s.password === password,
    );
    if (found) {
      setAuth({ role: "student", student: found });
      return true;
    }
    return false;
  };

  const loginAdmin = (username: string, password: string) => {
    if (username === "admin" && password === "vignan2024") {
      setAuth({ role: "admin" });
      return true;
    }
    return false;
  };

  const logout = () => setAuth({ role: "none" });

  const registerStudent = (data: Omit<Student, "id" | "registeredAt">) => {
    const newStudent: Student = {
      ...data,
      id: generateId(),
      registeredAt: new Date().toISOString().slice(0, 10),
    };
    setStudents((prev) => [...prev, newStudent]);
    setAuth({ role: "student", student: newStudent });
  };

  const markAttendance = (
    studentId: string,
    date: string,
    status: AttendanceStatus,
  ) => {
    setAttendance((prev) => {
      const filtered = prev.filter(
        (r) => !(r.studentId === studentId && r.date === date),
      );
      return [
        ...filtered,
        { id: generateId(), studentId, date, status, markedBy: "admin" },
      ];
    });
  };

  const submitLeave = (
    studentId: string,
    reason: string,
    fromDate: string,
    toDate: string,
  ) => {
    setLeaveRequests((prev) => [
      ...prev,
      {
        id: generateId(),
        studentId,
        reason,
        fromDate,
        toDate,
        status: "Pending",
        submittedAt: new Date().toISOString().slice(0, 10),
      },
    ]);
  };

  const reviewLeave = (leaveId: string, status: LeaveStatus) => {
    setLeaveRequests((prev) =>
      prev.map((l) =>
        l.id === leaveId
          ? { ...l, status, reviewedAt: new Date().toISOString().slice(0, 10) }
          : l,
      ),
    );
  };

  const getStudentAttendance = (studentId: string) =>
    attendance
      .filter((r) => r.studentId === studentId)
      .sort((a, b) => b.date.localeCompare(a.date));

  const getStudentLeaves = (studentId: string) =>
    leaveRequests
      .filter((r) => r.studentId === studentId)
      .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));

  return (
    <AppContext.Provider
      value={{
        auth,
        students,
        attendance,
        leaveRequests,
        loginStudent,
        loginAdmin,
        logout,
        registerStudent,
        markAttendance,
        submitLeave,
        reviewLeave,
        getStudentAttendance,
        getStudentLeaves,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

// Suppress unused import warning — these are re-exported for use by other modules
export type { Department, Year };
