-- CREATE TYPE genre_types AS ENUM ('writer', 'artist', 'editor', 'inker', 'letterer', 'penciller', 'colorist', 'cover artist');
CREATE TABLE genres(
	id SERIAL PRIMARY KEY,
	book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
	genre VARCHAR NOT NULL,
	-- last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
	date_created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
	UNIQUE(book_id, genre)
);