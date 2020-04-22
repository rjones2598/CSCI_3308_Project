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

-- Create Events table
CREATE TABLE IF NOT EXISTS events (
    event_id SERIAL PRIMARY KEY,
    title varchar(40) NOT NULL,
    description TEXT,
    location TEXT,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    media_src varchar(50),
    band_url varchar(50),
    ticket_url varchar(50), 
    attending INTEGER default 0
    -- Chat id not needed, will query that table for mathcing event_id
);

-- Create Table for Chats
CREATE TABLE IF NOT EXISTS chats (
    chat_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id),
    event_id INTEGER NOT NULL REFERENCES events(event_id),
    message TEXT NOT NULL,
    timestamp timestamp default current_timestamp
    -- events page will list these under event ordered by chat_id for a given event_id
);

-- Create Prefs table
CREATE TABLE IF NOT EXISTS prefs (
    pref_id SERIAL PRIMARY KEY,
    parent_pref_id INTEGER DEFAULT NULL REFERENCES prefs(pref_id),
    name varchar(20) NOT NULL,
    pref_img TEXT
);

SET timezone = 'America/Denver';

-- Inserting example events
INSERT INTO events(title, description, location, start_date, end_date)
VALUES('Some Neat Event at Red Rocks', 'Nam molestie molestie maximus. Aliquam dolor elit, tincidunt a fringilla ac, gravida eget metus. Etiam id sem sit amet dui sodales varius. Fusce quis sapien lacinia, tempus lectus sit amet, cursus enim. Proin faucibus efficitur sodales. Nam id quam ullamcorper, suscipit.','Red Rocks Ampitheater','2020-04-27 20:30:00-07','2020-04-28 00:30:00-07'),
('John Johnson @ the Gothic Theatre', 'John Johnson brings his unique style to his music playing. He is coming to Denver to play that such style.', 'The Gothic Theatre', '2020-04-28 19:30:00-07', '2020-04-29 00:30:00-07'),
('Denver Food Fest @ the Botanic Gardens', 'Come experience food from the great chefs around Denver.', 'Botanic Gardens', '2020-04-29 11:30:00-07', '2020-04-29 21:30:00-07');

-- Inserting preferences
INSERT INTO prefs(parent_pref_id, name, pref_img)
VALUES(NULL, 'Comedy Shows', '../../resources/img/comedy.jpg'),
(NULL, 'Art Shows', '../../resources/img/artshow.jpg'),
(NULL, 'Live Music', '../../resources/img/jazzshow.jpg'),
(NULL, 'Magic Show', '../../resources/img/magicshow'),
(NULL, 'Theater Performance', '../../resources/img/theater.jpg'),
(NULL, 'Culinary Events', '../../resources/img/food.jpg'),
(NULL, 'Political Events', '../../resources/img/political.jpg');

