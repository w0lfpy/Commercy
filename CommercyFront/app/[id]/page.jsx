'use server';

import {WebDetails} from "@/components";

export default async function WebDetailsPage({ params }) {
  const {id} = params;

  const res = await fetch(`http://localhost:3000/api/web/${id}`, { cache: 'no-store' });
  const data = await res.json();

  if (!data || res.status !== 200) {
    return <p className="text-center text-red-500 mt-4">Error loading data</p>;
  }

  return <WebDetails webData={data} />;
}