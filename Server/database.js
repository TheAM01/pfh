import Database from "@replit/database";
import databaseUrlFetch from "./database-url.js";

const dbUrl = await databaseUrlFetch();

export default new Database(dbUrl);