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
        const response = await fetch('http://localhost:5000/api/frontend/blog/list');
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
              {blogs.map((blog, i) => (
                <div key={blog._id || i} className="col-lg-4 col-md-6">
                  <div className="wg-blog hover-image">
                    <div className="image">
                      {blog.image ? (
                        <Image
                          className="lazyload"
                          alt={blog.title}
                          src={blog.image.startsWith('http') ? blog.image : `http://localhost:5000${blog.image}`}
                          width={600}
                          height={399}
                          onError={(e) => {
                            console.log('Image failed to load:', blog.image);
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
                            <div className="text-caption-1">
                              {blog.date ? new Date(blog.date).toLocaleDateString() : "No Date"}
                            </div>
                          </div>
                          <div className="meta-item gap-8">
                            <div className="icon">
                              <i className="icon-user" />
                            </div>
                            <div className="text-caption-1">{blog.author || "No Author"}</div>
                          </div>
                        </div>
                        <div className="meta">
                          <div className="meta-item gap-4">
                            <div className="icon">
                              <i className="icon-comment" />
                            </div>
                            <div className="text-caption-1">0</div>
                          </div>
                          <div className="meta-item gap-4">
                            <div className="icon">
                              <i className="icon-eye" />
                            </div>
                            <div className="text-caption-1">0</div>
                          </div>
                        </div>
                      </div>
                      <h5 className="title">
                        <Link className="link" href={`/blog-detail/${blog.slug || blog._id}`}>
                          {blog.title}
                        </Link>
                      </h5>
                      <p className="text-caption-1">
                        {blog.description ? 
                          (blog.description.length > 100 ? 
                            `${blog.description.substring(0, 100)}...` : 
                            blog.description
                          ) : 
                          'No description available'
                        }
                      </p>
                      <Link
                        href={`/blog-detail/${blog.slug || blog._id}`}
                        className="link text-button bot-button"
                      >
                        Read More
                      </Link>
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
