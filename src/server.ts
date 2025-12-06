import express, { Request, Response } from "express";
import initDB from "./database/db";
import router from "./moduler/Authentication/authentication.route";
const app = express();
const port = 5000;

// middleware
app.use(express.json());

// database
initDB();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello vehicle rental system!");
});

app.use("/api/v1/auth", router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
