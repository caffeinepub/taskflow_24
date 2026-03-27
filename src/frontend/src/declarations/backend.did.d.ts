/* eslint-disable */
// @ts-nocheck
import type { ActorMethod } from '@icp-sdk/core/agent';
import type { IDL } from '@icp-sdk/core/candid';

export type AttendanceStatus = { 'present': null } | { 'absent': null } | { 'late': null };
export type LeaveStatus = { 'pending': null } | { 'approved': null } | { 'rejected': null };

export interface Student {
  id: bigint;
  name: string;
  rollNumber: string;
  department: string;
  year: bigint;
  registeredAt: bigint;
}

export interface AttendanceRecord {
  id: bigint;
  studentId: bigint;
  date: string;
  time: string;
  status: AttendanceStatus;
}

export interface LeaveRequest {
  id: bigint;
  studentId: bigint;
  fromDate: string;
  toDate: string;
  reason: string;
  status: LeaveStatus;
  adminNote: string;
}

export interface _SERVICE {
  registerStudent: ActorMethod<[string, string, string, bigint], bigint>;
  removeStudent: ActorMethod<[bigint], undefined>;
  getAllStudents: ActorMethod<[], Array<Student>>;
  getStudent: ActorMethod<[bigint], [] | [Student]>;
  findStudentByRoll: ActorMethod<[string], [] | [Student]>;
  markAttendance: ActorMethod<[bigint, string, string, AttendanceStatus], bigint>;
  getStudentAttendance: ActorMethod<[bigint], Array<AttendanceRecord>>;
  getAttendanceByDate: ActorMethod<[string], Array<AttendanceRecord>>;
  getAllAttendance: ActorMethod<[], Array<AttendanceRecord>>;
  submitLeaveRequest: ActorMethod<[bigint, string, string, string], bigint>;
  updateLeaveStatus: ActorMethod<[bigint, LeaveStatus, string], undefined>;
  getAllLeaveRequests: ActorMethod<[], Array<LeaveRequest>>;
  getStudentLeaveRequests: ActorMethod<[bigint], Array<LeaveRequest>>;
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
