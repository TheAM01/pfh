import Database from "@replit/database";
import databaseUrlFetch from "./database-url.js";

const dbUrl = await databaseUrlFetch();

const db = new Database(dbUrl);

export default db