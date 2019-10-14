const express = require("express");
const app = express();
const { getImages } = require("./db");

app.use(express.static("./public"));

app.get("/images", (req, res) => {
    // res.json([
    //     { name: "Chicken Little" },
    //     { name: "Funky Chicken" },
    //     { name: "That chicken in that movie" }
    // ]);
    getImages().then(({ rows }) => {
        console.log("rows: ", rows);
        // for (let i = 0; i < rows.length; i++) {
        //     console.log();
        // }
        res.json(rows);
        // res.json([
        //     { name: "Chicken Little" },
        //     { name: "Funky Chicken" },
        //     { name: "That chicken in that movie" }
        // ]);
    });
});

app.listen(process.env.PORT || 8080, () =>
    console.log("imageboard server running")
);
