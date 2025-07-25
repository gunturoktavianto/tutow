"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Trophy } from "lucide-react";

interface BadgeNotificationProps {
  badges: string[];
  onClose: () => void;
}

export function BadgeNotification({ badges, onClose }: BadgeNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (badges.length > 0) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [badges, onClose]);

  if (badges.length === 0 || !isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-full duration-300">
      <Card className="bg-gradient-to-r from-yellow-400 to-orange-400 border-yellow-300 shadow-lg max-w-sm">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="bg-white rounded-full p-2">
                <Trophy className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white text-sm mb-1">
                  🎉 Badge Baru!
                </h3>
                <p className="text-white text-xs mb-2">
                  Selamat! Kamu mendapat {badges.length} badge baru:
                </p>
                <div className="space-y-1">
                  {badges.slice(0, 3).map((badge, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {badge}
                    </Badge>
                  ))}
                  {badges.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{badges.length - 3} lainnya
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsVisible(false);
                setTimeout(onClose, 300);
              }}
              className="text-white hover:bg-white/20 h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
