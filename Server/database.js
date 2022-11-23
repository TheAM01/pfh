import Database from "@replit/database";
import databaseUrlFetch from "./database-url.js";

const dbUrl = await databaseUrlFetch();

const db = new Database(dbUrl);
const cb = new Database('https://kv.replit.com/v0/eyJhbGciOiJIUzUxMiIsImlzcyI6ImNvbm1hbiIsImtpZCI6InByb2Q6MSIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJjb25tYW4iLCJleHAiOjE2NjkyODM5OTcsImlhdCI6MTY2OTE3MjM5NywiZGF0YWJhc2VfaWQiOiJkMGY0YmM4ZS1iYTllLTQyZDItYmMzZS1hYWMxMTUwM2QwOGMiLCJ1c2VyIjoiVGhlQU0wMSIsInNsdWciOiJQRkgtV0VCU0lURSJ9.u-KpdAzBr7ewX4JM26fBZBOrvibzUc2ER240RPRy-QKxW6q7r95bckiRI3QhZhdAiuuUz7Pn1HGxwWoHh3492g')

export default db

export {cb}