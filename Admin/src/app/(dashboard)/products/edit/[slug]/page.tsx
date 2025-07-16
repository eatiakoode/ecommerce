'use client';
import dynamic from "next/dynamic";

const EditProductClient = dynamic(() => import("../../_components/EditProductClient"), { ssr: false });

export default function EditProductPage({ params }: { params: { slug: string } }) {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <EditProductClient slug={params.slug} />
    </div>
  );
} 