"use client";
import React, { useState, useEffect } from "react";
import Pagination from "../common/Pagination";
import Link from "next/link";
import Image from "next/image";

export default function BlogGrid() {
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
            <div className="col-12">
              <div className="tf-grid-layout md-col-3">
                {[...Array(6)].map((_, index) => (
                  <div className="wg-blog style-1 hover-image" key={index}>
                    <div className="image">
                      <div className="bg-gray-200 animate-pulse" style={{ width: 615, height: 461 }}></div>
                    </div>
                    <div className="content">
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
                      <div>
                        <div className="bg-gray-200 animate-pulse h-6 w-full rounded mb-2"></div>
                        <div className="bg-gray-200 animate-pulse h-4 w-3/4 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
          <div className="col-12">
            <div className="tf-grid-layout md-col-3">
              {blogs.map((blog, index) => (
                <div className="wg-blog style-1 hover-image" key={blog._id || index}>
                  <div className="image">
                    {blog.images && blog.images.length > 0 ? (
                      <Image
                        className="lazyload"
                        data-src={blog.images[0].url.startsWith('http') ? blog.images[0].url : `http://localhost:5000${blog.images[0].url}`}
                        alt={blog.title}
                        src={blog.images[0].url.startsWith('http') ? blog.images[0].url : `http://localhost:5000${blog.images[0].url}`}
                        width={615}
                        height={461}
                        onError={(e) => {
                          console.log('Image failed to load:', blog.images[0].url);
                          e.target.src = '/images/blog/blog-grid-1.jpg';
                        }}
                      />
                    ) : (
                    <Image
                      className="lazyload"
                        data-src="/images/blog/blog-grid-1.jpg"
                        alt="Default blog image"
                        src="/images/blog/blog-grid-1.jpg"
                      width={615}
                      height={461}
                    />
                    )}
                  </div>
                  <div className="content">
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
                    <div>
                      <h6 className="title fw-5">
                        <Link className="link" href={`/blog-detail/${blog._id}`}>
                          {blog.title}
                        </Link>
                      </h6>
                      <div className="body-text">
                        {blog.description ? 
                          (blog.description.length > 100 ? 
                            `${blog.description.substring(0, 100)}...` : 
                            blog.description
                          ) : 
                          'No description available'
                        }
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {blogs.length === 0 && (
                <div className="col-12 text-center">
                  <p>No blogs found</p>
                </div>
              )}
              <ul className="wg-pagination justify-content-center">
                <Pagination />
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
