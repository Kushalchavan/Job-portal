"use client";

import { useNotification } from "@/context/NotificationContext";
import { Card } from "./ui/card";

export default function NotificationSidebar({ open, setOpen }: any) {
  const { notifications, markAsRead } = useNotification();

  return (
    <div
      className={`fixed z-50 top-0 right-0 h-full w-80  shadow-lg border-l-4 bg-background text-muted-foreground transform transition-transform ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="p-4 border-b flex justify-between">
        <h2>Notifications</h2>
        <button onClick={() => setOpen(false)} className="font-bold text-muted-foreground">X</button>
      </div>

      <div className="p-4 space-y-3">
        {notifications.map((n) => (
          <Card key={n.id} className="border p-3 rounded">
            <p>{n.message}</p>

            {!n.isRead && (
              <button
                onClick={() => markAsRead(n.id)}
                className="text-blue-500 text-sm cursor-pointer text-left"
              >
                Mark as read
              </button>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}