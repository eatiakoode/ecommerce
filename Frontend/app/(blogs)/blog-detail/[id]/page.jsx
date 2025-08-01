import BlogDetail1 from "@/components/blogs/BlogDetail1";
import RelatedBlogs from "@/components/blogs/RelatedBlogs";
import Footer1 from "@/components/footers/Footer1";
// import Topbar6 from "@/components/headers/Topbar6";
import React from "react";
import { redirect } from "next/navigation";

export default async function BlogDetailsPage1({ params }) {
  const { id } = params;
  let blog = null;
  
  try {
    // First try to fetch by ID (admin API)
    const res = await fetch(`http://localhost:5000/api/blog/${id}`, { 
      cache: "no-store",
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (res.ok) {
      const blogData = await res.json();
      
      // If we have a slug, redirect to the slug-based route
      if (blogData.slug && blogData.slug !== id) {
        redirect(`/blog-detail/${blogData.slug}`);
      }
      
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
        slug: blogData.slug || id,
        _id: blogData._id,
      };
    } else {
      // If ID fetch fails, try to find by slug in all blogs
      const allBlogsRes = await fetch(`http://localhost:5000/api/blog`, { 
        cache: "no-store",
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (allBlogsRes.ok) {
        const allBlogs = await allBlogsRes.json();
        const foundBlog = allBlogs.find(b => b.slug === id || b._id === id);
        
        if (foundBlog) {
          // If we have a slug, redirect to the slug-based route
          if (foundBlog.slug && foundBlog.slug !== id) {
            redirect(`/blog-detail/${foundBlog.slug}`);
          }
          
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
