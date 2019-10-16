const spicedPg = require("spiced-pg");

const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:postgres:postgres@localhost:5432/imageboard`
);

module.exports.getImages = () => {
    return db.query(`SELECT *
        FROM images
        ORDER BY id DESC
    `);
};

module.exports.getImagesModal = id => {
    return db.query(
        `SELECT *
        FROM comments
        LEFT JOIN images
        ON comments.image_id = images.id
        WHERE images.id = $1
        `,
        [id]
    );
};

module.exports.addImage = (url, username, title, description) => {
    return db.query(
        `
        INSERT INTO images (url, username, title, description)
        VALUES ($1, $2, $3, $4)
        RETURNING id
         `,
        [url, username, title, description]
    );
};

module.exports.addComment = (user, comment, imageId) => {
    return db.query(
        `
        INSERT INTO comments (comment_user, comment, image_id)
        VALUES ($1, $2, $3)
        RETURNING *
         `,
        [user, comment, imageId]
    );
};
