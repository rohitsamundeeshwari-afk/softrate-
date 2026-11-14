const store = require('../data/store');

// @desc Get all categories with post counts
// @route GET /api/categories
const getCategories = async (req, res) => {
  try {
    const categories = await store.getCategories();
    return res.json({ success: true, categories });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Create new category
// @route POST /api/categories
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }
    const category = await store.createCategory(req.body);
    return res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// @desc Update category
// @route PUT /api/categories/:id
const updateCategory = async (req, res) => {
  try {
    const updated = await store.updateCategory(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    return res.json({
      success: true,
      message: 'Category updated successfully',
      category: updated,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// @desc Delete category
// @route DELETE /api/categories/:id
const deleteCategory = async (req, res) => {
  try {
    const deleted = await store.deleteCategory(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    return res.json({
      success: true,
      message: 'Category deleted successfully',
      category: deleted,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
