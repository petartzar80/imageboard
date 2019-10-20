DROP TABLE IF EXISTS comments;

CREATE TABLE comments(
    id SERIAL PRIMARY KEY,
    comment_user VARCHAR(255) NOT NULL,
    comment VARCHAR(255) NOT NULL,
    image_id INT REFERENCES images(id) NOT NULL,
    comment_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
