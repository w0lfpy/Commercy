'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Custom404() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push("/"); 
        }, 5000); 

        return () => clearTimeout(timer); 
    }, [router]);

    return (
        <div className="h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800">
            <h1 className="text-5xl font-bold mb-4">404 - Page Not Found</h1>
            <p className="text-xl mb-8">Oops! The page you are looking for does not exist.</p>
            <p className="text-sm text-gray-600">
                You will be redirected to the homepage in 5 seconds.
            </p>
        </div>
    );
}
