// const Blog = require("../models/blogModel");
// const User = require("../models/userModel");
// const asyncHandler = require("express-async-handler");
// const validateMongoDbId = require("../utils/validateMongodbId");
// const cloudinaryUploadImg = require("../utils/cloudinary");
// const fs = require("fs");
// const slugify = require("slugify");

// const createBlog = asyncHandler(async (req, res) => {
//   try {
//     const {
//       title,
//       description,
//       category,
//       link,
//       author,
//     } = req.body;

//     const files = req.files || [];

//     const images = files.map((file) => ({
//       public_id: file.filename,
//       url: `/public/uploads/${file.filename}`,
//     }));

//     const blog = await Blog.create({
//       title,
//       description,
//       category,
//       link, 
//       slug: slugify(title, { lower: true, strict: true }),
//       author: author || "Admin",
//       images,
//     });

//     res.status(201).json(blog);
//   } catch (error) {
//     res.status(400);
//     throw new Error(error.message);
//   }
// });

// const updateBlog = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   validateMongoDbId(id);
//   try {
//     const updateBlog = await Blog.findByIdAndUpdate(id, req.body, {
//       new: true,
//     });
//     res.json(updateBlog);
//   } catch (error) {
//     throw new Error(error);
//   }
// });

// const getBlog = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   validateMongoDbId(id);
//   try {
//     const getBlog = await Blog.findById(id)
//       .populate("likes")
//       .populate("dislikes");
//     const updateViews = await Blog.findByIdAndUpdate(
//       id,
//       {
//         $inc: { numViews: 1 },
//       },
//       { new: true }
//     );
//     res.json(getBlog);
//   } catch (error) {
//     throw new Error(error);
//   }
// });
// const getAllBlogs = asyncHandler(async (req, res) => {
//   try {
//     const getBlogs = await Blog.find().populate("category");
//     res.json(getBlogs);
//   } catch (error) {
//     throw new Error(error);
//   }
// });

// const deleteBlog = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   validateMongoDbId(id);
//   try {
//     const deletedBlog = await Blog.findByIdAndDelete(id);
//     res.json(deletedBlog);
//   } catch (error) {
//     throw new Error(error);
//   }
// });

// const liketheBlog = asyncHandler(async (req, res) => {
//   const { blogId } = req.body;
//   validateMongoDbId(blogId);
//   // Find the blog which you want to be liked
//   const blog = await Blog.findById(blogId);
//   // find the login user
//   const loginUserId = req?.user?._id;
//   // find if the user has liked the blog
//   const isLiked = blog?.isLiked;
//   // find if the user has disliked the blog
//   const alreadyDisliked = blog?.dislikes?.find(
//     (userId) => userId?.toString() === loginUserId?.toString()
//   );
//   if (alreadyDisliked) {
//     const blog = await Blog.findByIdAndUpdate(
//       blogId,
//       {
//         $pull: { dislikes: loginUserId },
//         isDisliked: false,
//       },
//       { new: true }
//     );
//     res.json(blog);
//   }
//   if (isLiked) {
//     const blog = await Blog.findByIdAndUpdate(
//       blogId,
//       {
//         $pull: { likes: loginUserId },
//         isLiked: false,
//       },
//       { new: true }
//     );
//     res.json(blog);
//   } else {
//     const blog = await Blog.findByIdAndUpdate(
//       blogId,
//       {
//         $push: { likes: loginUserId },
//         isLiked: true,
//       },
//       { new: true }
//     );
//     res.json(blog);
//   }
// });
// const disliketheBlog = asyncHandler(async (req, res) => {
//   const { blogId } = req.body;
//   validateMongoDbId(blogId);
//   // Find the blog which you want to be liked
//   const blog = await Blog.findById(blogId);
//   // find the login user
//   const loginUserId = req?.user?._id;
//   // find if the user has liked the blog
//   const isDisLiked = blog?.isDisliked;
//   // find if the user has disliked the blog
//   const alreadyLiked = blog?.likes?.find(
//     (userId) => userId?.toString() === loginUserId?.toString()
//   );
//   if (alreadyLiked) {
//     const blog = await Blog.findByIdAndUpdate(
//       blogId,
//       {
//         $pull: { likes: loginUserId },
//         isLiked: false,
//       },
//       { new: true }
//     );
//     res.json(blog);
//   }
//   if (isDisLiked) {
//     const blog = await Blog.findByIdAndUpdate(
//       blogId,
//       {
//         $pull: { dislikes: loginUserId },
//         isDisliked: false,
//       },
//       { new: true }
//     );
//     res.json(blog);
//   } else {
//     const blog = await Blog.findByIdAndUpdate(
//       blogId,
//       {
//         $push: { dislikes: loginUserId },
//         isDisliked: true,
//       },
//       { new: true }
//     );
//     res.json(blog);
//   }
// });

