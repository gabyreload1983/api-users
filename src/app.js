import express from "express";
import "./dao/dbMongoConfig.js";
import passport from "passport";
import cookieParser from "cookie-parser";
import cors from "cors";

import initializePassport from "./config/passport.config.js";
import logger from "./logger/logger.js";

import usersRouter from "./routes/users.router.js";

import { __dirname } from "./utils.js";

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(`${__dirname}/public`));

initializePassport();
app.use(passport.initialize());

app.use("/api/users", usersRouter);
app.use("*", (req, res) =>
  res.status(404).send({ error: "error", message: "Page Not Found" })
);

const port = process.env.PORT || 3000;
app.listen(port, () => logger.info(`Listening on port ${port}`));

export default app;
