"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Modify() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);

    if (storedRole === "admin") {
      router.push("/modify/admin");
    } else if (storedRole === "user") {
      router.push("/modify/user");
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!role) {
    return (
      <div className="flex flex-col items-center mt-16 h-screen">
        <p className="text-zinc-800 text-center mb-5">
          Please Login / Register to continue
        </p>
        <p className="text-zinc-800 text-center mb-5">or</p>
        <Link
          href="/commerce"
          className="text-zinc-800 rounded-lg bg-customTeal px-6 py-3 font-semibold"
        >
          Commerce Access
        </Link>
      </div>
    );
  }

  return null;
}
