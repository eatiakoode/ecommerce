import BlogDetail1 from "@/components/blogs/BlogDetail1";
import RelatedBlogs from "@/components/blogs/RelatedBlogs";
import Footer1 from "@/components/footers/Footer1";
// import Topbar6 from "@/components/headers/Topbar6";
import React from "react";

export default async function BlogDetailsPageBySlug({ params }) {
  const { slug } = params;
  let blog = null;
  
  try {
    // Try to fetch by slug using the admin API
    const res = await fetch(`http://localhost:5000/api/blog/slug/${slug}`, { 
      cache: "no-store",
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (res.ok) {
      const blogData = await res.json();
      // Transform the admin API response to match frontend format
      blog = {
        category: blogData.category?.title || null,
        title: blogData.title,
        description: blogData.description,
        date: blogData.createdAt ? new Date(blogData.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }) : null,
        author: blogData.author,
        images: blogData.images,
        slug: blogData.slug,
        _id: blogData._id,
      };
    } else {
      // If slug fetch fails, try to find by slug in all blogs
      const resById = await fetch(`http://localhost:5000/api/blog`, { 
        cache: "no-store",
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (resById.ok) {
        const allBlogs = await resById.json();
        const foundBlog = allBlogs.find(b => b.slug === slug);
        
        if (foundBlog) {
          // Transform the admin API response to match frontend format
          blog = {
            category: foundBlog.category?.title || null,
            title: foundBlog.title,
            description: foundBlog.description,
            date: foundBlog.createdAt ? new Date(foundBlog.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }) : null,
            author: foundBlog.author,
            images: foundBlog.images,
            slug: foundBlog.slug,
            _id: foundBlog._id,
          };
        }
      }
    }
  } catch (e) {
    console.error('Error fetching blog:', e);
    // blog remains null
  }
  
  return (
    <>
      {/* <Topbar6 bgColor="bg-main" /> */}
      <BlogDetail1 blog={blog} />
      <RelatedBlogs currentBlogId={blog?._id} currentBlogSlug={blog?.slug} />
    </>
  );
} 