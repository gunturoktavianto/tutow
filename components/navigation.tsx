"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Gamepad2,
  Trophy,
  Timer,
  Coins,
  Star,
  Home,
  User,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

export function Navigation() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Mock user data - akan diganti dengan real authentication
  const user = {
    name: "Adik Pintar",
    username: "adikpintar",
    xp: 1250,
    gold: 340,
    avatar: "",
  };

  const navItems = [
    { href: "/dashboard", label: "Beranda", icon: Home },
    { href: "/learning", label: "Belajar", icon: BookOpen },
    { href: "/exercise", label: "Latihan", icon: Trophy },
    { href: "/games", label: "Permainan", icon: Gamepad2 },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-blue-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
              T
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Tutow
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={pathname.startsWith(item.href) ? "default" : "ghost"}
                  size="sm"
                  className="flex items-center space-x-2 text-sm font-medium"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Button>
              </Link>
            ))}
          </div>

          {/* User Info & Actions */}
          <div className="flex items-center space-x-3">
            {/* XP and Gold Display */}
            <div className="hidden sm:flex items-center space-x-2">
              <Badge
                variant="secondary"
                className="bg-yellow-100 text-yellow-800 border-yellow-300"
              >
                <Coins className="w-3 h-3 mr-1" />
                {user.gold}
              </Badge>
              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-800 border-blue-300"
              >
                <Star className="w-3 h-3 mr-1" />
                {user.xp} XP
              </Badge>
            </div>

            {/* Pomodoro Timer */}
            <Button variant="outline" size="sm" className="p-2">
              <Timer className="w-4 h-4" />
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium leading-none">
                    {user.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    @{user.username}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      <Star className="w-3 h-3 mr-1" />
                      {user.xp} XP
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <Coins className="w-3 h-3 mr-1" />
                      {user.gold}
                    </Badge>
                  </div>
                </div>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profil Saya</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Pengaturan</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Keluar</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-blue-200 bg-white/90 backdrop-blur-sm">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button
                    variant={
                      pathname.startsWith(item.href) ? "default" : "ghost"
                    }
                    size="sm"
                    className="w-full justify-start space-x-2"
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
