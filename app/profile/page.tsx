"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  User,
  School,
  Mail,
  Star,
  Coins,
  Trophy,
  BookOpen,
  Edit,
  Save,
  X,
  Award,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userData, setUserData] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    school: "",
    currentGrade: "",
  });

  useEffect(() => {
    if (session?.user && !userData) {
      setUserData(session.user);
    }
  }, [session, userData]);

  useEffect(() => {
    const currentUser = userData || session?.user;
    if (currentUser && !isEditing) {
      setFormData({
        name: currentUser.name || "",
        school: currentUser.school || "",
        currentGrade: currentUser.currentGrade?.toString() || "",
      });
    }
  }, [userData, session, isEditing]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          school: formData.school.trim() || undefined,
          currentGrade: formData.currentGrade
            ? parseInt(formData.currentGrade)
            : null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update local userData with the fresh data from backend
        const updatedUserData = {
          ...userData,
          ...data.user,
        };
        setUserData(updatedUserData);

        // Update local formData with the fresh data from backend
        const updatedFormData = {
          name: data.user.name || "",
          school: data.user.school || "",
          currentGrade: data.user.currentGrade?.toString() || "",
        };
        setFormData(updatedFormData);

        // Update session data and wait for it to complete
        try {
          await update({
            name: data.user.name,
            school: data.user.school,
            currentGrade: data.user.currentGrade,
          });
        } catch (sessionError) {
          console.warn("Session update failed:", sessionError);
        }

        setIsEditing(false);
        setSuccess("Profil berhasil diperbarui!");

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.error || "Terjadi kesalahan");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      setError("Terjadi kesalahan pada server");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data
    const currentUser = userData || session?.user;
    if (currentUser) {
      setFormData({
        name: currentUser.name || "",
        school: currentUser.school || "",
        currentGrade: currentUser.currentGrade?.toString() || "",
      });
    }
    setIsEditing(false);
    setError("");
    setSuccess("");
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const user = userData || session.user;

  // Mock achievements data
  const achievements = [
    {
      name: "Penjumlahan Master",
      icon: "🏆",
      description: "Menyelesaikan semua materi penjumlahan",
      earnedAt: "2 hari lalu",
    },
    {
      name: "Rajin Belajar",
      icon: "⭐",
      description: "Belajar 7 hari berturut-turut",
      earnedAt: "1 minggu lalu",
    },
    {
      name: "Explorer",
      icon: "🎯",
      description: "Mencoba semua fitur aplikasi",
      earnedAt: "2 minggu lalu",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            👤 Profil Saya
          </h1>
          <p className="text-gray-600">
            Kelola informasi profil dan lihat pencapaian belajar kamu
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Informasi Profil</span>
                  </CardTitle>
                  {!isEditing ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancel}
                        disabled={isLoading}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Batal
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSave}
                        disabled={isLoading}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {isLoading ? "Menyimpan..." : "Simpan"}
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Success/Error Messages */}
                {success && (
                  <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">{success}</span>
                  </div>
                )}

                {error && (
                  <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                {/* Avatar */}
                <div className="flex items-center space-x-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={user.image || ""} alt={user.name || ""} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl">
                      {user.name
                        ?.split(" ")
                        .map((n: string) => n[0])
                        .join("") || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {user.name}
                    </h3>
                    <p className="text-gray-600">@{user.username}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-800"
                      >
                        <Star className="w-3 h-3 mr-1" />
                        {user.xp || 0} XP
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="bg-yellow-100 text-yellow-800"
                      >
                        <Coins className="w-3 h-3 mr-1" />
                        {user.gold || 0} Gold
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Lengkap</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Masukkan nama lengkap"
                        disabled={isLoading}
                      />
                    ) : (
                      <p className="px-3 py-2 bg-gray-50 rounded-md">
                        {user.name || "-"}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <p className="px-3 py-2 bg-gray-50 rounded-md">
                      @{user.username || "-"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <p className="px-3 py-2 bg-gray-50 rounded-md flex-1">
                        {user.email}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500">
                      Email tidak dapat diubah
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currentGrade">Kelas Saat Ini</Label>
                    {isEditing ? (
                      <select
                        id="currentGrade"
                        name="currentGrade"
                        value={formData.currentGrade}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Pilih Kelas</option>
                        <option value="1">Kelas 1</option>
                        <option value="2">Kelas 2</option>
                        <option value="3">Kelas 3</option>
                        <option value="4">Kelas 4</option>
                        <option value="5">Kelas 5</option>
                        <option value="6">Kelas 6</option>
                      </select>
                    ) : (
                      <p className="px-3 py-2 bg-gray-50 rounded-md">
                        {user.currentGrade
                          ? `Kelas ${user.currentGrade}`
                          : "Belum dipilih"}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="school">Sekolah</Label>
                    {isEditing ? (
                      <Input
                        id="school"
                        name="school"
                        value={formData.school}
                        onChange={handleInputChange}
                        placeholder="Nama sekolah (opsional)"
                        disabled={isLoading}
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <School className="w-4 h-4 text-gray-400" />
                        <p className="px-3 py-2 bg-gray-50 rounded-md flex-1">
                          {user.school || "Belum diisi"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                  <span>Statistik Belajar</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total XP</span>
                  <span className="font-bold text-blue-600">
                    {user.xp || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Gold Coins</span>
                  <span className="font-bold text-yellow-600">
                    {user.gold || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Pelajaran Selesai
                  </span>
                  <span className="font-bold text-green-600">23</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Latihan Diselesaikan
                  </span>
                  <span className="font-bold text-purple-600">45</span>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-purple-600" />
                  <span>Pencapaian Terbaru</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{achievement.name}</p>
                      <p className="text-xs text-gray-600">
                        {achievement.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {achievement.earnedAt}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Aksi Cepat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push("/learning")}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Mulai Belajar
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push("/exercise")}
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  Latihan Soal
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
