#! /usr/bin/env node

console.log(
    'This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Category = require("./models/category");
const Tea = require("./models/tea");

const categories = [];
const teas = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createCategories();
    await createTea();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
}

async function categoryCreate(index, name, description) {
    const category = new Category({ name: name, description: description });
    await category.save();
    categories[index] = category;
    console.log(`Added category: ${name}`);
}

async function teaCreate(
    index,
    name,
    description,
    price,
    numberInStock,
    category
) {
    const teadetail = {
        name: name,
        description: description,
        price: price,
        numberInStock: numberInStock,
    };
    if (category != false) teadetail.category = category;

    const tea = new Tea(teadetail);
    await tea.save();
    teas[index] = tea;
    console.log(`Added tea: ${name}`);
}

async function createCategories() {
    console.log("Adding categories");
    await Promise.all([
        categoryCreate(
            0,
            "Black tea",
            "Many people new to the world of tea are most familiar with black tea. You can find black tea in name-brand teabags at the grocery store like Lipton or Tetley. Popular breakfast blends like English Breakfast and Irish Breakfast are other examples of black tea. Black teas tend to be relatively high in caffeine, with about half as much caffeine as a cup of coffee. They brew up a dark, coppery color, and usually have a stronger, more robust flavor than other types of tea. "
        ),
        categoryCreate(
            1,
            "Green tea",
            "Green tea is another type of tea made from the camellia sinensis plant. Green teas often brew up a light green or yellow color, and tend to have a lighter body and milder taste. They contain about half as much caffeine as black tea (about a quarter that of a cup of coffee.) Popular green teas include Gunpowder, Jasmine Yin Cloud, and Moroccan Mint."
        ),
        categoryCreate(
            2,
            "White tea",
            "White tea is a delicate, minimally processed tea that is highly sought after by connoisseurs and enjoyed by experts and novices alike. White tea has a light body and a mild flavor with a crisp, clean finish. White tea tends to be very low in caffeine, although some silver tip teas may be slightly higher in caffeine."
        ),
        categoryCreate(
            3,
            "Oolong",
            "Oolong is a partially oxidized tea, placing it somewhere in between black and green teas in terms of oxidation. Oolong teas can range from around 10-80% oxidation, and can brew up anywhere from a pale yellow to a rich amber cup of tea. Many oolongs can be re-infused many times, with subtle differences and nuances of flavor in each successive cup."
        ),
        categoryCreate(
            4,
            "Matcha",
            "Matcha is a type of powdered green tea popular in Japan. It can be consumed on its own when whisked with water, and can also be added to lattes, smoothies, and baked goods. Matcha has a smooth, rich flavor with notes of umami and just a hint of bitterness."
        ),
        categoryCreate(
            5,
            "Mate tea",
            "Mate is a tea-like drink made from a plant native to South America. Although mate is not related to the camellia sinensis tea plant, it does contain caffeine. Mate is traditionally prepared in a hollow gourd by adding leaves and hot water to the gourd to steep. The tea is then consumed through a filtered straw known as a bombilla. In many South American countries, mate is shared among a group of friends by drinking and refilling the same gourd as it is passed from person to person. Mate can also be prepared in the same way as other teas and tisanes, by steeping the leaves in an infuser or filter in a mug or pot."
        ),
        categoryCreate(
            6,
            "Herbal tea",
            "Although we colloquially call herbal teas “tea,” they’re not actually related to true teas made from the camellia sinensis plant. Instead, herbal teas are composed of a blend of different herbs and spices. In general, herbal teas contain no caffeine. There are a wide variety of different kinds of herbal teas, including both single-ingredient teas like Peppermint and Chamomile, as well as creative blends like Lavender Lullaby and Atomic Gold."
        ),
    ]);
}

async function createTea() {
    console.log("Adding tea");
    await Promise.all([
        teaCreate(
            0,
            "English Breakfast",
            "Our English Breakfast is an aromatic blend of Ceylon, Assam, and Tanzanian black teas. English Breakfast has a classic rich, malty taste that goes well with milk and sugar.",
            17,
            88,
            [categories[0]]
        ),
        teaCreate(
            1,
            "Irish Breakfast",
            "Our organic Irish Breakfast makes a rich cup of tea that’s sure to get you going in the morning. This stout, robust blend of Assam, Ceylon, and Tanzanian teas creates a full-bodied, malty tea that pairs well with milk and sugar. A good strong cuppa!            ",
            17,
            63,
            [categories[0]]
        ),
        teaCreate(
            2,
            "Gunpowder",
            "From an estate west of Hangzhou, this classic Gunpowder green tea has a medium body and steeps into a beautiful green-gold liquor with a smooth, hearty flavor and nutty, vegetal, and slightly smoky notes. It holds up well to repeated infusions. Gunpowder gets its name from its tightly rolled leaves.",
            17,
            16,
            [categories[1]]
        ),
        teaCreate(
            3,
            "Jasmine Yin Cloud",
            "Jasmine Yin Cloud features a Chinese green tea lightly scented with fresh jasmine blossoms. This floral, aromatic tea is one of our most popular green teas. Delicious enjoyed hot, it also makes a great iced tea!",
            21,
            29,
            [categories[1]]
        ),
        teaCreate(
            4,
            "Moroccan Mint",
            "In Morocco, mint green tea is a sign of hospitality and friendship. Our Moroccan Mint blends the finest Chinese gunpowder tea with exceptional quality spearmint. A lively and refreshing tea that's delicious served hot or iced.",
            17,
            71,
            [categories[1]]
        ),
        teaCreate(
            5,
            "White Peony",
            "White Peony, also known by the traditional name Bai Mu Dan, is a popular style of white tea made of young tea leaves and silvery unopened leaf buds.",
            25,
            94,
            [categories[2]]
        ),
        teaCreate(
            6,
            "Milk Oolong Tea",
            "Prized for its milky scent and taste, our Milk Oolong is produced by hand in the Fujian Province of China, within the Prefecture of Quanzhou. These hand-rolled leaves are a rich olive-green color and brew up into a beautiful golden liquor. This relatively new cultivar of tea has a distinctive mellow, buttery flavor.",
            18,
            22,
            [categories[3]]
        ),
    ]);
}
