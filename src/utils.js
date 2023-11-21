import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import logger from "./logger/logger.js";
import UserResponseDto from "./dao/DTOs/UserResponse.dto.js";
import passport from "passport";

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

export const generateToken = (user) =>
  jwt.sign({ user }, process.env.PRIVATE_KEY_JWT, { expiresIn: "30d" });

export const authToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    logger.error(`Not authenticated. ${req.socket?.remoteAddress}`);
    return res.status(401).send({ error: "Not authenticated" });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.PRIVATE_KEY_JWT, (error, credentials) => {
    if (error)
      return res.status(403).send({
        status: "error",
        message: "jwt-expired",
      });
    req.user = credentials.user;
    next();
  });
};

export const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, function (err, user, info) {
      if (err) return next(err);

      if (!user) {
        return res.status(401).send({
          status: "error",
          messages: info.messages ? info.messages : info.toString(),
        });
      }

      req.user = new UserResponseDto(user);

      next();
    })(req, res, next);
  };
};

export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const validatePassword = (user, password) =>
  bcrypt.compareSync(password, user.password);

export const authorization = (...roles) => {
  return async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      logger.error(`You don't have permissions. ${req.socket?.remoteAddress}`);
      return res
        .status(403)
        .send({ status: "error", message: "You don't have permissions" });
    }
    next();
  };
};
