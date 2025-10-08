CREATE DATABASE "bluestone-local";


CREATE TABLE IF NOT EXISTS public.users
(
    id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    first_name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    last_name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    username character varying(50) COLLATE pg_catalog."default" NOT NULL,
    email character varying(255) COLLATE pg_catalog."default" NOT NULL,
    role user_roles DEFAULT 'user'::user_roles,
    user_photo character varying COLLATE pg_catalog."default" DEFAULT 'https://bluestone-defaults.s3.us-east-2.amazonaws.com/profile-pic.jpeg'::character varying,
    background_user_photo character varying COLLATE pg_catalog."default" DEFAULT 'https://bluestone-defaults.s3.us-east-2.amazonaws.com/plain-white-background.jpg'::character varying,
    password character varying COLLATE pg_catalog."default" NOT NULL,
    password_changed_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    password_reset_token character varying COLLATE pg_catalog."default",
    password_reset_token_expires timestamp with time zone,
    active boolean DEFAULT true,
    bio character varying(150) COLLATE pg_catalog."default" DEFAULT 'This user has no bio.'::character varying,
    date_created timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    last_updated timestamp with time zone,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email),
    CONSTRAINT users_username_key UNIQUE (username),
    CONSTRAINT users_bio_check CHECK (length(bio::text) <= 150),
    CONSTRAINT users_username_check CHECK (length(username::text) >= 6)
);


(
    id integer NOT NULL DEFAULT nextval('books_id_seq'::regclass),
    publisher_id integer,
    title character varying(50) COLLATE pg_catalog."default" NOT NULL,
    url_slug character varying(100) COLLATE pg_catalog."default" NOT NULL,
    cover_photo character varying COLLATE pg_catalog."default" NOT NULL DEFAULT 'default.jpg'::character varying,
    description character varying(1000) COLLATE pg_catalog."default" NOT NULL,
    status status_types NOT NULL DEFAULT 'ongoing'::status_types,
    removed boolean DEFAULT false,
    image_prefix_reference character varying COLLATE pg_catalog."default" NOT NULL,
    last_updated timestamp with time zone,
    date_created timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    content_rating content_rating_types NOT NULL DEFAULT 'M'::content_rating_types,
    CONSTRAINT books_pkey PRIMARY KEY (id),
    CONSTRAINT books_publisher_id_fkey FOREIGN KEY (publisher_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT books_title_check CHECK (length(title::text) <= 50),
    CONSTRAINT books_url_slug_check CHECK (length(url_slug::text) <= 100)
)


