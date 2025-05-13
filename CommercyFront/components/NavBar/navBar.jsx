'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function NavBar() {
  const router = useRouter();
  const { isAuthenticated, role, setAuth } = useAuth();

  const handleLogout = () => {
    setAuth(null, "");
    router.push("/");
  };

  return (
    <header className="w-full bg-white p-6 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-gray-800 text-2xl font-bold">
          Commercy - Entrega Front API
        </h1>
        <nav className="flex items-center space-x-8 text-gray-600">
          <Link href="/" className="hover:text-gray-900 font-medium">Home</Link>
          {isAuthenticated ? (
            <>
              <span className="text-gray-500 text-sm">{role}</span>
              <button
                onClick={handleLogout}
                className="text-gray-200 hover:text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login">
                <button className="text-zinc-800 border-2 border-zinc-800 hover:bg-gray-700 hover:text-white px-4 py-1 rounded-xl transition font-bold">
                  Login
                </button>
              </Link>
              <Link href="/register">
                <button className="text-zinc-700 bg-customTeal hover:bg-customTealDark px-4 py-2 rounded transition font-bold">
                  Register
                </button>
              </Link>
            </>
          )}
          <Link href="/modify">
            <button className="text-gray-600 hover:text-gray-900 p-2 rounded-full transition">
              <i className="fa-solid fa-user"></i>
            </button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
