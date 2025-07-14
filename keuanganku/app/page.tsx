'use client';
import { useTheme } from "next-themes";
import Image from "next/image";

export default function Home() {

  const {theme, setTheme} = useTheme();

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 transition-all duration-300">
      <div>
        <h1>Next.JS dark mode </h1>
        <button onClick={() => setTheme(theme === "light"? "dark" : "light")}>Dark/Light</button>
      </div>
    </div>
  );
}
