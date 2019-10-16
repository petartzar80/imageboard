const express = require("express");
const app = express();
const s3 = require("./s3");
const { s3Url } = require("./config");
const { getImages, getImagesModal, addImage } = require("./db");
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
    getImages().then(({ rows }) => {
        console.log("rows: ", rows);
        res.json(rows);
    });
});

app.get(`/images/:id`, (req, res) => {
    console.log("req.params: ", req.params.id);
    console.log("req.params parsed: ", Number(req.params.id));
    getImagesModal(Number(req.params.id))
        .then(({ rows }) => {
            console.log(" Modalrows: ", rows[0]);
            res.json(rows[0]);
        })
        .catch(function(err) {
            console.log(err);
            res.sendStatus(500);
        });
});

app.post("/upload", uploader.single("image"), s3.upload, function(req, res) {
    const { username, title, desc } = req.body;
    const url = `${s3Url}${req.file.filename}`;
    addImage(url, username, title, desc)
        .then(function({ rows }) {
            res.json({
                username,
                title,
                desc,
                url,
                id: rows[0].id
            });
            //send image to  client
        })
        .catch(function(err) {
            console.log(err);
            res.sendStatus(500);
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
