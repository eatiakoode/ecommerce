"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function Sidebar() {
  const [categories, setCategories] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch categories
        const categoriesResponse = await fetch('http://localhost:5000/api/blogcategory');
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          setCategories(categoriesData);
        }

        // Fetch recent posts
        const postsResponse = await fetch('http://localhost:5000/api/frontend/blog/list');
        if (postsResponse.ok) {
          const postsData = await postsResponse.json();
          setRecentPosts(postsData.slice(0, 5)); // Get first 5 posts
        }
      } catch (error) {
        console.error('Error fetching sidebar data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="sidebar maxw-360">
      <div className="sidebar-item sidebar-search">
        <form className="form-search" onSubmit={(e) => e.preventDefault()} suppressHydrationWarning>
          <fieldset className="text">
            <input
              type="email"
              placeholder="Your email address"
              className=""
              name="email"
              tabIndex={0}
              defaultValue=""
              aria-required="true"
              required
              suppressHydrationWarning
            />
          </fieldset>
          <button className="" type="submit" suppressHydrationWarning>
            <svg
              className="icon"
              width={20}
              height={20}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
                stroke="#181818"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21.35 21.0004L17 16.6504"
                stroke="#181818"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </form>
      </div>
      <div className="sidebar-item sidebar-relatest-post">
        <h5 className="sidebar-heading">Recent Posts</h5>
        <div>
          {loading ? (
            // Loading skeleton
            [...Array(3)].map((_, i) => (
              <div key={i} className="relatest-post-item style-row hover-image">
                <div className="image">
                  <div className="bg-gray-200 animate-pulse" style={{ width: 540, height: 360 }}></div>
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
            ))
          ) : (
            recentPosts.map((post, i) => (
              <div
                key={post._id || i}
                className={`relatest-post-item ${
                  i != 0 ? "style-row" : ""
                } hover-image `}
              >
                <div className="image">
                  {post.image ? (
                    <Image
                      className="lazyload"
                      alt={post.title}
                      src={post.image.startsWith('http') ? post.image : `http://localhost:5000${post.image}`}
                      width={540}
                      height={360}
                      onError={(e) => {
                        e.target.src = '/images/blog/blog-grid-1.jpg';
                      }}
                    />
                  ) : (
                    <Image
                      className="lazyload"
                      alt="Default blog image"
                      src="/images/blog/blog-grid-1.jpg"
                      width={540}
                      height={360}
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
                  <h6 className="title fw-5">
                    <Link className="link" href={`/blog-detail/${post.slug || post._id}`}>
                      {post.title || "No Title"}
                    </Link>
                  </h6>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="sidebar-item sidebar-categories">
        <h5 className="sidebar-heading">Categories</h5>
        <ul>
          {loading ? (
            // Loading skeleton for categories
            [...Array(5)].map((_, i) => (
              <li key={i}>
                <div className="bg-gray-200 animate-pulse h-4 w-20 rounded"></div>
              </li>
            ))
          ) : (
            categories.map((category) => (
              <li key={category._id}>
                <a className="text-button link" href="#">
                  {category.title || category.name}
                </a>
              </li>
            ))
          )}
        </ul>
      </div>
      <div className="sidebar-item sidebar-tag">
        <h5 className="sidebar-heading">Popular Tag</h5>
        <ul className="list-tags">
          {loading ? (
            // Loading skeleton for tags
            [...Array(8)].map((_, i) => (
              <li key={i}>
                <div className="bg-gray-200 animate-pulse h-4 w-24 rounded"></div>
              </li>
            ))
          ) : (
            categories.slice(0, 8).map((category) => (
              <li key={category._id}>
                <a href="#" className="text-caption-1 link">
                  {category.title || category.name}
                </a>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
