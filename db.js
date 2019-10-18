const spicedPg = require("spiced-pg");

const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:postgres:postgres@localhost:5432/imageboard`
);

module.exports.getImages = () => {
    return db.query(`SELECT *
        FROM images
        ORDER BY id DESC
        LIMIT 12
    `);
};

exports.getMoreImages = lastId => {
    return db.query(
        `SELECT *, (
            SELECT id FROM images
            ORDER BY id ASC
            LIMIT 1
        ) AS lowest_id FROM images
        WHERE id < $1
        ORDER BY id DESC
        LIMIT 12`,
        [lastId]
    );
};

// grab the iimages by the smallest id on screen

// if the smallest id exists in the query above, we should make the button go away

// run the smallest id query every time the more button is clicked

// more button in the view instance
// in script figure out which is the smallest id in the array of images showing

// module.exports.getImagesModal = id => {
//     return db.query(
//         `SELECT *
//         FROM images
//         WHERE images.id = $1
//         `,
//         [id]
//     );
// };

module.exports.getImagesModal = id => {
    return db.query(
        `
            SELECT *
            FROM comments
            FULL OUTER JOIN images
            ON images.id = comments.image_id
            WHERE images.id = $1;

        `,
        [id]
    );
};
// module.exports.getImagesModal = id => {
//     return db.query(
//         `IF (comments.image_id = 1) THEN
//             SELECT *
//             FROM images
//             WHERE images.id = 1
//         ELSE
//             SELECT *
//             FROM comments
//             LEFT JOIN images
//             ON comments.image_id = images.id
//             WHERE images.id = 1
//         END IF;
//
//         `,
//         [id]
//     );
// };

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
