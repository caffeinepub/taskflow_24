import CameraCapture from "@/components/CameraCapture";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApp } from "@/context/AppContext";
import type { Department, Year } from "@/types";
import { ArrowLeft, CheckCircle, GraduationCap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface StudentRegisterProps {
  onBack: () => void;
  onLogin: () => void;
}

export default function StudentRegister({
  onBack,
  onLogin,
}: StudentRegisterProps) {
  const { registerStudent } = useApp();
  const [form, setForm] = useState({
    fullName: "",
    rollNumber: "",
    department: "" as Department | "",
    year: "" as Year | "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [photo, setPhoto] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePhotoCapture = async (base64: string) => {
    setPhoto(base64);
    setVerifying(true);
    setVerified(false);
    await new Promise((r) => setTimeout(r, 2000));
    setVerifying(false);
    setVerified(true);
    toast.success("Face captured successfully!");
  };

  const set = (k: keyof typeof form, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!photo || !verified) {
      setError("Please capture your face photo for registration.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!form.department || !form.year) {
      setError("Please select your department and year.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    registerStudent({
      fullName: form.fullName,
      rollNumber: form.rollNumber.toUpperCase(),
      department: form.department as Department,
      year: form.year as Year,
      email: form.email,
      password: form.password,
      photoBase64: photo,
    });
    setLoading(false);
    toast.success("Registration successful! Welcome to Vignan Nirula.");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="navy-gradient text-white px-4 py-4 flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/10 -ml-1"
          onClick={onBack}
          data-ocid="student_register.back.button"
        >
          <ArrowLeft size={16} className="mr-1" /> Back
        </Button>
        <span className="font-semibold">
          Student Registration — Vignan Nirula
        </span>
      </header>

      <main className="flex-1 flex items-center justify-center p-6 bg-background page-enter">
        <Card className="w-full max-w-lg shadow-card-lg">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <GraduationCap size={28} className="text-primary" />
            </div>
            <CardTitle className="font-display text-xl">
              New Student Registration
            </CardTitle>
            <CardDescription>
              Create your account with face verification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 space-y-1">
                  <Label>Full Name</Label>
                  <Input
                    value={form.fullName}
                    onChange={(e) => set("fullName", e.target.value)}
                    placeholder="e.g. Ravi Kumar"
                    required
                    data-ocid="student_register.name.input"
                  />
                </div>
                <div className="space-y-1">
                  <Label>Roll Number</Label>
                  <Input
                    value={form.rollNumber}
                    onChange={(e) => set("rollNumber", e.target.value)}
                    placeholder="e.g. 22CS001"
                    required
                    data-ocid="student_register.roll.input"
                  />
                </div>
                <div className="space-y-1">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="name@vignan.ac.in"
                    required
                    data-ocid="student_register.email.input"
                  />
                </div>
                <div className="space-y-1">
                  <Label>Department</Label>
                  <Select
                    value={form.department}
                    onValueChange={(v) => set("department", v)}
                  >
                    <SelectTrigger data-ocid="student_register.department.select">
                      <SelectValue placeholder="Select dept." />
                    </SelectTrigger>
                    <SelectContent>
                      {(
                        ["CSE", "ECE", "EEE", "MECH", "CIVIL"] as Department[]
                      ).map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Year</Label>
                  <Select
                    value={form.year}
                    onValueChange={(v) => set("year", v)}
                  >
                    <SelectTrigger data-ocid="student_register.year.select">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {(["1st", "2nd", "3rd", "4th"] as Year[]).map((y) => (
                        <SelectItem key={y} value={y}>
                          {y} Year
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Password</Label>
                  <Input
                    type="password"
                    value={form.password}
                    onChange={(e) => set("password", e.target.value)}
                    placeholder="Min 6 characters"
                    required
                    minLength={6}
                    data-ocid="student_register.password.input"
                  />
                </div>
                <div className="space-y-1">
                  <Label>Confirm Password</Label>
                  <Input
                    type="password"
                    value={form.confirmPassword}
                    onChange={(e) => set("confirmPassword", e.target.value)}
                    placeholder="Repeat password"
                    required
                    data-ocid="student_register.confirm_password.input"
                  />
                </div>
              </div>

              {/* Face Capture */}
              <div className="rounded-xl border border-border p-4 bg-muted/30">
                <CameraCapture
                  onCapture={handlePhotoCapture}
                  label="Capture Face Photo for Registration"
                />
                {verifying && (
                  <div
                    className="mt-2 flex items-center gap-2 text-sm text-primary"
                    data-ocid="student_register.loading_state"
                  >
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    Processing face...
                  </div>
                )}
                {verified && (
                  <div
                    className="mt-2 flex items-center gap-2 text-sm text-green-600"
                    data-ocid="student_register.success_state"
                  >
                    <CheckCircle size={14} /> Face captured and ready!
                  </div>
                )}
              </div>

              {error && (
                <p
                  className="text-destructive text-sm"
                  data-ocid="student_register.error_state"
                >
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={loading}
                data-ocid="student_register.submit.button"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                    Registering...
                  </>
                ) : (
                  "Complete Registration"
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Already registered?{" "}
                <button
                  type="button"
                  className="text-primary underline"
                  onClick={onLogin}
                  data-ocid="student_register.login.link"
                >
                  Login here
                </button>
              </p>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
