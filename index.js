const express = require("express");
const app = express();
const s3 = require("./s3");
const { s3Url } = require("./config");
const {
    getImages,
    getImagesModal,
    getMoreImages,
    checkButton,
    addImage,
    addComment
} = require("./db");
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

app.use(express.json());

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
            if (rows[0]) {
                console.log(" Modalrows: ", rows);
                if (rows[0].comment === null) {
                    res.json({ images: rows[0] });
                } else {
                    res.json({ images: rows[0], comments: rows });
                }
            } else {
                res.json(rows);
            }
        })
        .catch(function(err) {
            console.log(err);
            res.sendStatus(500);
        });
});

app.get(`/moreimages/:lastId`, (req, res) => {
    console.log("req.params: ", req.params.lastId);
    console.log("req.params parsed: ", Number(req.params.lastId));
    let buttonBoolean = false;
    getMoreImages(Number(req.params.lastId))
        .then(({ rows }) => {
            // console.log(buttonBoolean);
            console.log(" Morerows: ", rows);
            console.log("is the boolean here? ", buttonBoolean);
            res.json({ rows });
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

app.post("/comment", (req, res) => {
    const { imageId, user, comment } = req.body;
    console.log(
        "comm post id: ",
        imageId,
        " user: ",
        user,
        " comment: ",
        comment
    );
    addComment(user, comment, imageId)
        .then(function({ rows }) {
            res.json({
                comment_user: user,
                comment: comment,
                comment_at: rows[0].comment_at.toUTCString(),
                imageId: imageId,
                id: rows[0].id
            });
            //send image to  client
        })
        .catch(function(err) {
            console.log(err);
            res.sendStatus(500);
        });
});

app.get("/*", (req, res) => {
    res.redirect("/");
});

app.listen(process.env.PORT || 8080, () =>
    console.log("imageboard server running")
);
