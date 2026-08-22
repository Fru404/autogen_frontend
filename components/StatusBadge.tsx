interface StatusBadgeProps {
  type: "success" | "warning" | "error" | "neutral";
  children: React.ReactNode;
}

export default function StatusBadge({ type, children }: StatusBadgeProps) {
  const styles = {
    success: "border-green-200 bg-green-50 text-green-700",

    warning: "border-amber-200 bg-amber-50 text-amber-700",

    error: "border-red-200 bg-red-50 text-red-700",

    neutral: "border-slate-200 bg-slate-50 text-slate-700",
  };

  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        border
        px-3
        py-1.5
        text-xs
        font-semibold
        ${styles[type]}
      `}
    >
      {children}
    </span>
  );
}
