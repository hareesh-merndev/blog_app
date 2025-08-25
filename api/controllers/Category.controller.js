import mongoose from "mongoose";
import Category from "../models/category.model.js";

// Add a new category
export const addCategory = async (req, res, next) => {
  try {
    const { name, slug } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ success: false, message: "Name and slug are required." });
    }

    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return res.status(409).json({ success: false, message: "Category already exists." });
    }

    const category = new Category({ name, slug });
    await category.save();

    return res.status(201).json({
      success: true,
      message: "Category added successfully.",
      category
    });
  } catch (error) {
    console.error("Add Category Error:", error);
    // If it's a MongoDB connection error, give a clear message
    if (error.name === "MongooseServerSelectionError") {
      return res.status(500).json({ success: false, message: "Database connection error." });
    }
    return res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
  }
};

// Show details of a category
export const showCategory = async (req, res, next) => {
  try {
    const { categoryid } = req.params;
    if (!mongoose.Types.ObjectId.isValid(categoryid)) {
      return res.status(400).json({ success: false, message: "Invalid category ID." });
    }
    const category = await Category.findById(categoryid);
    if (!category) {
      return res.status(404).json({ success: false, message: "Data not found." });
    }
    res.status(200).json({ success: true, category });
  } catch (error) {
    console.error("Show Category Error:", error);
    if (error.name === "MongooseServerSelectionError") {
      return res.status(500).json({ success: false, message: "Database connection error." });
    }
    return res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
  }
};

// Update a category
export const updateCategory = async (req, res, next) => {
  try {
    const { name, slug } = req.body;
    const { categoryid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(categoryid)) {
      return res.status(400).json({ success: false, message: "Invalid category ID." });
    }

    if (!name || !slug) {
      return res.status(400).json({ success: false, message: "Name and slug are required." });
    }

    // Check for duplicate slug (excluding current category)
    const existingCategory = await Category.findOne({ slug, _id: { $ne: categoryid } });
    if (existingCategory) {
      return res.status(409).json({ success: false, message: "Slug already in use by another category." });
    }

    const category = await Category.findByIdAndUpdate(
      categoryid,
      { name, slug },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found." });
    }

    res.status(200).json({
      success: true,
      message: 'Category updated successfully.',
      category
    });
  } catch (error) {
    console.error("Update Category Error:", error);
    if (error.name === "MongooseServerSelectionError") {
      return res.status(500).json({ success: false, message: "Database connection error." });
    }
    return res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
  }
};

// Delete a category
export const deleteCategory = async (req, res, next) => {
  try {
    const { categoryid } = req.params;
    if (!mongoose.Types.ObjectId.isValid(categoryid)) {
      return res.status(400).json({ success: false, message: "Invalid category ID." });
    }
    const deleted = await Category.findByIdAndDelete(categoryid);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Category not found." });
    }
    res.status(200).json({
      success: true,
      message: 'Category deleted successfully.',
    });
  } catch (error) {
    console.error("Delete Category Error:", error);
    if (error.name === "MongooseServerSelectionError") {
      return res.status(500).json({ success: false, message: "Database connection error." });
    }
    return res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
  }
};

// Get all categories
export const getAllCategory = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 }).lean().exec();
    res.status(200).json({ success: true, categories });
  } catch (error) {
    console.error("Get All Categories Error:", error);
    return res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
  }
};