'use server';
import { GetAllWebsClient } from "@/components";

export default async function HomePage() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/web`, { cache: 'no-store' });
    const data = await res.json();
  
    return (
      <div>
        <GetAllWebsClient initialData={data} />
      </div>
    );
}