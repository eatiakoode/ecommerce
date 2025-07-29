"use client";
import React, { useState, useEffect } from "react";
import Comments from "./Comments";
import CommentForm from "./CommentForm";
import Sidebar2 from "./Sidebar2";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function BlogDetail2({ blog: propBlog }) {
  const params = useParams();
  const [blog, setBlog] = useState(propBlog || null);
  const [loading, setLoading] = useState(!propBlog);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchBlog = async () => {
      if (propBlog) return;
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/blog/${params.id}`);
        if (!response.ok) throw new Error("Failed to fetch blog");
        const data = await response.json();
        setBlog(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/blogcategory');
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    if (params.id) fetchBlog();
    fetchCategories();
  }, [params.id, propBlog]);

  // Function to get category title by ID
  const getCategoryTitle = (categoryId) => {
    if (!categoryId) return 'Blog';
    const category = categories.find(cat => cat._id === categoryId);
    return category ? category.title : 'Blog';
  };

  if (loading) {
  return (
    <section className="flat-spacing">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 mb-lg-30">
            <div className="blog-detail-wrap page-single-2">
              <div className="inner">
                <div className="heading">
                    <div className="bg-gray-200 animate-pulse h-8 w-32 rounded mb-4"></div>
                    <div className="bg-gray-200 animate-pulse h-12 w-full rounded mb-4"></div>
                  </div>
                  <div className="bg-gray-200 animate-pulse h-96 w-full rounded mb-4"></div>
                  <div className="bg-gray-200 animate-pulse h-4 w-full rounded mb-2"></div>
                  <div className="bg-gray-200 animate-pulse h-4 w-3/4 rounded mb-2"></div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <Sidebar2 />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flat-spacing">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <p className="text-red-500">Error loading blog: {error}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!blog) {
    return (
      <section className="flat-spacing">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <p>Blog not found</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="flat-spacing">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 mb-lg-30">
            {/* Category Tag */}
            <div className="heading mb-4">
              <ul className="list-tags has-bg mb-3">
                    <li>
                      <a href="#" className="link">
                    {blog.category?.title || getCategoryTitle(blog.category)}
                      </a>
                    </li>
                  </ul>
              
              {/* Blog Title */}
              <h3 className="fw-5 mb-4">{blog.title}</h3>
            </div>
            
            {/* Main Blog Image */}
            <div className="image mb-4">
              {blog.images && blog.images.length > 0 ? (
                <Image
                  className="lazyload"
                  alt={blog.title}
                  src={
                    blog.images[0].url.startsWith("http")
                      ? blog.images[0].url
                      : `http://localhost:5000${blog.images[0].url}`
                  }
                  width={1275}
                  height={717}
                  style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                  onError={(e) => {
                    e.target.src = "/images/blog/blog-details-2.jpg";
                  }}
                />
              ) : (
                <Image
                  className="lazyload"
                  alt="Default blog image"
                  src="/images/blog/blog-details-2.jpg"
                  width={1275}
                  height={717}
                  style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                />
              )}
            </div>
            
            {/* Date and Author - BELOW the image */}
            <div className="meta mb-4">
                    <div className="meta-item gap-8">
                      <div className="icon">
                        <i className="icon-calendar" />
                      </div>
                <p className="body-text-1">
                  {blog.date
                    ? new Date(blog.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "No date"}
                </p>
                    </div>
                    <div className="meta-item gap-8">
                      <div className="icon">
                        <i className="icon-user" />
                      </div>
                      <p className="body-text-1">
                        by{" "}
                        <a className="link" href="#">
                    {blog.author || "Unknown Author"}
                        </a>
                      </p>
                    </div>
                  </div>
            
            {/* Blog Description */}
            <div className="content mb-4">
              <p className="body-text-1 mb_12">
                {blog.description || "No description available"}
              </p>
              {blog.description && blog.description.length > 200 && (
                <p className="body-text-1">
                  {blog.description.substring(200)}
                </p>
              )}
                </div>
            
            {/* Additional Images */}
            {blog.images && blog.images.length > 2 && (
              <div className="group-image d-flex gap-20 mb-4">
                <div>
                  <Image
                    alt={blog.title}
                    src={
                      blog.images[1].url.startsWith("http")
                        ? blog.images[1].url
                        : `http://localhost:5000${blog.images[1].url}`
                    }
                    width={623}
                    height={468}
                    onError={(e) => {
                      e.target.src = "/images/blog/blog-details-3.jpg";
                    }}
                  />
                </div>
                  <div>
                    <Image
                    alt={blog.title}
                    src={
                      blog.images[2].url.startsWith("http")
                        ? blog.images[2].url
                        : `http://localhost:5000${blog.images[2].url}`
                    }
                      width={623}
                      height={468}
                    onError={(e) => {
                      e.target.src = "/images/blog/blog-details-4.jpg";
                    }}
                    />
                  </div>
                </div>
            )}
            
            {/* Additional Content */}
            <div className="content mb-4">
              <h3 className="fw-5 mb_16">Additional Information</h3>
                  <p className="body-text-1 mb_16">
                This blog post provides valuable insights and information about the topic.
                The content has been carefully curated to provide the most relevant and
                up-to-date information for our readers.
                  </p>
                  <p className="body-text-1 mb_16">
                We hope you find this content helpful and informative. If you have any
                questions or would like to learn more about this topic, please feel free
                to reach out to us.
                  </p>
                </div>
            
            {/* Tags and Share */}
            <div className="bot d-flex justify-content-between gap-10 flex-wrap mb-4">
                  <ul className="list-tags has-bg">
                    <li>Tag:</li>
                    <li>
                      <a href="#" className="link">
                    {blog.category?.title || getCategoryTitle(blog.category)}
                      </a>
                    </li>
                    <li>
                      <a href="#" className="link">
                        Trending
                      </a>
                    </li>
                  </ul>
              {/* Commented out Share this post section
                  <div className="d-flex align-items-center justify-content-between gap-16">
                    <p>Share this post:</p>
                    <ul className="tf-social-icon style-1">
                      <li>
                        <a href="#" className="social-facebook">
                          <i className="icon icon-fb" />
                        </a>
                      </li>
                      <li>
                        <a href="#" className="social-twiter">
                          <i className="icon icon-x" />
                        </a>
                      </li>
                      <li>
                        <a href="#" className="social-pinterest">
                          <i className="icon icon-pinterest" />
                        </a>
                      </li>
                      <li>
                        <a href="#" className="social-instagram">
                          <i className="icon icon-instagram" />
                        </a>
                      </li>
                    </ul>
                  </div>
              */}
                </div>
            
            {/* Navigation */}
            <div className="related-post mb-4 d-flex justify-content-between align-items-center">
              <div className="pre">
                    <div className="text-btn-uppercase">
                      <a href="#">Previous</a>
                    </div>
                    <h6 className="fw-5">
                      <a className="link" href="#">
                    Previous Blog Post
                      </a>
                    </h6>
                  </div>
              <div className="next text-end">
                <div className="text-btn-uppercase">
                      <a href="#">Next</a>
                    </div>
                <h6 className="fw-5">
                      <a className="link" href="#">
                    Next Blog Post
                      </a>
                    </h6>
              </div>
            </div>
            
            <Comments />
          </div>
          
          {/* Comment Form - Positioned to the right */}
          <div className="col-lg-4">
            <div className="comment-section">
              <CommentForm />
            </div>
            <Sidebar2 />
          </div>
        </div>
      </div>
    </section>
  );
}
