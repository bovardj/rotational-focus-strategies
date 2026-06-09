import InstructionsNavrail from "./navrail";

export default function InstructionsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-grow gap-6">
      <div className="flex-grow max-w-2xl rounded-2xl border border-gray-100 bg-white p-6 pb-24 shadow-xl shadow-blue-100/60 md:p-12 md:pb-12">
        {children}
      </div>
      <InstructionsNavrail />
    </div>
  );
}
