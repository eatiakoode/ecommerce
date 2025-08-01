const Blog = require("../../models/blogModel");
const asyncHandler = require("express-async-handler");

const getAllBlogs = asyncHandler(async (req, res) => {
  try {
    const blogs = await Blog.find({})
      .select("title description author createdAt link images slug")
      .sort({ createdAt: -1 });

    const formatted = blogs.map((blog) => ({
      _id: blog._id,
      title: blog.title,
      description: blog.description,
      author: blog.author,
      date: blog.createdAt,
      link: blog.link,
      image: blog.images?.[0]?.url || null,
      slug: blog.slug,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const getSingleBlogBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const blog = await Blog.findOne({ slug })
    .populate("category", "title") 
    .select("title description createdAt author images category");

  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }

  res.status(200).json({
    category: blog.category?.title || null,
    title: blog.title,
    description: blog.description,
    date: blog.createdAt.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    author: blog.author,
    images: blog.images,
    slug: blog.slug,
  });
});

const getRelatedBlogs = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const currentBlog = await Blog.findOne({ slug });

  if (!currentBlog) {
    return res.status(404).json({ message: "Blog not found" });
  }

  const relatedBlogs = await Blog.find({
    _id: { $ne: currentBlog._id },
    category: currentBlog.category,
  })
    .limit(3)
    .select("title description images author createdAt slug")
    .populate("category", "title");

  const formatted = relatedBlogs.map((blog) => ({
    _id: blog._id,
    title: blog.title,
    description: blog.description,
    author: blog.author,
    date: blog.createdAt,
    image: blog.images?.[0]?.url || null,
    slug: blog.slug,
  }));

  res.status(200).json(formatted);
});


module.exports = { getAllBlogs, getSingleBlogBySlug, getRelatedBlogs };
