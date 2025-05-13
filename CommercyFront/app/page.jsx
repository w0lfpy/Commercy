'use server';
import { GetAllWebsClient } from "@/components";

export default async function HomePage() {
    const res = await fetch(`http://localhost:3000/api/web`, { cache: 'no-store' });
    const data = await res.json();
  
    return (
      <div>
        <GetAllWebsClient initialData={data} />
      </div>
    );
}