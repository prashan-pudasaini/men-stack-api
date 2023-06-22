const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategoryModel = new Schema(
  {
    createdAt: {
      type: String,
      default: Date.now,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },

  { versionKey: false }
);

CategoryModel.post("save", function (error, doc, next) {
  const category = this;
  if (error.code === 11000) {
    next(
      new Error(
        `A category with the slug '${category.slug}' already exists. Please choose a different slug.`
      )
    );
  }
  if (error.errors.slug) {
    if (error.errors.slug.kind === "required") {
      next(new Error(`slug cannot be blank.`));
    }
  }
  if (error.errors.name) {
    if (error.errors.name.kind === "required") {
      next(new Error(`name cannot be blank.`));
    }
  } else {
    next();
  }
});

const Category = mongoose.model("Category", CategoryModel);
module.exports = Category;
