export function Footer() {
  return (
    <footer className="border-t bg-[#002E5D] text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <p className="text-sm font-semibold">BYU Marriott School of Business</p>
            <p className="text-xs text-white/70">MBA Alumni Network</p>
          </div>
          <p className="text-xs text-white/50">
            Phase 0 Demo — Not affiliated with BYU
          </p>
        </div>
      </div>
    </footer>
  );
}
