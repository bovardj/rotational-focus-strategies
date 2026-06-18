export default function PageCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`grow max-w-3xl rounded-2xl border border-gray-100 bg-white p-6 pb-24 shadow-xl shadow-blue-100/60 md:p-12 md:pb-12 ${className ?? ""}`}
    >
      {children}
    </div>
  );
}
