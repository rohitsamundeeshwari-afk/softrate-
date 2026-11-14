const store = require('../data/store');

// @desc Get all posts (with search, category filter, pagination)
// @route GET /api/posts
const getPosts = async (req, res) => {
  try {
    const { search, category, tag, page = 1, limit = 12, publishedOnly } = req.query;
    // By default for public API, only return published posts unless explicitly asking or admin
    const isPublic = publishedOnly !== 'false';
    const result = await store.getPosts({
      search,
      category,
      tag,
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 12,
      publishedOnly: isPublic,
    });
    return res.json({ success: true, ...result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get single post by ID or Slug
// @route GET /api/posts/:idOrSlug
const getPost = async (req, res) => {
  try {
    const post = await store.getPostByIdOrSlug(req.params.idOrSlug);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }
    return res.json({ success: true, post });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Create new blog post
// @route POST /api/posts
const createPost = async (req, res) => {
  try {
    const { title, summary, content, category } = req.body;
    if (!title || !summary || !content || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title, summary, content, and category are required',
      });
    }

    const post = await store.createPost(req.body);
    return res.status(201).json({
      success: true,
      message: 'Article created successfully',
      post,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// @desc Update existing blog post
// @route PUT /api/posts/:id
const updatePost = async (req, res) => {
  try {
    const updated = await store.updatePost(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }
    return res.json({
      success: true,
      message: 'Article updated successfully',
      post: updated,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// @desc Delete blog post
// @route DELETE /api/posts/:id
const deletePost = async (req, res) => {
  try {
    const deleted = await store.deletePost(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }
    return res.json({
      success: true,
      message: 'Article deleted successfully',
      post: deleted,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get CMS stats overview
// @route GET /api/stats
const getStats = async (req, res) => {
  try {
    const stats = await store.getStats();
    return res.json({ success: true, stats });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  getStats,
};
