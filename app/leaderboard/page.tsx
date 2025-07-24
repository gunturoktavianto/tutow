"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Trophy, Medal, Award, Crown } from "lucide-react";

interface LeaderboardUser {
  id: string;
  username: string;
  name: string;
  xp: number;
  school: string | null;
  rank: number;
}

interface LeaderboardData {
  leaderboard: LeaderboardUser[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export default function LeaderboardPage() {
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchLeaderboard = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/leaderboard?page=${page}&limit=10`);
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard(currentPage);
  }, [currentPage]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Trophy className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Medal className="h-6 w-6 text-amber-600" />;
      default:
        return <Award className="h-6 w-6 text-blue-500" />;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white";
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-500 text-white";
      case 3:
        return "bg-gradient-to-r from-amber-400 to-amber-600 text-white";
      default:
        return "bg-gradient-to-r from-blue-400 to-blue-600 text-white";
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= (data?.pagination.totalPages || 1)) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          🏆 Leaderboard
        </h1>
        <p className="text-gray-600">
          Lihat peringkat siswa terbaik berdasarkan Experience Points (XP)
        </p>
      </div>

      {data && (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Peringkat Siswa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.leaderboard.map((user) => (
                  <div
                    key={user.id}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      user.rank <= 3
                        ? "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getRankIcon(user.rank)}
                        <Badge className={getRankBadgeColor(user.rank)}>
                          #{user.rank}
                        </Badge>
                      </div>

                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-blue-500 text-white font-semibold">
                          {user.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {user.name || "User"}
                        </h3>
                        <p className="text-sm text-gray-600">
                          @{user.username}
                        </p>
                        {user.school && (
                          <p className="text-xs text-gray-500">{user.school}</p>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-blue-600">
                          {user.xp.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500">XP</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (data.pagination.hasPrevPage) {
                        handlePageChange(currentPage - 1);
                      }
                    }}
                    className={
                      !data.pagination.hasPrevPage
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>

                {Array.from(
                  { length: data.pagination.totalPages },
                  (_, i) => i + 1
                ).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(page);
                      }}
                      isActive={page === currentPage}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (data.pagination.hasNextPage) {
                        handlePageChange(currentPage + 1);
                      }
                    }}
                    className={
                      !data.pagination.hasNextPage
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>

          <div className="text-center mt-6 text-sm text-gray-500">
            Menampilkan {data.leaderboard.length} dari{" "}
            {data.pagination.totalUsers} siswa
          </div>
        </>
      )}
    </div>
  );
}
