-- This file contains the SQL commands to create the tables for the database.

-- DDL script for creating albums table
CREATE TABLE "albums" ("releaseDate" date, "albumId" text NOT NULL, "name" text NOT NULL, "label" text, "albumType" text, "artistId" text, "imageUrl" text);

-- DDL script for creating artists tables
CREATE TABLE "artists" ("artistId" text NOT NULL, "imageUrl" text, "genres" ARRAY, "name" text NOT NULL);

-- DDL script for creating comments table
CREATE TABLE "comments" ("entityId" text NOT NULL, "text" text NOT NULL, "parentCommentId" uuid, "userId" text, "commentId" uuid NOT NULL, "timestamp" timestamp without time zone, "entityType" text);

-- DDL script for creating friends table
CREATE TABLE "friends" ("userId" text NOT NULL, "friendId" text NOT NULL);

-- DDL script for creating ratings table
CREATE TABLE "ratings" ("entityType" text, "entityId" text NOT NULL, "timestamp" timestamp without time zone, "rating" integer, "userId" text);

-- DDL script for creating trackFeaturedArtists table
CREATE TABLE "trackFeaturedArtists" ("artistId" text NOT NULL, "trackId" text NOT NULL);

-- DDL script for creating trackHistory table
CREATE TABLE "trackHistory" ("artistId" text, "trackId" text, "timestamp" timestamp without time zone, "userId" text);

-- DDL script for creating tracks table
CREATE TABLE "tracks" ("explicit" boolean, "artistId" text, "trackId" text NOT NULL, "name" text NOT NULL, "duration" integer, "albumId" text);

-- DDL script for creating upvotes table
CREATE TABLE "upvotes" ("timestamp" timestamp without time zone, "commentId" uuid NOT NULL, "userId" text NOT NULL);

-- DDL script for creating users table
CREATE TABLE "users" ("name" text, "accountType" text, "userId" text NOT NULL, "refreshToken" text, "email" text NOT NULL);

-- Add primary keys to the tables
ALTER TABLE public."albums" ADD CONSTRAINT albums_pkey PRIMARY KEY ("albumId");

ALTER TABLE public."artists" ADD CONSTRAINT artists_pkey PRIMARY KEY ("artistId");

ALTER TABLE public."comments" ADD CONSTRAINT comments_pkey PRIMARY KEY ("commentId");

ALTER TABLE public."friends" ADD CONSTRAINT friends_pkey PRIMARY KEY ("userId", "friendId");

ALTER TABLE public."trackFeaturedArtists" ADD CONSTRAINT "trackFeaturedArtists_pkey" PRIMARY KEY ("trackId", "artistId");

ALTER TABLE public."tracks" ADD CONSTRAINT tracks_pkey PRIMARY KEY ("trackId");

ALTER TABLE public."upvotes" ADD CONSTRAINT upvotes_pkey PRIMARY KEY ("userId", "commentId");

ALTER TABLE public."users" ADD CONSTRAINT users_pkey PRIMARY KEY ("userId");

-- Add foreign keys to the tables
ALTER TABLE "albums"
ADD CONSTRAINT albums_artistid_fkey FOREIGN KEY ("artistId") REFERENCES "artists"("artistId") ON DELETE CASCADE;

ALTER TABLE "comments"
ADD CONSTRAINT comments_parentCommentId_fkey FOREIGN KEY ("parentCommentId") REFERENCES "comments"("commentId") ON DELETE CASCADE,
ADD CONSTRAINT comments_userid_fkey FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE CASCADE;

ALTER TABLE "friends"
ADD CONSTRAINT friends_friendid_fkey FOREIGN KEY ("friendId") REFERENCES "users"("userId") ON DELETE CASCADE,
ADD CONSTRAINT friends_userid_fkey FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE CASCADE;

ALTER TABLE "ratings"
ADD CONSTRAINT ratings_userid_fkey FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE CASCADE;

ALTER TABLE "trackFeaturedArtists"
ADD CONSTRAINT "trackFeaturedArtists_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artists"("artistId") ON DELETE CASCADE,
ADD CONSTRAINT "trackFeaturedArtists_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "tracks"("trackId") ON DELETE CASCADE;

ALTER TABLE "trackHistory"
ADD CONSTRAINT "trackHistory_artistid_fkey" FOREIGN KEY ("artistId") REFERENCES "artists"("artistId") ON DELETE CASCADE,
ADD CONSTRAINT "trackHistory_trackid_fkey" FOREIGN KEY ("trackId") REFERENCES "tracks"("trackId") ON DELETE CASCADE;

ALTER TABLE "tracks"
ADD CONSTRAINT tracks_albumid_fkey FOREIGN KEY ("albumId") REFERENCES "albums"("albumId") ON DELETE CASCADE,
ADD CONSTRAINT tracks_artistid_fkey FOREIGN KEY ("artistId") REFERENCES "artists"("artistId") ON DELETE CASCADE;

ALTER TABLE "upvotes"
ADD CONSTRAINT "upvotes_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "comments"("commentId") ON DELETE CASCADE,
ADD CONSTRAINT "upvotes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE CASCADE;

-- Add constraints to the tables
ALTER TABLE public."comments"
ADD CONSTRAINT comments_entitytype_check 
CHECK ("entityType" = ANY (ARRAY['track', 'album', 'artist', 'user']));

ALTER TABLE public."ratings"
ADD CONSTRAINT ratings_entitytype_check 
CHECK ("entityType" = ANY (ARRAY['track', 'album', 'artist']));

ALTER TABLE public."ratings"
ADD CONSTRAINT ratings_rating_check 
CHECK (rating >= 1 AND rating <= 5);

ALTER TABLE public."friends"
ADD CONSTRAINT friends_check 
CHECK ("userId" <> "friendId");

ALTER TABLE public."users"
ADD CONSTRAINT users_accounttype_check 
CHECK ("accountType" = ANY (ARRAY['private', 'public']));

ALTER TABLE public."ratings"
ADD CONSTRAINT unique_rating_per_user_per_entity 
UNIQUE ("userId", "entityId", "entityType");