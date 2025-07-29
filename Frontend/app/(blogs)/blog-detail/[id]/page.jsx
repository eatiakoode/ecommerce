import BlogDetail1 from "@/components/blogs/BlogDetail1";
import RelatedBlogs from "@/components/blogs/RelatedBlogs";
import Footer1 from "@/components/footers/Footer1";
import Topbar6 from "@/components/headers/Topbar6";
import React from "react";

export default async function BlogDetailsPage1({ params }) {
  const { id } = params;
  let blog = null;
  try {
    const res = await fetch(`http://localhost:5000/api/blog/${id}`, { cache: "no-store" });
    if (res.ok) {
      blog = await res.json();
    }
  } catch (e) {
    // blog remains null
  }
  return (
    <>
      <Topbar6 bgColor="bg-main" />
      <BlogDetail1 blog={blog} />
      <RelatedBlogs />
    </>
  );
}
