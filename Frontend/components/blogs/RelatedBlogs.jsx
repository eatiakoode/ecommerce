"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function RelatedBlogs({ currentBlogId, currentBlogSlug }) {
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedBlogs = async () => {
      try {
        setLoading(true);
        
        // Fetch all blogs
        const response = await fetch(`http://localhost:5000/api/blog`);
        
        if (response.ok) {
          const allBlogs = await response.json();
          
          // Get current blog to find its category
          const currentBlog = allBlogs.find(blog => 
            blog._id === currentBlogId || blog.slug === currentBlogSlug
          );
          
          if (currentBlog) {
            // Filter blogs with same category, exclude current blog, limit to 3
            let related = allBlogs
              .filter(blog => 
                blog._id !== currentBlog._id && 
                blog.category?._id === currentBlog.category?._id
              )
              .slice(0, 3);
            
            // If no related blogs with same category, show other recent blogs
            if (related.length === 0) {
              related = allBlogs
                .filter(blog => blog._id !== currentBlog._id)
                .slice(0, 3);
            }
            
            const mappedRelated = related.map(blog => ({
              _id: blog._id,
              title: blog.title,
              description: blog.description,
              author: blog.author,
              date: blog.createdAt,
              image: blog.images?.[0]?.url || null,
              slug: blog.slug,
            }));
            
            setRelatedBlogs(mappedRelated);
          }
        }
      } catch (error) {
        console.error('Error fetching related blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentBlogId || currentBlogSlug) {
      fetchRelatedBlogs();
    }
  }, [currentBlogId, currentBlogSlug]);

  return (
    <section className="flat-spacing">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="heading-section text-center">
              <h3>Related Articles</h3>
              <p className="body-text-1">
                Discover the Hottest Fashion News and Trends Straight from the
                Runway
              </p>
            </div>
            {loading ? (
              // Loading skeleton
              <div className="row">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="col-lg-4 col-md-6">
                    <div className="wg-blog style-1 hover-image">
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
                        <div className="bg-gray-200 animate-pulse h-4 w-full rounded mb-2"></div>
                        <div className="bg-gray-200 animate-pulse h-4 w-3/4 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : relatedBlogs.length > 0 ? (
              <Swiper
                dir="ltr"
                className="swiper tf-sw-recent"
                slidesPerView={3}
                spaceBetween={15}
                breakpoints={{
                  0: {
                    slidesPerView: 1,
                    spaceBetween: 15,
                  },
                  768: {
                    slidesPerView: 2,
                    spaceBetween: 15,
                  },
                  1024: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                  },
                }}
                pagination={{
                  clickable: true,
                  el: ".spd123",
                }}
                modules={[Pagination]}
              >
                {relatedBlogs.map((post, i) => (
                  <SwiperSlide key={post._id || i} className="swiper-slide">
                    <div className="wg-blog style-1 hover-image">
                      <div className="image">
                        {post.image ? (
                          <Image
                            className="lazyload"
                            alt={post.title}
                            src={post.image.startsWith('http') ? post.image : `http://localhost:5000${post.image}`}
                            width={615}
                            height={461}
                            onError={(e) => {
                              e.target.src = '/images/blog/blog-grid-1.jpg';
                            }}
                          />
                        ) : (
                          <Image
                            className="lazyload"
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
                              {post.date ? new Date(post.date).toLocaleDateString() : "No Date"}
                            </p>
                          </div>
                          <div className="meta-item gap-8">
                            <div className="icon">
                              <i className="icon-user" />
                            </div>
                            <p className="text-caption-1">
                              by{" "}
                              <a className="link" href="#">
                                {post.author || "Unknown Author"}
                              </a>
                            </p>
                          </div>
                        </div>
                        <div>
                          <h6 className="title fw-5">
                            <Link
                              className="link"
                              href={`/blog-detail/${post.slug || post._id}`}
                            >
                              {post.title || "No Title"}
                            </Link>
                          </h6>
                          <div className="body-text">
                            {post.description ? 
                              (post.description.length > 100 ? 
                                `${post.description.substring(0, 100)}...` : 
                                post.description
                              ) : 
                              'No description available'
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}

                <div className="sw-pagination-recent sw-dots type-circle d-flex justify-content-center spd123" />
              </Swiper>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No related articles found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
