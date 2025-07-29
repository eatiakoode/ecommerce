"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Pagination from "../common/Pagination";
import Link from "next/link";
import Image from "next/image";

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/blog');
        if (!response.ok) {
          throw new Error('Failed to fetch blogs');
        }
        const data = await response.json();
        setBlogs(data);
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="main-content-page">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mb-lg-30">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="wg-blog style-row hover-image mb_40">
                  <div className="image">
                    <div className="bg-gray-200 animate-pulse" style={{ width: 600, height: 399 }}></div>
                  </div>
                  <div className="content">
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-10">
                      <div className="meta">
                        <div className="meta-item gap-8">
                          <div className="icon">
                            <i className="icon-calendar" />
                          </div>
                          <div className="bg-gray-200 animate-pulse h-4 w-20 rounded"></div>
                        </div>
                        <div className="meta-item gap-8">
                          <div className="icon">
                            <i className="icon-user" />
                          </div>
                          <div className="bg-gray-200 animate-pulse h-4 w-24 rounded"></div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-200 animate-pulse h-6 w-full rounded mb-2"></div>
                    <div className="bg-gray-200 animate-pulse h-4 w-3/4 rounded mb-2"></div>
                    <div className="bg-gray-200 animate-pulse h-4 w-20 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="col-lg-4">
              <Sidebar />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-content-page">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <p className="text-red-500">Error loading blogs: {error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content-page">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 mb-lg-30">
            {blogs.slice(0, 5).map((blog, i) => (
              <div key={blog._id || i} className="wg-blog style-row hover-image mb_40">
                <div className="image">
                  {blog.images && blog.images.length > 0 ? (
                    <Image
                      className="lazyload"
                      alt={blog.title}
                      src={blog.images[0].url.startsWith('http') ? blog.images[0].url : `http://localhost:5000${blog.images[0].url}`}
                      width={600}
                      height={399}
                      onError={(e) => {
                        console.log('Image failed to load:', blog.images[0].url);
                        e.target.src = '/images/blog/blog-grid-1.jpg';
                      }}
                    />
                  ) : (
                  <Image
                    className="lazyload"
                      alt="Default blog image"
                      src="/images/blog/blog-grid-1.jpg"
                    width={600}
                    height={399}
                  />
                  )}
                </div>
                <div className="content">
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-10">
                    <div className="meta">
                      <div className="meta-item gap-8">
                        <div className="icon">
                          <i className="icon-calendar" />
                        </div>
                        <p className="text-caption-1">
                          {blog.date ? new Date(blog.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) : 'No date'}
                        </p>
                      </div>
                      <div className="meta-item gap-8">
                        <div className="icon">
                          <i className="icon-user" />
                        </div>
                        <p className="text-caption-1">
                          by{" "}
                          <a className="link" href="#">
                            {blog.author || 'Unknown Author'}
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                  <h5 className="title">
                    <Link className="link" href={`/blog-detail/${blog._id}`}>
                      {blog.title}
                    </Link>
                  </h5>
                  <p>
                    {blog.description ? 
                      blog.description.split(" ").slice(0, 10).join(" ") + "..." : 
                      'No description available'
                    }
                  </p>
                  <Link
                    href={`/blog-detail/${blog._id}`}
                    className="link text-button bot-button"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            ))}
            {blogs.length === 0 && (
              <div className="text-center">
                <p>No blogs found</p>
              </div>
            )}
            <ul className="wg-pagination">
              <Pagination />
            </ul>
          </div>
          <div className="col-lg-4">
            <Sidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
