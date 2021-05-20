CREATE TYPE status_types AS ENUM ('ongoing', 'completed', 'hiatus');
CREATE TABLE books(
	id SERIAL PRIMARY KEY,
	publisher_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
	title VARCHAR(50) NOT NULL CHECK (length(title) <= 50),
	url_slug VARCHAR(100) UNIQUE CHECK (length(url_slug) <= 100) NOT NULL,
	cover_photo VARCHAR NOT NULL DEFAULT 'default.jpg',
	description VARCHAR(1000) NOT NULL,
	status status_types DEFAULT 'ongoing' NOT NULL,
	removed BOOLEAN DEFAULT 'false',
	image_prefix_reference VARCHAR NOT NULL,
	last_updated TIMESTAMP WITH TIME ZONE DEFAULT NULL,
	date_created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);