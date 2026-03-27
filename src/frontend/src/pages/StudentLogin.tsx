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
import { useApp } from "@/context/AppContext";
import {
  ArrowLeft,
  CheckCircle,
  Eye,
  EyeOff,
  GraduationCap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface StudentLoginProps {
  onBack: () => void;
  onRegister: () => void;
}

export default function StudentLogin({
  onBack,
  onRegister,
}: StudentLoginProps) {
  const { loginStudent } = useApp();
  const [roll, setRoll] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [photo, setPhoto] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");

  const handlePhotoCapture = async (base64: string) => {
    setPhoto(base64);
    setVerifying(true);
    setVerified(false);
    await new Promise((r) => setTimeout(r, 2000));
    setVerifying(false);
    setVerified(true);
    toast.success("Face verified successfully!");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!photo) {
      setError("Please capture your face photo for verification.");
      return;
    }
    if (!verified) {
      setError("Please wait for face verification to complete.");
      return;
    }
    const ok = loginStudent(roll, password);
    if (!ok) {
      setError("Invalid Roll Number or Password.");
      toast.error("Login failed");
    } else {
      toast.success("Welcome back!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="navy-gradient text-white px-4 py-4 flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/10 -ml-1"
          onClick={onBack}
          data-ocid="student_login.back.button"
        >
          <ArrowLeft size={16} className="mr-1" /> Back
        </Button>
        <span className="font-semibold">Student Portal — Vignan Nirula</span>
      </header>

      <main className="flex-1 flex items-center justify-center p-6 bg-background page-enter">
        <Card className="w-full max-w-md shadow-card-lg">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <GraduationCap size={28} className="text-primary" />
            </div>
            <CardTitle className="font-display text-xl">
              Student Login
            </CardTitle>
            <CardDescription>
              Login with your Roll Number and face verification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="roll">Roll Number</Label>
                <Input
                  id="roll"
                  value={roll}
                  onChange={(e) => setRoll(e.target.value.toUpperCase())}
                  placeholder="e.g. 22CS001"
                  required
                  data-ocid="student_login.roll.input"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    data-ocid="student_login.password.input"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Face Verification */}
              <div className="rounded-xl border border-border p-4 bg-muted/30">
                <CameraCapture
                  onCapture={handlePhotoCapture}
                  label="Face Verification"
                />
                {verifying && (
                  <div
                    className="mt-2 flex items-center gap-2 text-sm text-primary"
                    data-ocid="student_login.loading_state"
                  >
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    Verifying face...
                  </div>
                )}
                {verified && (
                  <div
                    className="mt-2 flex items-center gap-2 text-sm text-green-600"
                    data-ocid="student_login.success_state"
                  >
                    <CheckCircle size={14} /> Face verified!
                  </div>
                )}
              </div>

              {error && (
                <p
                  className="text-destructive text-sm"
                  data-ocid="student_login.error_state"
                >
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                data-ocid="student_login.submit.button"
              >
                Sign In
              </Button>
            </form>
            <p className="text-center text-sm text-muted-foreground mt-4">
              New student?{" "}
              <button
                type="button"
                className="text-primary underline"
                onClick={onRegister}
                data-ocid="student_login.register.link"
              >
                Register here
              </button>
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
