CREATE TYPE user_roles AS ENUM ('user', 'admin', 'moderator', 'creator');
CREATE TABLE users(
	id SERIAL PRIMARY KEY,
	first_name VARCHAR(50) NOT NULL,
	last_name VARCHAR(50) NOT NULL,
	username VARCHAR(50) NOT NULL UNIQUE CHECK (length(username) > 6),
	email VARCHAR(255) NOT NULL UNIQUE,
	role user_roles default 'user',
	user_photo VARCHAR default 'https://bluestone-images.s3.us-east-2.amazonaws.com/default/profile-pic.jpeg',
	background_user_photo VARCHAR default 'https://bluestone-images.s3.us-east-2.amazonaws.com/default/plain-white-background.jpg',
	password VARCHAR NOT NULL,
	-- password_confirm VARCHAR NOT NULL,
	password_changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
	password_reset_token VARCHAR,
	password_reset_token_expires TIMESTAMP WITH TIME ZONE DEFAULT NULL,
	active BOOLEAN DEFAULT true,
	bio VARCHAR(150) DEFAULT 'This user has no bio.' CHECK (length(bio) <= 150),
	date_created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);