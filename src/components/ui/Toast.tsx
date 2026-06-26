"use client";
import { useToastStore } from "@/store/toastStore";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const colors = {
  success: "bg-emerald-500/90 border-emerald-400",
  error: "bg-red-500/90 border-red-400",
  info: "bg-blue-500/90 border-blue-400",
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
      {toasts.map((toast) => {
        const Icon = icons[toast.type];
        return (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-sm shadow-2xl text-white text-sm font-medium animate-slide-in ${colors[toast.type]}`}
          >
            <Icon size={18} />
            <span>{toast.message}</span>
            <button onClick={() => removeToast(toast.id)} className="ml-2 hover:opacity-70">
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
