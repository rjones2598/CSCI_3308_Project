-- Create Tables in DB

-- Create Users table
-- Optional Username variable to login with
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    email varchar(40) NOT NULL UNIQUE,
    username varchar(20) UNIQUE,
    firstname varchar(30) NOT NULL,
    lastname varchar(30) NOT NULL,
    password TEXT NOT NULL,
    prefs integer[],
    is_public BOOLEAN
);

-- Create Table for Chats
CREATE TABLE IF NOT EXISTS chats (
    chat_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id),
    message TEXT NOT NULL,
    timestamp timestamp default current_timestamp
);

-- Create Events table
CREATE TABLE IF NOT EXISTS events (
    event_id SERIAL PRIMARY KEY,
    title varchar(30) NOT NULL,
    description TEXT,
    location TEXT,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    media_src varchar(50),
    band_url varchar(50),
    ticket_url varchar(50), 
    attending integer[],
    chat_id SERIAL NOT NULL REFERENCES chats(chat_id)
);

-- Create Prefs table
CREATE TABLE IF NOT EXISTS prefs (
    pref_id SERIAL PRIMARY KEY,
    parent_pref_id INTEGER DEFAULT NULL,
    name varchar(20) NOT NULL
);