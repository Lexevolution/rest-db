# rest-db
A simple TypeScript app that has a few rest endpoints to write numbers to a database.

## Getting Started
1. Install [Bun](https://bun.sh/)
2. Download/Clone source code
3. Run this command in the souce code folder: `bun install` to install dpendencies
4. To run, type this command in the folder: `bun run index.ts`
5. This will start to run a local webserver on port 8080.

## Usage
Once it's running, here's how you use the endpoints:
### GET `/records/'USERID'`
Will return something like this `USERID|USERNAME|SCORE`, or will return HTTP code 204 if userid not found.
### POST `/records/'USERID'`
When POSTing a value to the database, the content type is `text/plain`.
The format of the data in the body is:
```
Username
Score
```
If `USERID` matches record already in datyabase, it will overwrite.

Will return HTTP code 200 if successful or 400 if unsuccessful.

### GET `/records`
Will return (up to) 10 paginated results, sorted by highest to lowest score.

To get past 10, add `?page=1` or any other page number. (starts at 0)

Will return records like this:
```
USERID|USERNAME|SCORE
USERID|USERNAME|SCORE
USERID|USERNAME|SCORE
USERID|USERNAME|SCORE
USERID|USERNAME|SCORE
USERID|USERNAME|SCORE
USERID|USERNAME|SCORE
USERID|USERNAME|SCORE
USERID|USERNAME|SCORE
USERID|USERNAME|SCORE
```