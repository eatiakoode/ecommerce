"use client";
import { useEffect, useState } from "react";
import InstaPostsTable from "./_components/insta-posts-table";
import axiosInstance from "@/helpers/axiosInstance";

// Define InstaPost type inline for this file
interface InstaPost {
  _id: string;
  title: string;
  imageLink: string;
  instaLink: string;
  SKU: string;
  status: string;
}

export default function InstaPostsPage() {
  const [posts, setPosts] = useState<InstaPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    setLoading(true);
    axiosInstance.get("/instapost")
      .then(res => {
        setPosts(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load posts");
        setLoading(false);
      });
  }, []);

  // Filter posts by title only
  const filteredPosts = posts.filter(p => {
    return p.title.toLowerCase().includes(filter.toLowerCase());
  });

  return (
    <div className="p-4">
      <InstaPostsTable
        posts={filteredPosts}
        loading={loading}
        error={error}
        onRefresh={async () => {
          setLoading(true);
          try {
            const res = await axiosInstance.get("/instapost");
            setPosts(res.data);
          } catch {
            setError("Failed to load posts");
          } finally {
            setLoading(false);
          }
        }}
        setPosts={setPosts}
      />
    </div>
  );
}
