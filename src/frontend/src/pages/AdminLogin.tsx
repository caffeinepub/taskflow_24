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
import { ArrowLeft, Eye, EyeOff, Shield } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface AdminLoginProps {
  onBack: () => void;
}

export default function AdminLogin({ onBack }: AdminLoginProps) {
  const { loginAdmin } = useApp();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const ok = loginAdmin(username, password);
    setLoading(false);
    if (!ok) {
      setError("Invalid credentials. Please try again.");
      toast.error("Login failed");
    } else {
      toast.success("Welcome, Administrator!");
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
          data-ocid="admin_login.back.button"
        >
          <ArrowLeft size={16} className="mr-1" /> Back
        </Button>
        <span className="font-semibold">Admin Portal — Vignan Nirula</span>
      </header>

      <main className="flex-1 flex items-center justify-center p-6 bg-background page-enter">
        <Card className="w-full max-w-sm shadow-card-lg">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-16 h-16 rounded-full gold-gradient flex items-center justify-center mb-3">
              <Shield size={28} className="text-white" />
            </div>
            <CardTitle className="font-display text-xl">
              Administrator Login
            </CardTitle>
            <CardDescription>
              Enter your admin credentials to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  required
                  data-ocid="admin_login.username.input"
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
                    data-ocid="admin_login.password.input"
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
              {error && (
                <p
                  className="text-destructive text-sm"
                  data-ocid="admin_login.error_state"
                >
                  {error}
                </p>
              )}
              <Button
                type="submit"
                className="w-full gold-gradient text-white border-0 hover:opacity-90"
                disabled={loading}
                data-ocid="admin_login.submit.button"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
            <p className="text-center text-xs text-muted-foreground mt-4">
              Default: admin / vignan2024
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
