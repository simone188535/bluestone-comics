DROP DATABASE IF EXISTS "bluestone-local";

CREATE DATABASE "bluestone-local";

\c "bluestone-local";


CREATE TYPE public.user_roles AS ENUM
    ('user', 'admin', 'moderator', 'creator', 'publisher');

CREATE TYPE public.status_types AS ENUM
    ('ongoing', 'completed', 'hiatus');

CREATE TYPE public.content_rating_types AS ENUM
    ('G', 'T', 'M', 'E');

CREATE TYPE public.creator_credits_types AS ENUM
    ('writer', 'artist', 'editor', 'inker', 'letterer', 'penciller', 'colorist', 'cover artist');


CREATE SEQUENCE IF NOT EXISTS public.users_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;



CREATE SEQUENCE IF NOT EXISTS public.books_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;


    
CREATE SEQUENCE IF NOT EXISTS public.issues_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;



CREATE SEQUENCE IF NOT EXISTS public.issue_assets_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;



CREATE SEQUENCE IF NOT EXISTS public.bookmarks_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;



CREATE SEQUENCE IF NOT EXISTS public.genres_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;



CREATE SEQUENCE IF NOT EXISTS public.subscribers_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;



CREATE SEQUENCE IF NOT EXISTS public.work_credits_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;






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


CREATE TABLE IF NOT EXISTS public.books
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
);


CREATE TABLE IF NOT EXISTS public.issues
(
    id integer NOT NULL DEFAULT nextval('issues_id_seq'::regclass),
    publisher_id integer,
    book_id integer,
    title character varying(50) COLLATE pg_catalog."default" NOT NULL,
    cover_photo character varying COLLATE pg_catalog."default" NOT NULL DEFAULT 'default.jpg'::character varying,
    issue_number smallint NOT NULL DEFAULT 1,
    image_prefix_reference character varying COLLATE pg_catalog."default" NOT NULL,
    last_updated timestamp with time zone,
    date_created timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    description character varying(1000) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT issues_pkey PRIMARY KEY (id),
    CONSTRAINT issues_book_id_fkey FOREIGN KEY (book_id)
        REFERENCES public.books (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT issues_publisher_id_fkey FOREIGN KEY (publisher_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT issues_title_check CHECK (length(title::text) <= 50)
);


CREATE TABLE IF NOT EXISTS public.issue_assets
(
    id integer NOT NULL DEFAULT nextval('issue_assets_id_seq'::regclass),
    publisher_id integer,
    book_id integer,
    issue_id integer,
    page_number smallint NOT NULL DEFAULT 1,
    photo_url character varying COLLATE pg_catalog."default" NOT NULL,
    last_updated timestamp with time zone,
    date_created timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT issue_assets_pkey PRIMARY KEY (id),
    CONSTRAINT issue_assets_book_id_fkey FOREIGN KEY (book_id)
        REFERENCES public.books (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT issue_assets_issue_id_fkey FOREIGN KEY (issue_id)
        REFERENCES public.issues (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT issue_assets_publisher_id_fkey FOREIGN KEY (publisher_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS public.genres
(
    id integer NOT NULL DEFAULT nextval('genres_id_seq'::regclass),
    book_id integer,
    genre character varying COLLATE pg_catalog."default" NOT NULL,
    last_updated timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    date_created timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT genres_pkey PRIMARY KEY (id),
    CONSTRAINT genres_book_id_genre_key UNIQUE (book_id, genre),
    CONSTRAINT genres_book_id_fkey FOREIGN KEY (book_id)
        REFERENCES public.books (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS public.bookmarks
(
    id integer NOT NULL DEFAULT nextval('bookmarks_id_seq'::regclass),
    book_id integer,
    subscribed_id integer,
    date_created timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT bookmarks_pkey PRIMARY KEY (id),
    CONSTRAINT bookmarks_book_id_fkey FOREIGN KEY (book_id)
        REFERENCES public.books (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT bookmarks_subscribed_id_fkey FOREIGN KEY (subscribed_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS public.subscribers
(
    id integer NOT NULL DEFAULT nextval('subscribers_id_seq'::regclass),
    publisher_id integer,
    subscriber_id integer,
    date_created timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT subscribers_pkey PRIMARY KEY (id),
    CONSTRAINT subscribers_publisher_id_fkey FOREIGN KEY (publisher_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT subscribers_subscriber_id_fkey FOREIGN KEY (subscriber_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS public.work_credits
(
    id integer NOT NULL DEFAULT nextval('work_credits_id_seq'::regclass),
    publisher_id integer,
    book_id integer,
    issue_id integer,
    creator_id integer,
    creator_credit creator_credits_types NOT NULL,
    last_updated timestamp with time zone,
    date_created timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT work_credits_pkey PRIMARY KEY (id),
    CONSTRAINT work_credits_book_id_fkey FOREIGN KEY (book_id)
        REFERENCES public.books (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT work_credits_creator_id_fkey FOREIGN KEY (creator_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT work_credits_issue_id_fkey FOREIGN KEY (issue_id)
        REFERENCES public.issues (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT work_credits_publisher_id_fkey FOREIGN KEY (publisher_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);

ALTER SEQUENCE public.users_id_seq
    OWNED BY public.users.id;

ALTER SEQUENCE public.books_id_seq
    OWNED BY public.books.id;

ALTER SEQUENCE public.issues_id_seq
    OWNED BY public.issues.id;

ALTER SEQUENCE public.issue_assets_id_seq
    OWNED BY public.issue_assets.id;

ALTER SEQUENCE public.bookmarks_id_seq
    OWNED BY public.bookmarks.id;

ALTER SEQUENCE public.genres_id_seq
    OWNED BY public.genres.id;

ALTER SEQUENCE public.subscribers_id_seq
    OWNED BY public.subscribers.id;

ALTER SEQUENCE public.work_credits_id_seq
    OWNED BY public.work_credits.id;