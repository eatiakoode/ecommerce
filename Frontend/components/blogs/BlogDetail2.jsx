"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function BlogDetail2({ blog: propBlog }) {
  const params = useParams();
  const [blog, setBlog] = useState(propBlog || null);
  const [loading, setLoading] = useState(!propBlog);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      if (propBlog) {
        setBlog(propBlog);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/blog/${params.slug || params.id}`, {
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch blog");
        }
        
        const blogData = await response.json();
        // Transform the admin API response to match frontend format
        setBlog({
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
          slug: blogData.slug || params.slug || params.id,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (params.slug || params.id) fetchBlog();
  }, [params.slug, params.id, propBlog]);

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
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="blog-detail-wrap page-single-2">
              {/* Blog Header */}
              <div className="inner mb-4">
                <div className="heading text-center">
                  <div className="text-btn-uppercase text-secondary-2 mb-2">
                    {blog.category || 'Blog'}
                  </div>
                  <h2 className="text-title-1 fw-5 mb-4">
                    {blog.title || 'No Title'}
                  </h2>
                  <div className="meta justify-content-center">
                    <div className="meta-item gap-8">
                      <div className="icon">
                        <i className="icon-calendar" />
                      </div>
                      <p className="text-caption-1">
                        {blog.date || 'No Date'}
                      </p>
                    </div>
                    <div className="meta-item gap-8">
                      <div className="icon">
                        <i className="icon-user" />
                      </div>
                      <p className="text-caption-1">
                        by <a className="link" href="#">{blog.author || 'Unknown Author'}</a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Main Image */}
              <div className="image mb-4">
                {blog.images && blog.images.length > 0 ? (
                  <Image
                    className="lazyload"
                    alt={blog.title}
                    src={blog.images[0].url.startsWith('http') ? blog.images[0].url : `http://localhost:5000${blog.images[0].url}`}
                    width={1275}
                    height={717}
                    onError={(e) => {
                      e.target.src = '/images/blog/blog-details-3.jpg';
                    }}
                  />
                ) : (
                  <Image
                    className="lazyload"
                    alt="Default blog image"
                    src="/images/blog/blog-details-3.jpg"
                    width={1275}
                    height={717}
                  />
                )}
              </div>
              
              {/* Blog Description */}
              <div className="content mb-4">
                <p className="body-text-1 mb_12">
                  {blog.description || 'No description available'}
                </p>
                {blog.description && blog.description.length > 200 && (
                  <p className="body-text-1">
                    {blog.description.substring(200)}
                  </p>
                )}
              </div>
              
              {/* Additional Images */}
              {blog.images && blog.images.length > 1 && (
                <div className="group-image d-flex gap-20 mb-4">
                  <div>
                    <Image
                      alt={blog.title}
                      src={blog.images[1].url.startsWith('http') ? blog.images[1].url : `http://localhost:5000${blog.images[1].url}`}
                      width={623}
                      height={468}
                      onError={(e) => {
                        e.target.src = '/images/blog/blog-details-3.jpg';
                      }}
                    />
                  </div>
                  {blog.images.length > 2 && (
                    <div>
                      <Image
                        alt={blog.title}
                        src={blog.images[2].url.startsWith('http') ? blog.images[2].url : `http://localhost:5000${blog.images[2].url}`}
                        width={623}
                        height={468}
                        onError={(e) => {
                          e.target.src = '/images/blog/blog-details-4.jpg';
                        }}
                      />
                    </div>
                  )}
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
              <div className="bot d-flex justify-content-center gap-10 flex-wrap mb-4">
                <ul className="list-tags has-bg">
                  <li>Tag:</li>
                  <li>
                    <a href="#" className="link">
                      {blog.category?.title || blog.category || 'Blog'}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="link">
                      Trending
                    </a>
                  </li>
                </ul>
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
