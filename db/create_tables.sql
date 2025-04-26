-- This file contains the SQL commands to create the tables for the database.

-- DDL script for creating albums table
CREATE TABLE "albums" (
    "albumId" text NOT NULL,
    "name" text NOT NULL,
    "releaseDate" date,
    "label" text,
    "albumType" text,
    "artistId" text,
    "imageUrl" text,
    CONSTRAINT albums_pkey PRIMARY KEY ("albumId")
);

-- DDL script for creating artists tables
CREATE TABLE "artists" (
    "artistId" text NOT NULL,
    "name" text NOT NULL,
    "imageUrl" text,
    "genres" text[],
    CONSTRAINT artists_pkey PRIMARY KEY ("artistId")
);

-- DDL script for creating comments table
CREATE TABLE "comments" (
    "commentId" uuid NOT NULL,
    "entityId" text NOT NULL,
    "entityType" text NOT NULL,
    "text" text NOT NULL,
    "parentCommentId" uuid,
    "userId" text,
    "timestamp" timestamp without time zone,
    CONSTRAINT comments_pkey PRIMARY KEY ("commentId"),
    CONSTRAINT comments_entitytype_check CHECK ("entityType" = ANY (ARRAY['track', 'album', 'artist', 'user']))
);

-- DDL script for creating friends table
CREATE TABLE "friends" (
    "userId" text NOT NULL,
    "friendId" text NOT NULL,
    CONSTRAINT friends_pkey PRIMARY KEY ("userId", "friendId"),
    CONSTRAINT friends_check CHECK ("userId" <> "friendId")
);

-- DDL script for creating ratings table
CREATE TABLE "ratings" (
    "userId" text NOT NULL,
    "entityId" text NOT NULL,
    "entityType" text NOT NULL,
    "rating" integer NOT NULL,
    "timestamp" timestamp without time zone,
    CONSTRAINT ratings_pkey PRIMARY KEY ("userId", "entityId", "entityType"),
    CONSTRAINT ratings_entitytype_check CHECK ("entityType" = ANY (ARRAY['track', 'album', 'artist'])),
    CONSTRAINT ratings_rating_check CHECK (rating >= 1 AND rating <= 5)
);

-- DDL script for creating trackFeaturedArtists table
CREATE TABLE "trackFeaturedArtists" (
    "trackId" text NOT NULL,
    "artistId" text NOT NULL,
    CONSTRAINT "trackFeaturedArtists_pkey" PRIMARY KEY ("trackId", "artistId")
);

-- DDL script for creating trackHistory table
CREATE TABLE "trackHistory" (
    "historyId" serial NOT NULL,
    "userId" text NOT NULL,
    "trackId" text NOT NULL,
    "artistId" text,
    "timestamp" timestamp without time zone,
    CONSTRAINT "trackHistory_pkey" PRIMARY KEY ("historyId")
);

-- DDL script for creating tracks table
CREATE TABLE "tracks" (
    "trackId" text NOT NULL,
    "name" text NOT NULL,
    "artistId" text,
    "albumId" text,
    "duration" integer,
    "explicit" boolean,
    CONSTRAINT tracks_pkey PRIMARY KEY ("trackId")
);

-- DDL script for creating upvotes table
CREATE TABLE "upvotes" (
    "userId" text NOT NULL,
    "commentId" uuid NOT NULL,
    "timestamp" timestamp without time zone,
    CONSTRAINT upvotes_pkey PRIMARY KEY ("userId", "commentId")
);

-- DDL script for creating users table
CREATE TABLE "users" (
    "userId" text NOT NULL,
    "email" text NOT NULL,
    "name" text,
    "accountType" text,
    "refreshToken" text,
    CONSTRAINT users_pkey PRIMARY KEY ("userId"),
    CONSTRAINT users_email_key UNIQUE ("email"),
    CONSTRAINT users_accounttype_check CHECK ("accountType" = ANY (ARRAY['private', 'public']))
);

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
ADD CONSTRAINT "trackHistory_userid_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE CASCADE,
ADD CONSTRAINT "trackHistory_trackid_fkey" FOREIGN KEY ("trackId") REFERENCES "tracks"("trackId") ON DELETE CASCADE,
ADD CONSTRAINT "trackHistory_artistid_fkey" FOREIGN KEY ("artistId") REFERENCES "artists"("artistId") ON DELETE CASCADE;

ALTER TABLE "tracks"
ADD CONSTRAINT tracks_albumid_fkey FOREIGN KEY ("albumId") REFERENCES "albums"("albumId") ON DELETE CASCADE,
ADD CONSTRAINT tracks_artistid_fkey FOREIGN KEY ("artistId") REFERENCES "artists"("artistId") ON DELETE CASCADE;

ALTER TABLE "upvotes"
ADD CONSTRAINT "upvotes_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "comments"("commentId") ON DELETE CASCADE,
ADD CONSTRAINT "upvotes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE CASCADE;

-- Create indexes for performance
CREATE INDEX idx_albums_artistid ON "albums" ("artistId");
CREATE INDEX idx_comments_entityid ON "comments" ("entityId");
CREATE INDEX idx_comments_userid ON "comments" ("userId");
CREATE INDEX idx_ratings_entityid ON "ratings" ("entityId");
CREATE INDEX idx_trackhistory_userid ON "trackHistory" ("userId");
CREATE INDEX idx_trackhistory_trackid ON "trackHistory" ("trackId");
CREATE INDEX idx_tracks_artistid ON "tracks" ("artistId");
CREATE INDEX idx_tracks_albumid ON "tracks" ("albumId");