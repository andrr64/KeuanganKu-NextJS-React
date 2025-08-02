'use client';

import Loading from "@/components/Loading";
import { WEB_ROUTE } from "@/lib/routes";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {

  const router = useRouter();

  useEffect(() => {
    router.push(WEB_ROUTE.HOME)
  }, []);

  return (
    <Loading/>
  );
}
