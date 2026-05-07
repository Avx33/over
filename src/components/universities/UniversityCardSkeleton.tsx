export function UniversityCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-pulse">
      <div className="p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded-lg w-3/4" />
            <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-lg w-1/3" />
          </div>
          <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex-shrink-0" />
        </div>
        <div className="flex gap-2">
          <div className="h-5 w-14 bg-gray-100 dark:bg-gray-700 rounded-full" />
          <div className="h-5 w-20 bg-gray-100 dark:bg-gray-700 rounded-full" />
        </div>
      </div>
      <div className="px-5 pb-4">
        <div className="flex gap-1.5">
          <div className="h-6 w-20 bg-gray-100 dark:bg-gray-700 rounded-lg" />
          <div className="h-6 w-24 bg-gray-100 dark:bg-gray-700 rounded-lg" />
          <div className="h-6 w-16 bg-gray-100 dark:bg-gray-700 rounded-lg" />
        </div>
      </div>
      <div className="px-5 py-3.5 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
        <div className="space-y-1">
          <div className="h-3 w-24 bg-gray-100 dark:bg-gray-600 rounded" />
          <div className="h-4 w-28 bg-gray-100 dark:bg-gray-600 rounded" />
        </div>
        <div className="h-4 w-10 bg-gray-100 dark:bg-gray-600 rounded" />
      </div>
    </div>
  );
}
