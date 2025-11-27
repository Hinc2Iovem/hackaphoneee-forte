"use client";

import { toast } from "sonner";
import { CheckCircle2, Info, OctagonX, TriangleAlert } from "lucide-react";

type ToastExtraOptions = {
  description?: string;
  duration?: number;
};

const BASE_CLASS = "hk-toast";
const makeClass = (variant: string) => `${BASE_CLASS} hk-toast-${variant}`;

export function toastSuccess(message: string, options: ToastExtraOptions = {}) {
  const { duration } = options;
  toast(message, {
    duration,
    className: makeClass("success"),
    icon: (
      <CheckCircle2
        className="size-4"
        style={{ color: "var(--status-published)" }}
      />
    ),
  });
}

export function toastError(message: string, options: ToastExtraOptions = {}) {
  const { duration } = options;
  toast(message, {
    duration,
    className: makeClass("error"),
    icon: (
      <OctagonX
        className="size-4"
        style={{ color: "var(--status-waiting-ba)" }}
      />
    ),
  });
}

export function toastWarning(message: string, options: ToastExtraOptions = {}) {
  const { duration } = options;
  toast(message, {
    duration,
    className: makeClass("warning"),
    icon: <TriangleAlert className="size-4" />,
  });
}

export function toastInfo(message: string, options: ToastExtraOptions = {}) {
  const { duration } = options;
  toast(message, {
    duration,
    className: makeClass("info"),
    icon: <Info className="size-4" />,
  });
}
