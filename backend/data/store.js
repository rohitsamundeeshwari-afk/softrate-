const fs = require('fs');
const path = require('path');
const Post = require('../models/Post');
const Category = require('../models/Category');
const { isMongoConnected } = require('../config/db');
const { initialCategories, initialPosts } = require('./initialData');

const dataDir = path.join(__dirname, 'storage');
const postsFilePath = path.join(dataDir, 'posts.json');
const categoriesFilePath = path.join(dataDir, 'categories.json');

// Ensure local storage directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Helper to read local JSON
function readLocal(filePath, defaultData) {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), 'utf-8');
      return defaultData;
    }
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err.message);
    return defaultData;
  }
}

// Helper to write local JSON
function writeLocal(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err.message);
  }
}

// Initialize seed data in Mongo if connected, or into local JSON
async function initStore() {
  if (isMongoConnected()) {
    try {
      const catCount = await Category.countDocuments();
      if (catCount === 0) {
        console.log('Seeding initial categories into MongoDB...');
        for (const cat of initialCategories) {
          const { _id, ...rest } = cat;
          await Category.create(rest);
        }
      }
      const postCount = await Post.countDocuments();
      if (postCount === 0) {
        console.log('Seeding initial blog posts into MongoDB...');
        for (const p of initialPosts) {
          const { _id, ...rest } = p;
          await Post.create(rest);
        }
      }
    } catch (e) {
      console.warn('Could not auto-seed MongoDB:', e.message);
    }
  } else {
    // Seed local JSON if empty
    readLocal(categoriesFilePath, initialCategories);
    readLocal(postsFilePath, initialPosts);
  }
}

// Helper slug generator
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

// POST OPERATIONS
async function getPosts({ search = '', category = '', tag = '', page = 1, limit = 10, publishedOnly = false }) {
  if (isMongoConnected()) {
    const query = {};
    if (publishedOnly) query.published = true;
    if (category && category !== 'all') {
      query.$or = [{ category: new RegExp(`^${category}$`, 'i') }, { categorySlug: category.toLowerCase() }];
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { summary: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }
    if (tag) {
      query.tags = { $in: [tag] };
    }

    const skip = (page - 1) * limit;
    const [posts, total] = await Promise.all([
      Post.find(query).sort({ featured: -1, createdAt: -1 }).skip(skip).limit(Number(limit)),
      Post.countDocuments(query),
    ]);

    return {
      posts,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit) || 1,
    };
  } else {
    // Local JSON
    let posts = readLocal(postsFilePath, initialPosts);
    if (publishedOnly) {
      posts = posts.filter((p) => p.published !== false);
    }
    if (category && category !== 'all') {
      const catLower = category.toLowerCase();
      posts = posts.filter(
        (p) =>
          (p.category && p.category.toLowerCase() === catLower) ||
          (p.categorySlug && p.categorySlug.toLowerCase() === catLower)
      );
    }
    if (search) {
      const q = search.toLowerCase();
      posts = posts.filter(
        (p) =>
          (p.title && p.title.toLowerCase().includes(q)) ||
          (p.summary && p.summary.toLowerCase().includes(q)) ||
          (p.content && p.content.toLowerCase().includes(q)) ||
          (p.author && p.author.toLowerCase().includes(q)) ||
          (p.category && p.category.toLowerCase().includes(q))
      );
    }
    if (tag) {
      posts = posts.filter((p) => p.tags && p.tags.includes(tag));
    }

    // Sort by featured then date desc
    posts.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    const total = posts.length;
    const startIndex = (page - 1) * limit;
    const paginated = posts.slice(startIndex, startIndex + Number(limit));

    return {
      posts: paginated,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit) || 1,
    };
  }
}

async function getPostByIdOrSlug(idOrSlug) {
  if (isMongoConnected()) {
    let post = null;
    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      post = await Post.findById(idOrSlug);
    }
    if (!post) {
      post = await Post.findOne({ slug: idOrSlug });
    }
    if (post) {
      post.views = (post.views || 0) + 1;
      await post.save();
    }
    return post;
  } else {
    const posts = readLocal(postsFilePath, initialPosts);
    const index = posts.findIndex((p) => p._id === idOrSlug || p.slug === idOrSlug);
    if (index === -1) return null;
    posts[index].views = (posts[index].views || 0) + 1;
    writeLocal(postsFilePath, posts);
    return posts[index];
  }
}

