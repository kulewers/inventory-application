const Category = require("../models/category");
const Tea = require("../models/tea");
const { body, validationResult } = require("express-validator");

const asyncHandler = require("express-async-handler");

exports.category_list = asyncHandler(async (req, res, next) => {
    const allCategories = await Category.find({}, "name")
        .sort({ name: 1 })
        .exec();

    res.render("category_list", {
        title: "Category List",
        category_list: allCategories,
    });
});

exports.category_detail = asyncHandler(async (req, res, next) => {
    const category = await Category.findOne({
        name: req.params.category,
    }).exec();

    const teaInCategory = await Tea.find(
        { category: category },
        "name numberInStock description"
    );

    console.log(teaInCategory);

    if (category === null) {
        const err = new Error("Category not found");
        err.status = 404;
        return next(err);
    }

    res.render("category_detail", {
        title: "Category Detail",
        category: category,
        category_tea: teaInCategory,
    });
});

exports.category_create_get = asyncHandler(async (req, res, next) => {
    res.render("category_form", { title: "Create Category" });
});

exports.category_create_post = [
    body("name", "Category must contain at least 3 characters")
        .trim()
        .isLength({ min: 3 })
        .escape(),
    body("description", "Description must not be empty")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const category = new Category({
            name: req.body.name,
            description: req.body.description,
        });

        if (!errors.isEmpty()) {
            res.render("category_form", {
                title: "Create category",
                category: category,
                errors: errors.array(),
            });
            return;
        } else {
            const categoryExists = await Category.findOne({
                name: req.body.name,
            }).exec();

            if (categoryExists) {
                res.redirect(categoryExists.url);
            } else {
                await category.save();

                res.redirect(category.url);
            }
        }
    }),
];

exports.category_delete_get = asyncHandler(async (req, res, next) => {
    const category = await Category.findOne({
        name: req.params.category,
    }).exec();

    const allTeaByCategory = await Tea.find(
        { category: category._id },
        "name description"
    ).exec();

    if (category === null) {
        res.redirect("/categories");
    }

    res.render("category_delete", {
        title: "Delete Category",
        category: category,
        category_tea: allTeaByCategory,
    });
});

exports.category_delete_post = asyncHandler(async (req, res, next) => {
    const category = await Category.findOne({
        name: req.params.category,
    }).exec();

    const allTeaByCategory = await Tea.find(
        { category: category._id },
        "name description"
    ).exec();

    if (allTeaByCategory.length > 0) {
        res.render("category_delete", {
            title: "Delete Category",
            category: category,
            category_tea: allTeaByCategory,
        });
        return;
    } else {
        await Category.findByIdAndRemove(req.body.categoryid);
        res.redirect("/categories");
    }
});

exports.category_update_get = asyncHandler(async (req, res, next) => {
    const category = await Category.findOne({
        name: req.params.category,
    }).exec();

    if (category === null) {
        const err = new Error("Category not found");
        err.status = 404;
        return next(err);
    }

    res.render("category_form", {
        title: "Update Category",
        category: category,
    });
});
exports.category_update_post = [
    body("name", "Category must contain at least 3 characters")
        .trim()
        .isLength({ min: 3 })
        .escape(),
    body("description", "Description must not be empty")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const oldCategory = await Category.findOne({
            name: req.params.category,
        }).exec();

        const category = new Category({
            name: req.body.name,
            description: req.body.description,
            _id: oldCategory._id,
        });

        if (!errors.isEmpty()) {
            res.render("category_form", {
                title: "Update Category",
                category: category,
                errors: errors.array(),
            });
            return;
        } else {
            await Category.findByIdAndUpdate(oldCategory._id, category, {});

            res.redirect(category.url);
        }
    }),
];
