CREATE TYPE creator_credit_types AS ENUM ('writer', 'artist', 'editor', 'inker', 'letterer', 'penciller', 'colorist', 'cover artist');
CREATE TABLE work_credits(
	id SERIAL PRIMARY KEY,
	publisher_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
	book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
	issue_id INTEGER REFERENCES issues(id) ON DELETE CASCADE,
	creator_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
	creator_credit creator_credit_types NOT NULL,
	last_updated TIMESTAMP WITH TIME ZONE DEFAULT NULL,
	date_created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);