async function createPost(postData) {
  const slug = postData.slug ? generateSlug(postData.slug) : generateSlug(postData.title);
  const categorySlug = generateSlug(postData.category || 'General');
  const wordCount = (postData.content || '').split(/\s+/).length;
  const readTime = postData.readTime || Math.max(1, Math.ceil(wordCount / 200));

  if (isMongoConnected()) {
    return await Post.create({
      ...postData,
      slug,
      categorySlug,
      readTime,
    });
  } else {
    const posts = readLocal(postsFilePath, initialPosts);
    const newPost = {
      _id: 'post-' + Date.now(),
      ...postData,
      slug,
      categorySlug,
      readTime,
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    posts.unshift(newPost);
    writeLocal(postsFilePath, posts);
    return newPost;
  }
}

async function updatePost(id, postData) {
  if (postData.title && !postData.slug) {
    postData.slug = generateSlug(postData.title);
  }
  if (postData.category) {
    postData.categorySlug = generateSlug(postData.category);
  }
  if (postData.content && !postData.readTime) {
    const wordCount = postData.content.split(/\s+/).length;
    postData.readTime = Math.max(1, Math.ceil(wordCount / 200));
  }

  if (isMongoConnected()) {
    return await Post.findByIdAndUpdate(id, { ...postData, updatedAt: new Date() }, { new: true });
  } else {
    const posts = readLocal(postsFilePath, initialPosts);
    const index = posts.findIndex((p) => p._id === id || p.slug === id);
    if (index === -1) return null;
    const updated = {
      ...posts[index],
      ...postData,
      updatedAt: new Date().toISOString(),
    };
    posts[index] = updated;
    writeLocal(postsFilePath, posts);
    return updated;
  }
}

async function deletePost(id) {
  if (isMongoConnected()) {
    return await Post.findByIdAndDelete(id);
  } else {
    const posts = readLocal(postsFilePath, initialPosts);
    const index = posts.findIndex((p) => p._id === id || p.slug === id);
    if (index === -1) return null;
    const removed = posts.splice(index, 1)[0];
    writeLocal(postsFilePath, posts);
    return removed;
  }
}

// CATEGORY OPERATIONS
async function getCategories() {
  if (isMongoConnected()) {
    const [categories, posts] = await Promise.all([
      Category.find().sort({ name: 1 }),
      Post.find({}, 'category'),
    ]);
    // Count posts per category
    const countMap = {};
    posts.forEach((p) => {
      countMap[p.category] = (countMap[p.category] || 0) + 1;
    });
    return categories.map((c) => ({
      ...c.toObject(),
      postCount: countMap[c.name] || 0,
    }));
  } else {
    const categories = readLocal(categoriesFilePath, initialCategories);
    const posts = readLocal(postsFilePath, initialPosts);
    const countMap = {};
    posts.forEach((p) => {
      countMap[p.category] = (countMap[p.category] || 0) + 1;
    });
    return categories.map((c) => ({
      ...c,
      postCount: countMap[c.name] || 0,
    }));
  }
}

async function createCategory(catData) {
  const slug = catData.slug ? generateSlug(catData.slug) : generateSlug(catData.name);
  if (isMongoConnected()) {
    return await Category.create({ ...catData, slug });
  } else {
    const categories = readLocal(categoriesFilePath, initialCategories);
    const newCat = {
      _id: 'cat-' + Date.now(),
      ...catData,
      slug,
      createdAt: new Date().toISOString(),
    };
    categories.push(newCat);
    writeLocal(categoriesFilePath, categories);
    return newCat;
  }
}

async function updateCategory(id, catData) {
  if (catData.name && !catData.slug) {
    catData.slug = generateSlug(catData.name);
  }
  if (isMongoConnected()) {
    return await Category.findByIdAndUpdate(id, catData, { new: true });
  } else {
    const categories = readLocal(categoriesFilePath, initialCategories);
    const index = categories.findIndex((c) => c._id === id || c.slug === id);
    if (index === -1) return null;
    const oldName = categories[index].name;
    const updated = { ...categories[index], ...catData };
    categories[index] = updated;
    writeLocal(categoriesFilePath, categories);

    // If category name changed, update corresponding posts
    if (catData.name && catData.name !== oldName) {
      const posts = readLocal(postsFilePath, initialPosts);
      posts.forEach((p) => {
        if (p.category === oldName) {
          p.category = catData.name;
          p.categorySlug = updated.slug;
        }
      });
      writeLocal(postsFilePath, posts);
    }
    return updated;
  }
}

async function deleteCategory(id) {
  if (isMongoConnected()) {
    return await Category.findByIdAndDelete(id);
  } else {
    const categories = readLocal(categoriesFilePath, initialCategories);
    const index = categories.findIndex((c) => c._id === id || c.slug === id);
    if (index === -1) return null;
    const removed = categories.splice(index, 1)[0];
    writeLocal(categoriesFilePath, categories);
    return removed;
  }
}

// DASHBOARD STATS
async function getStats() {
  if (isMongoConnected()) {
    const [totalPosts, publishedPosts, totalCategories, allPosts] = await Promise.all([
      Post.countDocuments(),
      Post.countDocuments({ published: true }),
      Category.countDocuments(),
      Post.find({}, 'views'),
    ]);
    const totalViews = allPosts.reduce((acc, curr) => acc + (curr.views || 0), 0);
    return {
      totalPosts,
      publishedPosts,
      draftPosts: totalPosts - publishedPosts,
      totalCategories,
      totalViews,
    };
  } else {
    const posts = readLocal(postsFilePath, initialPosts);
    const categories = readLocal(categoriesFilePath, initialCategories);
    const totalPosts = posts.length;
    const publishedPosts = posts.filter((p) => p.published !== false).length;
    const totalViews = posts.reduce((acc, p) => acc + (p.views || 0), 0);
    return {
      totalPosts,
      publishedPosts,
      draftPosts: totalPosts - publishedPosts,
      totalCategories: categories.length,
      totalViews,
    };
  }
}

module.exports = {
  initStore,
  getPosts,
  getPostByIdOrSlug,
  createPost,
  updatePost,
  deletePost,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getStats,
};
