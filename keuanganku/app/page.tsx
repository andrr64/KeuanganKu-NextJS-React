'use client';

import Loading from "@/components/Loading";
import { ROUTES } from "@/lib/routes";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {

  const router = useRouter();

  useEffect(() => {
    router.push(ROUTES.HOME)
  }, []);

  return (
    <Loading/>
  );
}
