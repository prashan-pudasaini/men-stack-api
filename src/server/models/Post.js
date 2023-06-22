const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostModel = new Schema(
  {
    createdAt: {
      type: String,
      default: Date.now,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    readTime: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "Draft",
      enum: ["Draft", "Published"],
      required: true,
    },
    visibility: {
      type: String,
      default: "Private",
      enum: ["Private", "Public"],
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { versionKey: false }
);

PostModel.post("save", function (error, doc, next) {
  const post = this;
  if (error.code === 11000) {
    next(
      new Error(
        `A post with the slug '${post.slug}' already exists. Please choose a different slug.`
      )
    );
  }
  if (error.errors.slug) {
    if (error.errors.slug.kind === "required") {
      next(new Error(`slug cannot be blank.`));
    }
  }
  if (error.errors.title) {
    if (error.errors.title.kind === "required") {
      next(new Error(`title cannot be blank.`));
    }
  }
  if (error.errors.excerpt) {
    if (error.errors.excerpt.kind === "required") {
      next(new Error(`excerpt cannot be blank.`));
    }
  }
  if (error.errors.body) {
    if (error.errors.body.kind === "required") {
      next(new Error(`body cannot be blank.`));
    }
  }
  if (error.errors.readTime) {
    if (error.errors.readTime.kind === "required") {
      next(new Error(`readTime cannot be blank.`));
    }
  }
  if (error.errors.status) {
    if (error.errors.status.kind === "required") {
      next(new Error(`status cannot be blank.`));
    }
  }
  if (error.errors.status) {
    if (error.errors.status.kind === "enum") {
      next(
        new Error(`status can only be assigned as either Draft or Published.`)
      );
    }
  }
  if (error.errors.visibility) {
    if (error.errors.visibility.kind === "required") {
      next(new Error(`visibility cannot be blank.`));
    }
  }
  if (error.errors.visibility) {
    if (error.errors.visibility.kind === "enum") {
      next(
        new Error(
          `visibility can only be assigned as either Public or Private.`
        )
      );
    }
  } else {
    next();
  }
});

const Post = mongoose.model("Post", PostModel);
module.exports = Post;
