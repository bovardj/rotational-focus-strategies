import RFSLogo from "@/app/ui/rfs-logo";

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <div className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-40">
        <div className="w-32 text-white md:w-40">
          <RFSLogo />
        </div>
      </div>
    </div>
  );
}
