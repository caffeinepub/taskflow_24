import Map "mo:core/Map";
import Time "mo:core/Time";

actor {

  // ── Migration stubs: preserve old stable variables so they can be discarded ──
  type OldTaskPriority = { #High; #Medium; #Low };
  type OldTaskCategory = { #Work; #Personal; #Other };
  type OldTask = {
    id : Nat;
    title : Text;
    priority : OldTaskPriority;
    category : OldTaskCategory;
    dueDate : ?Int;
    completed : Bool;
    createdAt : Int;
  };
  type OldProductCategory = { #Cleanser; #Toner; #Serum; #Moisturizer; #SPF; #Other };
  type OldProduct = { id : Nat; name : Text; brand : Text; category : OldProductCategory; notes : Text };
  type OldRoutineStep = { productId : Nat; instructions : Text; order : Nat };
  type OldJournalEntry = { id : Nat; date : Text; skinCondition : Nat; notes : Text; concerns : Text; createdAt : Int };
  type OldSkinType = { #All; #Oily; #Dry; #Combination; #Sensitive };
  type OldTip = { id : Nat; title : Text; content : Text; skinType : OldSkinType };

  stable var nextTaskId : Nat = 0;
  stable var tasks : Map.Map<Nat, OldTask> = Map.empty<Nat, OldTask>();
  stable var nextProductId : Nat = 0;
  stable var nextJournalId : Nat = 0;
  stable var products : Map.Map<Nat, OldProduct> = Map.empty<Nat, OldProduct>();
  stable var journalEntries : Map.Map<Nat, OldJournalEntry> = Map.empty<Nat, OldJournalEntry>();
  stable var morningRoutine : [OldRoutineStep] = [];
  stable var eveningRoutine : [OldRoutineStep] = [];
  stable var tips : [OldTip] = [];

  // ── Attendance system types ──
  type AttendanceStatus = { #present; #absent; #late };
  type LeaveStatus = { #pending; #approved; #rejected };

  type Student = {
    id : Nat;
    name : Text;
    rollNumber : Text;
    department : Text;
    year : Nat;
    registeredAt : Int;
  };

  type AttendanceRecord = {
    id : Nat;
    studentId : Nat;
    date : Text;
    time : Text;
    status : AttendanceStatus;
  };

  type LeaveRequest = {
    id : Nat;
    studentId : Nat;
    fromDate : Text;
    toDate : Text;
    reason : Text;
    status : LeaveStatus;
    adminNote : Text;
  };

  stable var nextStudentId : Nat = 0;
  stable var nextAttendanceId : Nat = 0;
  stable var nextLeaveId : Nat = 0;

  stable var students : Map.Map<Nat, Student> = Map.empty<Nat, Student>();
  stable var attendanceRecords : Map.Map<Nat, AttendanceRecord> = Map.empty<Nat, AttendanceRecord>();
  stable var leaveRequests : Map.Map<Nat, LeaveRequest> = Map.empty<Nat, LeaveRequest>();

  // Student management
  public shared func registerStudent(name : Text, rollNumber : Text, department : Text, year : Nat) : async Nat {
    let id = nextStudentId;
    nextStudentId += 1;
    students.add(id, { id; name; rollNumber; department; year; registeredAt = Time.now() });
    id;
  };

  public shared func removeStudent(id : Nat) : async () {
    students.remove(id);
  };

  public query func getAllStudents() : async [Student] {
    students.values().toArray();
  };

  public query func getStudent(id : Nat) : async ?Student {
    students.get(id);
  };

  public query func findStudentByRoll(rollNumber : Text) : async ?Student {
    for (s in students.values()) {
      if (s.rollNumber == rollNumber) return ?s;
    };
    null;
  };

  // Attendance
  public shared func markAttendance(studentId : Nat, date : Text, time : Text, status : AttendanceStatus) : async Nat {
    let id = nextAttendanceId;
    nextAttendanceId += 1;
    attendanceRecords.add(id, { id; studentId; date; time; status });
    id;
  };

  public query func getStudentAttendance(studentId : Nat) : async [AttendanceRecord] {
    let result = Map.empty<Nat, AttendanceRecord>();
    for (r in attendanceRecords.values()) {
      if (r.studentId == studentId) result.add(r.id, r);
    };
    result.values().toArray();
  };

  public query func getAttendanceByDate(date : Text) : async [AttendanceRecord] {
    let result = Map.empty<Nat, AttendanceRecord>();
    for (r in attendanceRecords.values()) {
      if (r.date == date) result.add(r.id, r);
    };
    result.values().toArray();
  };

  public query func getAllAttendance() : async [AttendanceRecord] {
    attendanceRecords.values().toArray();
  };

  // Leave requests
  public shared func submitLeaveRequest(studentId : Nat, fromDate : Text, toDate : Text, reason : Text) : async Nat {
    let id = nextLeaveId;
    nextLeaveId += 1;
    leaveRequests.add(id, { id; studentId; fromDate; toDate; reason; status = #pending; adminNote = "" });
    id;
  };

  public shared func updateLeaveStatus(id : Nat, status : LeaveStatus, adminNote : Text) : async () {
    switch (leaveRequests.get(id)) {
      case (null) {};
      case (?req) { leaveRequests.add(id, { req with status; adminNote }) };
    };
  };

  public query func getAllLeaveRequests() : async [LeaveRequest] {
    leaveRequests.values().toArray();
  };

  public query func getStudentLeaveRequests(studentId : Nat) : async [LeaveRequest] {
    let result = Map.empty<Nat, LeaveRequest>();
    for (r in leaveRequests.values()) {
      if (r.studentId == studentId) result.add(r.id, r);
    };
    result.values().toArray();
  };
};
