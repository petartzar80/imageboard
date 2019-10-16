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
        FROM images
        WHERE id = $1
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
