CREATE TABLE subscribers(
	id SERIAL PRIMARY KEY,
	publisher_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
	subscriber_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
	date_created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);