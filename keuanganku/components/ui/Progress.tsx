export function Progress({ value, className }: { value: number; className?: string }) {
  return (
    <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${className}`}>
      <div
        className="h-full bg-indigo-600 transition-all duration-300"
        style={{ width: `${value}%` }}
      ></div>
    </div>
  );
}
