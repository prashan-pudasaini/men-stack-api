const Category = require("../models/Category");
const Post = require("../models/Post");
const { formatDate } = require("../utils/helper");

const createCategory = async (slug, name) => {
  const newCategory = new Category({
    slug: slug,
    name: name,
    createdAt: formatDate(),
  });
  await newCategory.save();
  return newCategory;
};

const readCategory = async (slug) => {
  const categoryDetail = await Category.findOne({
    slug: { $eq: slug },
  }).populate({
    path: "posts",
    select: "-_id -category",
    populate: [
      {
        path: "author",
        select:
          "-_id account.firstName account.lastName account.dateRegistered profile.jobTitle profile.bio profile.avatar",
      },
    ],
  });
  if (categoryDetail === null) {
    return null;
  }
  return categoryDetail;
};

const readAllCategories = async () => {
  const allCategories = await Category.find().populate({
    path: "posts",
    select: "",
    populate: [
      {
        path: "author",
        select:
          "-_id account.firstName account.lastName account.dateRegistered profile.jobTitle profile.bio profile.avatar",
      },
      {
        path: "category",
        select: "",
      },
    ],
  });
  return allCategories;
};

const updateCategory = async (id, newSlug, newName) => {
  const category = await Category.findById(id).populate({
    path: "posts",
    select: "-_id -category",
    populate: [
      {
        path: "author",
        select:
          "-_id account.firstName account.lastName account.dateRegistered profile.jobTitle profile.bio profile.avatar",
      },
    ],
  });

  category.slug = newSlug;
  category.name = newName;
  await category.save();
  return category;
};

const deleteCategories = async (categoriesId) => {
  const deletedCount = await Category.deleteMany({
    _id: { $in: categoriesId },
  });
  if (deletedCount) {
    return deletedCount;
  }
};

module.exports = {
  createCategory,
  readCategory,
  readAllCategories,
  updateCategory,
  deleteCategories,
};
