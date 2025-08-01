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
            {blogs.map((blog, i) => (
              <React.Fragment key={blog._id || i}>
                {i != 0 ? <div className="line-bt mb_40" /> : ""}
                <div className="wg-blog hover-image mb_40">
                  <div className="image">
                    {blog.image ? (
                      <Image
                        className="lazyload"
                        alt={blog.title}
                        src={blog.image.startsWith('http') ? blog.image : `http://localhost:5000${blog.image}`}
                        width={1275}
                        height={717}
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
                        width={1275}
                        height={717}
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
                    <h3 className="text-title-3">
                      <Link href={`/blog-detail/${blog.slug || blog._id}`}>{blog.title}</Link>
                    </h3>
                    <p className="text-caption-1">{blog.description}</p>
                  </div>
                </div>
              </React.Fragment>
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
