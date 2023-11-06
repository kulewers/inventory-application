const Tea = require("../models/tea");
const Category = require("../models/category");
const { body, validationResult } = require("express-validator");

const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
    const [numTea, numTeaInStock, numCategories] = await Promise.all([
        Tea.countDocuments({}).exec(),
        Tea.countDocuments({ numberInStock: { $gte: 0 } }).exec(),
        Category.countDocuments({}).exec(),
    ]);

    res.render("index", {
        title: "Tea Inventory Home",
        tea_count: numTea,
        tea_in_stock_count: numTeaInStock,
        tea_out_of_stock_count: numTea - numTeaInStock,
        category_count: numCategories,
    });
});

exports.tea_list = asyncHandler(async (req, res, next) => {
    const allTea = await Tea.find({}, "name numberInStock")
        .sort({ name: 1 })
        .exec();

    res.render("tea_list", { title: "Tea List", tea_list: allTea });
});

exports.tea_detail = asyncHandler(async (req, res, next) => {
    const tea = await Tea.findOne({ name: req.params.tea })
        .populate("category")
        .exec();

    if (tea === null) {
        const err = new Error("tea not found");
        err.status = 404;
        return next(err);
    }

    res.render("tea_detail", { title: "Tea Detail", tea: tea });
});

exports.tea_create_get = asyncHandler(async (req, res, next) => {
    const allCategories = await Category.find().exec();

    res.render("tea_form", { title: "Create Tea", categories: allCategories });
});

exports.tea_create_post = [
    (req, res, next) => {
        if (!(req.body.category instanceof Array)) {
            if (typeof req.body.category === "undefined")
                req.body.category = [];
            else req.body.category = new Array(req.body.category);
        }
        next();
    },

    body("name", "Name must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("description", "Description must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("price", "Price must not be negative.")
        .trim()
        .isFloat({ min: 0 })
        .escape(),
    body("numberInStock", "Number in stock must not be negative.")
        .trim()
        .isInt({ min: 0 })
        .escape(),
    body("category.*").escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const tea = new Tea({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            numberInStock: req.body.numberInStock,
            category: req.body.category,
        });

        if (!errors.isEmpty()) {
            const allCategories = await Category.find().exec();

            for (const category of allCategories) {
                if (tea.category.includes(category._id)) {
                    category.checked = "true";
                }
            }

            res.render("tea_form", {
                title: "Create Tea",
                categories: allCategories,
                tea: tea,
                errors: errors.array(),
            });
        } else {
            const teaExists = await Tea.findOne({
                name: req.body.name,
            }).exec();

            if (teaExists) {
                res.redirect(tea.url);
            } else {
                await tea.save();

                res.redirect(tea.url);
            }
        }
    }),
];

exports.tea_delete_get = asyncHandler(async (req, res, next) => {
    const tea = await Tea.findOne({ name: req.params.tea }).exec();

    if (tea === null) {
        res.redirect("/tea");
    }

    res.render("tea_delete", {
        title: "Delete Tea",
        tea: tea,
    });
});

exports.tea_delete_post = asyncHandler(async (req, res, next) => {
    const tea = await Tea.findOne({ name: req.params.tea }).exec();

    await Tea.findByIdAndRemove(tea._id);
    res.redirect("/tea");
});

exports.tea_update_get = asyncHandler(async (req, res, next) => {
    const [tea, allCategories] = await Promise.all([
        Tea.findOne({ name: req.params.tea }).populate("category").exec(),
        Category.find().exec(),
    ]);

    if (tea === null) {
        const err = new Error("Tea not found");
        err.status = 404;
        return next(err);
    }

    for (const category of allCategories) {
        for (const tea_c of tea.category) {
            if (category._id.toString() === tea_c._id.toString()) {
                category.checked = true;
            }
        }
    }

    res.render("tea_form", {
        title: "Update Tea",
        categories: allCategories,
        tea: tea,
    });
});

exports.tea_update_post = [
    (req, res, next) => {
        if (!(req.body.category instanceof Array)) {
            if (typeof req.body.category === "undefined") {
                req.body.category = [];
            } else {
                req.body.category = new Array(req.body.category);
            }
        }
        next();
    },

    body("name", "Name must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("description", "Description must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("price", "Price must not be negative.")
        .trim()
        .isFloat({ min: 0 })
        .escape(),
    body("numberInStock", "Number in stock must not be negative.")
        .trim()
        .isInt({ min: 0 })
        .escape(),
    body("category.*").escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const oldTea = await Tea.findOne({ name: req.params.tea }).exec();

        const tea = new Tea({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            numberInStock: req.body.numberInStock,
            category: req.body.category,
            _id: oldTea._id,
        });

        if (!errors.isEmpty()) {
            const allCategories = await Category.find().exec();

            for (const category of allCategories) {
                if (tea.category.indexOf(category._id) > -1) {
                    category.checked = "true";
                }
            }

            res.render("tea_form", {
                title: "Update Tea",
                categories: allCategories,
                tea: tea,
                errors: errors.array(),
            });
            return;
        } else {
            await Tea.findByIdAndUpdate(oldTea._id, tea, {});

            res.redirect(tea.url);
        }
    }),
];
