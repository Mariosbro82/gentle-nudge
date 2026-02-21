import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

interface LiveStatusBadgeProps {
  userId: string;
  initialText?: string | null;
  initialColor?: string | null;
}

export function LiveStatusBadge({ userId, initialText, initialColor }: LiveStatusBadgeProps) {
  const [statusText, setStatusText] = useState(initialText || null);
  const [statusColor, setStatusColor] = useState(initialColor || "#22c55e");

  useEffect(() => {
    // Subscribe to realtime changes on users table for this user
    const channel = supabase
      .channel(`live-status-${userId}`)
      .on(
        "postgres_changes" as any,
        {
          event: "UPDATE",
          schema: "public",
          table: "users",
          filter: `id=eq.${userId}`,
        },
        (payload: any) => {
          if (payload.new) {
            setStatusText(payload.new.live_status_text || null);
            setStatusColor(payload.new.live_status_color || "#22c55e");
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  if (!statusText) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}>
      <span
        className="relative flex h-2.5 w-2.5"
      >
        <span
          className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
          style={{ backgroundColor: statusColor }}
        />
        <span
          className="relative inline-flex rounded-full h-2.5 w-2.5"
          style={{ backgroundColor: statusColor }}
        />
      </span>
      <span className="text-white/90">{statusText}</span>
    </div>
  );
}
