import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Award,
  BookOpen,
  ChevronRight,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Shield,
  Users,
} from "lucide-react";
import { motion } from "motion/react";

interface LandingProps {
  onStudentLogin: () => void;
  onAdminLogin: () => void;
  onStudentRegister: () => void;
}

const departments = [
  {
    code: "CSE",
    name: "Computer Science & Engineering",
    icon: "💻",
    students: 320,
  },
  {
    code: "ECE",
    name: "Electronics & Communication",
    icon: "📡",
    students: 280,
  },
  { code: "EEE", name: "Electrical & Electronics", icon: "⚡", students: 240 },
  { code: "MECH", name: "Mechanical Engineering", icon: "⚙️", students: 260 },
  { code: "CIVIL", name: "Civil Engineering", icon: "🏗️", students: 200 },
];

export default function Landing({
  onStudentLogin,
  onAdminLogin,
  onStudentRegister,
}: LandingProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="navy-gradient text-white shadow-card-lg">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <img
            src="/assets/generated/vignan-logo-transparent.dim_200x200.png"
            alt="Vignan Nirula"
            className="h-16 w-16 rounded-full border-2 border-white/30 object-cover"
          />
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">
              Vignan Nirula
            </h1>
            <p className="text-white/75 text-sm">
              Institute of Technology & Science
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge className="bg-white/20 text-white text-xs border-0 hover:bg-white/30">
                NAAC Accredited
              </Badge>
              <Badge className="bg-white/20 text-white text-xs border-0 hover:bg-white/30">
                Academic Year 2025–26
              </Badge>
            </div>
          </div>
          <div className="ml-auto">
            <Button
              variant="outline"
              size="sm"
              className="border-white/40 text-white hover:bg-white/10 bg-transparent"
              onClick={onAdminLogin}
              data-ocid="nav.admin_login.button"
            >
              <Shield size={14} className="mr-1" />
              Admin
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section
        className="relative bg-cover bg-center py-20"
        style={{
          backgroundImage:
            "url('/assets/generated/campus-hero.dim_1200x600.jpg')",
        }}
      >
        <div className="absolute inset-0 navy-gradient opacity-80" />
        <div className="relative container mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">
              AI-Powered Attendance System
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Smart Attendance
              <br />
              for Smart Learners
            </h2>
            <p className="text-white/80 max-w-xl mx-auto text-lg mb-10">
              Seamless face-verification based attendance tracking for Vignan
              Nirula students and faculty.
            </p>
          </motion.div>

          {/* Portal Cards */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-2xl p-8 w-72 shadow-card-lg portal-card-hover text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <GraduationCap size={24} className="text-primary" />
              </div>
              <h3 className="text-foreground font-display font-bold text-xl mb-2">
                Student Portal
              </h3>
              <p className="text-muted-foreground text-sm mb-6">
                Login or register with face verification to track your
                attendance.
              </p>
              <div className="flex flex-col gap-2">
                <Button
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={onStudentLogin}
                  data-ocid="landing.student_login.button"
                >
                  Student Login <ChevronRight size={14} className="ml-1" />
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={onStudentRegister}
                  data-ocid="landing.student_register.button"
                >
                  New Registration
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-2xl p-8 w-72 shadow-card-lg portal-card-hover text-left"
            >
              <div className="w-12 h-12 rounded-xl gold-gradient flex items-center justify-center mb-4">
                <Shield size={24} className="text-white" />
              </div>
              <h3 className="text-foreground font-display font-bold text-xl mb-2">
                Admin Portal
              </h3>
              <p className="text-muted-foreground text-sm mb-6">
                Manage students, mark attendance, and review leave requests.
              </p>
              <Button
                className="w-full gold-gradient text-white border-0 hover:opacity-90"
                onClick={onAdminLogin}
                data-ocid="landing.admin_login.button"
              >
                Admin Login <ChevronRight size={14} className="ml-1" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="bg-white border-b border-border">
        <div className="container mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { label: "Students Enrolled", value: "1,300+", icon: Users },
            { label: "Departments", value: "5", icon: BookOpen },
            { label: "Years Active", value: "15+", icon: Award },
            { label: "Daily Attendance", value: "98%", icon: GraduationCap },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1">
              <s.icon size={20} className="text-primary" />
              <p className="text-2xl font-bold text-primary">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Departments */}
      <section className="py-14 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-1">
              Academic Departments
            </p>
            <h3 className="font-display text-3xl font-bold text-foreground">
              Programmes Offered
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {departments.map((d, i) => (
              <motion.div
                key={d.code}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-card rounded-xl p-5 border border-border shadow-card text-center hover:border-primary/30 transition-colors"
              >
                <div className="text-3xl mb-3">{d.icon}</div>
                <Badge className="bg-primary/10 text-primary border-0 mb-2">
                  {d.code}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">{d.name}</p>
                <p className="text-sm font-semibold text-foreground mt-2">
                  {d.students} students
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About + Contact */}
      <section className="py-14 bg-white border-t border-border">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12">
          <div>
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-2">
              About Us
            </p>
            <h3 className="font-display text-2xl font-bold mb-4">
              Vignan Nirula Institute of Technology & Science
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Established in 2009, Vignan Nirula Institute of Technology &
              Science is a premier engineering college affiliated to JNTU
              Kakinada, approved by AICTE. Located in Guntur district, Andhra
              Pradesh, the institution offers world-class education with
              state-of-the-art facilities.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our AI-powered attendance system ensures accurate, real-time
              tracking of student presence using facial recognition technology,
              reducing manual errors and saving valuable time.
            </p>
          </div>
          <div>
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-2">
              Contact
            </p>
            <h3 className="font-display text-2xl font-bold mb-4">
              Get In Touch
            </h3>
            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <MapPin
                  size={18}
                  className="text-accent mt-0.5 shrink-0"
                  style={{ color: "oklch(0.78 0.15 75)" }}
                />
                <p className="text-muted-foreground text-sm">
                  Vignan Nirula Institute, Pedapalakaluru, Guntur District,
                  Andhra Pradesh – 522009
                </p>
              </div>
              <div className="flex gap-3 items-center">
                <Phone
                  size={18}
                  style={{ color: "oklch(0.78 0.15 75)" }}
                  className="shrink-0"
                />
                <p className="text-muted-foreground text-sm">+91 86399 12345</p>
              </div>
              <div className="flex gap-3 items-center">
                <Mail
                  size={18}
                  style={{ color: "oklch(0.78 0.15 75)" }}
                  className="shrink-0"
                />
                <p className="text-muted-foreground text-sm">
                  info@vignan-nirula.ac.in
                </p>
              </div>
              <div className="flex gap-3 items-center">
                <BookOpen
                  size={18}
                  style={{ color: "oklch(0.78 0.15 75)" }}
                  className="shrink-0"
                />
                <p className="text-muted-foreground text-sm">
                  Academic Year: 2025–26
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="navy-gradient text-white py-6">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-white/70">
          <p>
            © {new Date().getFullYear()} Vignan Nirula Institute of Technology &
            Science. All rights reserved.
          </p>
          <p>
            Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-white/90 hover:text-white"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
