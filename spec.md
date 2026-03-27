# Vignan Nirula Attendance System

## Current State
New project — no existing files.

## Requested Changes (Diff)

### Add
- Landing page with college branding (Vignan Nirula) and two portal entry buttons: Student and Admin
- Student Portal: Registration (with face capture via camera) and Login (with face verification)
- Admin Portal: Login with username/password
- Student dashboard: profile, attendance records, leave requests
- Admin dashboard: manage students, view attendance, approve leave requests, mark attendance
- Face verification flow: capture photo during registration, verify face on login
- College details section on landing page (about, departments, contact)
- Role-based access control

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Select authorization and camera components
2. Generate backend with student/admin roles, attendance records, leave requests, face data storage
3. Build frontend: landing page, student portal (register + login with camera), admin portal (login, dashboard)
4. Wire camera component for face capture on registration and login
5. Implement role-based routing
