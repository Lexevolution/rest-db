import { Elysia } from "elysia";
import { Database } from "bun:sqlite";

type Record = {
    user_id: string,
    username: string,
    score: number
}

const db = new Database("db.sqlite");
db.run(
    `CREATE TABLE IF NOT EXISTS
    leaderboard(
        user_id TEXT NOT NULL UNIQUE,
        username TEXT,
        score REAL NOT NULL DEFAULT 0
    );`
);

const getUserRecordQuery = db.prepare(`SELECT * FROM leaderboard WHERE user_id = $id;`);
const insertUserRecordQuery = db.prepare(
    `INSERT INTO leaderboard(user_id,username,score)
    VALUES($id, $name, $points)
    ON CONFLICT(user_id)
    DO UPDATE SET username=$name, score=$points;`
);
const getAllUserRecordsQuery = db.prepare(`SELECT * FROM leaderboard ORDER BY score DESC LIMIT 10 OFFSET ?1 * 10;`);

const app = new Elysia()
.get("/", () => "No root page :)")
.get("/records/:userId", ({params: {userId}, set}) => {
    const record = getUserRecordQuery.get({$id: userId}) as Record;
    if (record == null){
        set.status = 204;
        return null;
    }
    return `${record.user_id}|${record.username}|${record.score}`;
})
.post("/records/:userId", ({params: {userId}, body, set}) => {
    if (typeof body === "string"){
        const formattedRequest = body.split('\n').map((v) => v.trim());
        insertUserRecordQuery.run({$id: userId, $name: formattedRequest[0], $points: formattedRequest[1]});
        console.log(`Query: ${insertUserRecordQuery.toString()}`);
        return;
    }
})
.get("/records", ({query: {page}}) => {
    const pageNum = parseInt(page ?? "0");
    const records = getAllUserRecordsQuery.all(pageNum) as Record[];
    const flattenedRecords = records.map((record) => `${record.user_id}|${record.username}|${record.score}`);
    let result = "";
    flattenedRecords.forEach((record) => {
        result += record + '\n';
    });
    return result.trimEnd();

})
.listen(8080);

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
