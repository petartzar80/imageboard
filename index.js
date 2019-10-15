const express = require("express");
const app = express();
const s3 = require("./s3");
const { s3Url } = require("./config");
const { getImages, addImage } = require("./db");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

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

app.post("/upload", uploader.single("image"), s3.upload, function(req, res) {
    const { username, title, desc } = req.body;
    const imageUrl = `${s3Url}${req.file.filename}`;
    addImage(imageUrl, username, title, desc)
        .then(function({ rows }) {
            res.json({
                username,
                title,
                desc,
                imageUrl,
                id: rows[0].id
            });
            //send image to  client
        })
        .catch(function(err) {
            console.log(err);
            res;
        });
    // if (req.file) {
    //     const { username, desc, title } = req.body;
    //     console.log("upload route username: ", username);
    //     console.log("upload route desc: ", desc);
    //     console.log("upload route title: ", title);
    //     res.sendStatus(200);
    //     //it worked!
    // } else {
    //     // it didnt
    //     res.sendStatus(500);
    // }
});

app.listen(process.env.PORT || 8080, () =>
    console.log("imageboard server running")
);
