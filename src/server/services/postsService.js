const Post = require("../models/Post");
const Category = require("../models/Category");
const User = require("../models/User");
const { formatDate } = require("../utils/helper");

const createPost = async (
  author,
  slug,
  title,
  excerpt,
  body,
  readTime,
  category,
  status,
  visibility
) => {
  const formattedReadTime = readTime + " " + "min read";
  const selectCategory = await Category.findOne({
    name: { $eq: category },
  });
  if (selectCategory === null) {
    throw new Error(`Cateogory does not exist. Please create a new category.`);
  }
  const newPost = new Post({
    author: author,
    slug: slug,
    title: title,
    excerpt: excerpt,
    body: body,
    readTime: formattedReadTime,
    status: status,
    visibility: visibility,
    createdAt: formatDate(),
    category: selectCategory,
  });
  const user = await User.findById(author);
  user.posts = user.posts.concat(newPost._id);
  await user.save();
  selectCategory.posts = selectCategory.posts.concat(newPost._id);
  await selectCategory.save();
  await newPost.save();

  return newPost.populate([
    {
      path: "author",
      select:
        "-_id account.firstName account.lastName account.dateRegistered profile.jobTitle, profile.bio profile.avatar",
    },
    {
      path: "category",
      select: "-_id slug name",
    },
  ]);
};

const readAllPosts = async () => {
  const allPosts = await Post.find().populate([
    {
      path: "author",
      select:
        "-_id account.firstName account.lastName account.dateRegistered profile.jobTitle, profile.bio profile.avatar",
    },
    {
      path: "category",
      select: "-_id slug name",
    },
  ]);
  return allPosts;
};

const readPost = async (slug) => {
  const postDetail = await Post.findOne({
    slug: { $eq: slug },
  }).populate([
    {
      path: "author",
      select:
        "-_id account.firstName account.lastName account.dateRegistered profile.jobTitle profile.bio profile.avatar",
    },
    {
      path: "category",
      select: "-_id slug name",
    },
  ]);

  if (postDetail === null) {
    return null;
  }
  return postDetail;
};

const updatePost = async (
  id,
  title,
  slug,
  excerpt,
  body,
  readTime,
  category,
  status,
  visibility
) => {
  const post = await Post.findById(id).populate("category");
  const selectCategory = await Category.findOne({
    name: { $eq: category },
  }).populate("posts");
  if (selectCategory === null) {
    throw new Error(`Category does not exist. Please create a new category.`);
  }
  const oldCategory = await Category.findById(post.category._id).populate(
    "posts"
  );
  await oldCategory.posts.remove(id);
  await oldCategory.save();
  (post.title = title),
    (post.slug = slug),
    (post.excerpt = excerpt),
    (post.body = body),
    (post.readTime = readTime),
    (post.category = selectCategory._id),
    (post.status = status),
    (post.visibility = visibility);
  await post.save();
  const newCategory = await Category.findOneAndUpdate(
    { _id: post.category._id },
    { $push: { posts: post } },
    { upsert: true }
  );
  return post.populate([
    {
      path: "author",
      select:
        "-_id account.firstName account.lastName account.dateRegistered profile.jobTitle profile.bio profile.avatar",
    },
    {
      path: "category",
      select: "-_id slug name",
    },
  ]);
};

const deletePosts = async (id) => {
  const post = await Post.findByIdAndDelete(id);
  const user = await User.findById(post.author);
  user.posts = await user.posts.remove(post._id);
  await user.save();
  const category = await Category.findById(post.category);
  category.posts = await category.posts.remove(post._id);
  await category.save();
};

module.exports = {
  createPost,
  readAllPosts,
  readPost,
  updatePost,
  deletePosts,
};
