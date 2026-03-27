export type Department = "CSE" | "ECE" | "EEE" | "MECH" | "CIVIL";
export type Year = "1st" | "2nd" | "3rd" | "4th";
export type AttendanceStatus = "Present" | "Absent" | "Late";
export type LeaveStatus = "Pending" | "Approved" | "Rejected";

export interface Student {
  id: string;
  fullName: string;
  rollNumber: string;
  department: Department;
  year: Year;
  email: string;
  password: string;
  photoBase64?: string;
  registeredAt: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  markedBy: "admin" | "auto";
}

export interface LeaveRequest {
  id: string;
  studentId: string;
  reason: string;
  fromDate: string;
  toDate: string;
  status: LeaveStatus;
  submittedAt: string;
  reviewedAt?: string;
}

export type AuthState =
  | { role: "none" }
  | { role: "student"; student: Student }
  | { role: "admin" };
