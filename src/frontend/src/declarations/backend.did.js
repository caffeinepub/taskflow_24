// @ts-nocheck
export const idlFactory = ({ IDL }) => {
  const AttendanceStatus = IDL.Variant({ present: IDL.Null, absent: IDL.Null, late: IDL.Null });
  const LeaveStatus = IDL.Variant({ pending: IDL.Null, approved: IDL.Null, rejected: IDL.Null });
  const Student = IDL.Record({
    id: IDL.Nat,
    name: IDL.Text,
    rollNumber: IDL.Text,
    department: IDL.Text,
    year: IDL.Nat,
    registeredAt: IDL.Int,
  });
  const AttendanceRecord = IDL.Record({
    id: IDL.Nat,
    studentId: IDL.Nat,
    date: IDL.Text,
    time: IDL.Text,
    status: AttendanceStatus,
  });
  const LeaveRequest = IDL.Record({
    id: IDL.Nat,
    studentId: IDL.Nat,
    fromDate: IDL.Text,
    toDate: IDL.Text,
    reason: IDL.Text,
    status: LeaveStatus,
    adminNote: IDL.Text,
  });
  return IDL.Service({
    registerStudent: IDL.Func([IDL.Text, IDL.Text, IDL.Text, IDL.Nat], [IDL.Nat], []),
    removeStudent: IDL.Func([IDL.Nat], [], []),
    getAllStudents: IDL.Func([], [IDL.Vec(Student)], ['query']),
    getStudent: IDL.Func([IDL.Nat], [IDL.Opt(Student)], ['query']),
    findStudentByRoll: IDL.Func([IDL.Text], [IDL.Opt(Student)], ['query']),
    markAttendance: IDL.Func([IDL.Nat, IDL.Text, IDL.Text, AttendanceStatus], [IDL.Nat], []),
    getStudentAttendance: IDL.Func([IDL.Nat], [IDL.Vec(AttendanceRecord)], ['query']),
    getAttendanceByDate: IDL.Func([IDL.Text], [IDL.Vec(AttendanceRecord)], ['query']),
    getAllAttendance: IDL.Func([], [IDL.Vec(AttendanceRecord)], ['query']),
    submitLeaveRequest: IDL.Func([IDL.Nat, IDL.Text, IDL.Text, IDL.Text], [IDL.Nat], []),
    updateLeaveStatus: IDL.Func([IDL.Nat, LeaveStatus, IDL.Text], [], []),
    getAllLeaveRequests: IDL.Func([], [IDL.Vec(LeaveRequest)], ['query']),
    getStudentLeaveRequests: IDL.Func([IDL.Nat], [IDL.Vec(LeaveRequest)], ['query']),
  });
};
export const init = ({ IDL }) => [];
