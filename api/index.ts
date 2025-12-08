import { app } from "../src/app";
import initDB from "../src/database/db";

let dbInitialized = false;
const hanlder = async (req: any, res: any) => {
  if (!dbInitialized) {
    try {
      await initDB();
      dbInitialized = true;
    } catch (error) {
      console.log("db init feild!", error);
    }
  }
  return app(req, res);
};

export default hanlder;
