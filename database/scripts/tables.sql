CREATE DATABASE "shortly" WITH ENCODING 'UTF8';

CREATE TABLE "users" (
	"id" SERIAL PRIMARY KEY,
	"name" TEXT  NOT NULL,
	"email" TEXT UNIQUE NOT NULL ,
	"password" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "sessions" (
    "id" SERIAL PRIMARY KEY,
    "token" TEXT NOT NULL,
    "userId" INTEGER REFERENCES "users"("id"),
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "urls" (
	"id" SERIAL PRIMARY KEY,
    "userId" INTEGER REFERENCES "users"("id"),
	"url" TEXT  NOT NULL,
	"shortUrl" TEXT NOT NULL,
    "visits" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "rank" (
    "id" SERIAL PRIMARY KEY,
    "urlId" INTEGER NOT NULL REFERENCES "urls"("id"),
    "userId" INTEGER NOT NULL REFERENCES "users"("id"),
    "linkCount" INTEGER NOT NULL DEFAULT 0,
    "visitsCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);