const Post = require("../../models/instaPostModel");
const getInstagramProducts = async (req, res) => {
  try {
    const posts = await Post.find(
      {},
      {
        _id: 1,
        title: 1,
        instaLink: 1,
        imageLink: 1, 
      }
    ).limit(6);

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching Instagram products:", error);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  getInstagramProducts,
};