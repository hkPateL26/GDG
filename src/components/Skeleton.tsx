// Skeleton loader component - reusable across all pages

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden animate-pulse">
      <div className="bg-gray-100 p-4 border-b border-gray-100">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-lg flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
            <div className="h-5 bg-gray-200 rounded-full w-20" />
          </div>
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-5/6" />
        <div className="space-y-2 pt-1">
          <div className="h-3 bg-gray-200 rounded w-4/5" />
          <div className="h-3 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-4/5" />
        </div>
        <div className="flex justify-between pt-1">
          <div className="h-3 bg-gray-200 rounded w-1/3" />
          <div className="h-3 bg-gray-200 rounded w-1/4" />
        </div>
      </div>
      <div className="px-4 pb-4 flex gap-2">
        <div className="flex-1 h-9 bg-gray-200 rounded-lg" />
        <div className="flex-1 h-9 bg-gray-200 rounded-lg" />
      </div>
    </div>
  );
}

export function SkeletonCompactCard() {
  return (
    <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex items-center gap-3 animate-pulse">
      <div className="w-8 h-8 bg-gray-200 rounded-lg flex-shrink-0" />
      <div className="flex-1 space-y-1.5 min-w-0">
        <div className="h-3.5 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
      </div>
      <div className="w-4 h-4 bg-gray-200 rounded flex-shrink-0" />
    </div>
  );
}

export function SkeletonChatMessage({ isUser = false }: { isUser?: boolean }) {
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} animate-pulse`}>
      <div
        className={`max-w-[75%] rounded-2xl p-3 space-y-1.5 ${
          isUser ? "bg-orange-100" : "bg-gray-100"
        }`}
      >
        <div className="h-3 bg-gray-200 rounded w-48" />
        <div className="h-3 bg-gray-200 rounded w-36" />
        <div className="h-3 bg-gray-200 rounded w-40" />
      </div>
    </div>
  );
}

export function SkeletonHero() {
  return (
    <div className="bg-gradient-to-r from-orange-100 to-green-100 py-14 px-4 animate-pulse">
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto" />
        <div className="h-8 bg-gray-200 rounded-xl w-64 mx-auto" />
        <div className="h-4 bg-gray-200 rounded w-80 mx-auto" />
        <div className="flex gap-3 justify-center pt-2">
          <div className="h-12 w-32 bg-gray-200 rounded-xl" />
          <div className="h-12 w-28 bg-gray-200 rounded-xl" />
          <div className="h-12 w-36 bg-gray-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonNavbar() {
  return (
    <div className="bg-white shadow-md border-b-2 border-orange-200 h-16 animate-pulse">
      <div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-200 rounded" />
          <div className="h-6 w-32 bg-gray-200 rounded" />
        </div>
        <div className="hidden md:flex gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-8 w-20 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function SkeletonStatusCard() {
  return (
    <div className="rounded-2xl border-2 border-gray-200 p-6 animate-pulse space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gray-200 rounded-full" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-48" />
          <div className="h-3 bg-gray-200 rounded w-24" />
        </div>
      </div>
      <div className="space-y-2 pt-2">
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-4/5" />
        <div className="h-3 bg-gray-200 rounded w-3/5" />
      </div>
    </div>
  );
}

// ── Admin Hierarchy Specific Skeleton Loaders ──

export function SkeletonAdminStats() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-pulse">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
          <div className="h-3 bg-slate-200 rounded w-24" />
          <div className="h-6 bg-slate-200 rounded w-16" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonAdminTable() {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-4 animate-pulse space-y-3">
      <div className="h-10 bg-slate-100 rounded-xl w-full" />
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-14 bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center justify-between gap-4">
          <div className="h-4 bg-slate-200 rounded w-28" />
          <div className="h-4 bg-slate-200 rounded w-36 hidden sm:block" />
          <div className="h-6 bg-slate-200 rounded-full w-20" />
          <div className="h-8 bg-slate-200 rounded-lg w-24" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonReviewModal() {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 animate-pulse space-y-5 max-w-2xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-slate-200 rounded-2xl" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-slate-200 rounded w-48" />
          <div className="h-3 bg-slate-200 rounded w-32" />
        </div>
      </div>
      <div className="h-24 bg-slate-100 rounded-2xl" />
      <div className="space-y-2">
        <div className="h-3 bg-slate-200 rounded w-full" />
        <div className="h-3 bg-slate-200 rounded w-5/6" />
        <div className="h-3 bg-slate-200 rounded w-3/4" />
      </div>
      <div className="flex gap-3 pt-3">
        <div className="flex-1 h-10 bg-slate-200 rounded-xl" />
        <div className="flex-1 h-10 bg-slate-200 rounded-xl" />
      </div>
    </div>
  );
}
