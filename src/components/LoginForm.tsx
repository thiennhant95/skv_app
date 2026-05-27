"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, LogIn, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/authStore";
import { loginApi } from "@/services/loginService";
import { registerDeviceToken } from "@/services/deviceTokenService";
import { initFcmOnLogin } from "@/services/fcmService";
import { toast } from "@/components/ui/toast";

const USERNAME_REGEX = /^[a-zA-Z0-9._-]{3,50}$/;

export default function LoginForm() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validate = useCallback((): string | null => {
    const trimmedUser = username.trim();
    if (!trimmedUser) return "Vui lòng nhập tên đăng nhập";
    if (!USERNAME_REGEX.test(trimmedUser)) {
      return "Tên đăng nhập chỉ gồm chữ, số, dấu chấm, gạch ngang (3-50 ký tự)";
    }
    if (!password) return "Vui lòng nhập mật khẩu";
    return null;
  }, [username, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const data = await loginApi(username.trim(), password);
      login(data.token, data.user);
      registerDeviceToken();
      initFcmOnLogin();
      toast("Đăng nhập thành công!", "success");
      router.replace("/home");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Đăng nhập thất bại";
      setError(message);
      toast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex min-h-dvh flex-col justify-center px-6"
    >
      <div className="mb-10 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 shadow-lg shadow-amber-200/50"
        >
          <span className="text-2xl font-bold tracking-wider text-white">
            SKV
          </span>
        </motion.div>
        <h1 className="text-2xl font-bold text-gray-900">Đăng nhập</h1>
        <p className="mt-1.5 text-sm text-gray-500">
          Hệ sinh thái cộng tác viên SKV
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="login-username" className="text-sm font-medium text-gray-700">
            Tên đăng nhập
          </label>
          <Input
            id="login-username"
            type="text"
            placeholder="Nhập tên đăng nhập"
            value={username}
            onChange={(e) => { setUsername(e.target.value); if (error) setError(""); }}
            disabled={loading}
            autoComplete="username"
            autoCapitalize="none"
            aria-invalid={!!error}
            className="h-12 rounded-xl border-gray-200 bg-gray-50/50 text-base focus:bg-white"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="login-password" className="text-sm font-medium text-gray-700">
            Mật khẩu
          </label>
          <div className="relative">
            <Input
              id="login-password"
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => { setPassword(e.target.value); if (error) setError(""); }}
              disabled={loading}
              autoComplete="current-password"
              aria-invalid={!!error}
              className="h-12 rounded-xl border-gray-200 bg-gray-50/50 pr-12 text-base focus:bg-white"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              tabIndex={-1}
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            role="alert"
            className="flex items-center gap-1.5 text-sm text-red-500"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </motion.p>
        )}

        <Button type="submit" disabled={loading} className="mt-2 w-full" size="lg">
          {loading ? (
            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Đang đăng nhập...</>
          ) : (
            <><LogIn className="mr-2 h-5 w-5" /> Đăng nhập</>
          )}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-gray-400">
        Quên mật khẩu? Liên hệ quản trị viên
      </p>
    </motion.div>
  );
}