// const uploadImages = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   validateMongoDbId(id);
//   try {
//     const uploader = (path) => cloudinaryUploadImg(path, "images");
//     const urls = [];
//     const files = req.files;
//     for (const file of files) {
//       const { path } = file;
//       const newpath = await uploader(path);
//       console.log(newpath);
//       urls.push(newpath);
//       // fs.unlinkSync(path);
//     }
//     const findBlog = await Blog.findByIdAndUpdate(
//       id,
//       {
//         images: urls.map((file) => {
//           return file;
//         }),
//       },
//       {
//         new: true,
//       }
//     );
//     res.json(findBlog);
//   } catch (error) {
//     throw new Error(error);
//   }
// });

// module.exports = {
//   createBlog,
//   updateBlog,
//   getBlog,
//   getAllBlogs,
//   deleteBlog,
//   liketheBlog,
//   disliketheBlog,
//   uploadImages,
// };

const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const cloudinaryUploadImg = require("../utils/cloudinary");
const fs = require("fs");
const slugify = require("slugify");

const createBlog = asyncHandler(async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      date,
      author,
    } = req.body;

    const files = req.files || [];

    const images = files.map((file) => ({
      public_id: file.filename,
      url: `/public/uploads/${file.filename}`,
    }));

    const blog = await Blog.create({
      title,
      description,
      category,
      date, // new date field from admin
      slug: slugify(title, { lower: true, strict: true }),
      author, // taken from admin input only
      images,
    });

    res.status(201).json(blog);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedBlog);
  } catch (error) {
    throw new Error(error);
  }
});

const getBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getBlog = await Blog.findById(id)
      .populate("likes")
      .populate("dislikes");
    await Blog.findByIdAndUpdate(
      id,
      {
        $inc: { numViews: 1 },
      },
      { new: true }
    );
    res.json(getBlog);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllBlogs = asyncHandler(async (req, res) => {
  try {
    const getBlogs = await Blog.find().populate("category");
    res.json(getBlogs);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deletedBlog = await Blog.findByIdAndDelete(id);
    res.json(deletedBlog);
  } catch (error) {
    throw new Error(error);
  }
});

const liketheBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  validateMongoDbId(blogId);
  const blog = await Blog.findById(blogId);
  const loginUserId = req?.user?._id;

  const isLiked = blog?.isLiked;
  const alreadyDisliked = blog?.dislikes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );

  if (alreadyDisliked) {
    await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      { new: true }
    );
  }

  if (isLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    res.json(blog);
  } else {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { likes: loginUserId },
        isLiked: true,
      },
      { new: true }
    );
    res.json(blog);
  }
});

const disliketheBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  validateMongoDbId(blogId);
  const blog = await Blog.findById(blogId);
  const loginUserId = req?.user?._id;

  const isDisLiked = blog?.isDisliked;
  const alreadyLiked = blog?.likes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );

  if (alreadyLiked) {
    await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
  }

  if (isDisLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      { new: true }
    );
    res.json(blog);
  } else {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { dislikes: loginUserId },
        isDisliked: true,
      },
      { new: true }
    );
    res.json(blog);
  }
});

const uploadImages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const uploader = (path) => cloudinaryUploadImg(path, "images");
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newpath = await uploader(path);
      urls.push(newpath);
      // fs.unlinkSync(path);
    }
    const findBlog = await Blog.findByIdAndUpdate(
      id,
      {
        images: urls.map((file) => {
          return file;
        }),
      },
      {
        new: true,
      }
    );
    res.json(findBlog);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createBlog,
  updateBlog,
  getBlog,
  getAllBlogs,
  deleteBlog,
  liketheBlog,
  disliketheBlog,
  uploadImages,
};
