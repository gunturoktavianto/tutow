"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { Eye, EyeOff, Star, BookOpen, Trophy, CheckCircle } from "lucide-react";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    school: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nama lengkap harus diisi";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email harus diisi";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username harus diisi";
    } else if (!/^[a-zA-Z]+$/.test(formData.username)) {
      newErrors.username = "Username hanya boleh menggunakan huruf";
    }

    if (!formData.password) {
      newErrors.password = "Password harus diisi";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password minimal 6 karakter";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Password tidak sama";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          username: formData.username,
          password: formData.password,
          school: formData.school || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/login?message=Akun berhasil dibuat. Silakan login.");
      } else {
        setErrors({ general: data.error || "Terjadi kesalahan" });
      }
    } catch (error) {
      setErrors({ general: "Terjadi kesalahan pada server" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 text-yellow-400 animate-bounce">
        <Star className="w-8 h-8" />
      </div>
      <div className="absolute top-32 right-16 text-blue-400 animate-pulse">
        <BookOpen className="w-10 h-10" />
      </div>
      <div className="absolute bottom-20 left-20 text-purple-400 animate-bounce delay-1000">
        <Trophy className="w-8 h-8" />
      </div>

      <div className="w-full max-w-md">
        {/* Logo */}
        <img src="/logo.png" alt="Tutow Logo" className="mx-auto mb-6 h-24" />
        <Card className="border-2 border-blue-100 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-gray-900">
              Buat Akun Baru
            </CardTitle>
            <CardDescription>
              Bergabunglah dengan ribuan anak pintar lainnya
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.general && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                  {errors.general}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Masukkan nama lengkap"
                  disabled={isLoading}
                  className={`border-2 ${
                    errors.name
                      ? "border-red-300 focus:border-red-400"
                      : "border-gray-200 focus:border-blue-400"
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="nama@email.com"
                  disabled={isLoading}
                  className={`border-2 ${
                    errors.email
                      ? "border-red-300 focus:border-red-400"
                      : "border-gray-200 focus:border-blue-400"
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="username (hanya huruf)"
                  disabled={isLoading}
                  className={`border-2 ${
                    errors.username
                      ? "border-red-300 focus:border-red-400"
                      : "border-gray-200 focus:border-blue-400"
                  }`}
                />
                {errors.username && (
                  <p className="text-red-500 text-xs">{errors.username}</p>
                )}
                <p className="text-xs text-gray-500">
                  Username hanya boleh menggunakan huruf (a-z)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="school">Sekolah (Opsional)</Label>
                <Input
                  id="school"
                  name="school"
                  type="text"
                  value={formData.school}
                  onChange={handleInputChange}
                  placeholder="Nama sekolah"
                  disabled={isLoading}
                  className="border-2 border-gray-200 focus:border-blue-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Minimal 6 karakter"
                    disabled={isLoading}
                    className={`border-2 pr-10 ${
                      errors.password
                        ? "border-red-300 focus:border-red-400"
                        : "border-gray-200 focus:border-blue-400"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Ketik ulang password"
                    disabled={isLoading}
                    className={`border-2 pr-10 ${
                      errors.confirmPassword
                        ? "border-red-300 focus:border-red-400"
                        : "border-gray-200 focus:border-blue-400"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Memproses..." : "Daftar Sekarang"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Sudah punya akun?{" "}
                <Link
                  href="/login"
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Masuk di sini
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <div className="mt-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-blue-100">
            <p className="text-sm font-semibold text-gray-700 mb-3">
              🎉 Yang akan kamu dapatkan:
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-xs text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Akses ke semua materi pembelajaran</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Sistem gamifikasi dengan XP dan Gold</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Kebun virtual untuk menumbuhkan tanaman</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Badge dan achievement system</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
