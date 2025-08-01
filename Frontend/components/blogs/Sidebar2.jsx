import Link from "next/link";
import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function Sidebar2() {
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/frontend/blog/list');
        if (response.ok) {
          const data = await response.json();
          setRecentPosts(data.slice(0, 5)); // Get first 5 posts
        }
      } catch (error) {
        console.error('Error fetching recent posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentPosts();
  }, []);

  return (
    <div className="sidebar maxw-360">
      <div className="sidebar-item sidebar-writer">
        <div className="writer-avatar">
          <div className="image">
            <Image
              alt=""
              src="/images/avatar/user-3.jpg"
              width={91}
              height={113}
            />
          </div>
          <div>
            <div className="name">
              <h6>
                <a className="link" href="#">
                  Shara Miller
                </a>
              </h6>
              <p className="text-caption-1">200 Follower</p>
            </div>
            <a href="#" className="button-follow text-btn-uppercase link">
              Follow
            </a>
          </div>
        </div>
        <div className="writer-content">
          <p>
            Jessie Nguyen (@Jessie_ng) is a writer who draws. He's the
            Bestselling author of "Number of The Year". Donec vitae tortor
            efficitur, convallis lelobortis elit.
          </p>
          <ul className="tf-social-icon">
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
              <a href="#" className="social-instagram">
                <i className="icon icon-instagram" />
              </a>
            </li>
            <li>
              <a href="#" className="social-tiktok">
                <i className="icon icon-tiktok" />
              </a>
            </li>
            <li>
              <a href="#" className="social-amazon">
                <i className="icon icon-amazon" />
              </a>
            </li>
            <li>
              <a href="#" className="social-pinterest">
                <i className="icon icon-pinterest" />
              </a>
            </li>
          </ul>
        </div>
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
    </div>
  );
}
