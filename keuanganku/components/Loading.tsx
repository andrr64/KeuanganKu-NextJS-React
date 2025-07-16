export default function Loading() {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-100">
      <div className="w-10 h-10 border-4 border-white border-t-indigo-500 rounded-full animate-spin"></div>
    </div>
  );
}
