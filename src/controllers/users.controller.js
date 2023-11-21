import logger from "../logger/logger.js";
import * as userService from "../services/users.service.js";
import { generateToken } from "../utils.js";
import { validatePassword } from "../utils.js";

export const getUsers = async (req, res) => {
  try {
    const users = await userService.getUsers();
    if (!users)
      return res
        .status(404)
        .send({ status: "error", message: "Users not found" });

    res.send({
      status: "success",
      message: "OK",
      payload: users,
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).send(error);
  }
};

export const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const user = await userService.getByEmail(email);
    if (!user)
      return res
        .status(404)
        .send({ status: "error", message: "User not found" });

    res.send({
      status: "success",
      message: "OK",
      payload: user,
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).send(error);
  }
};

export const register = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    if (!first_name || !last_name || !email || !password)
      return res
        .status(400)
        .send({ status: "error", message: "Incomplete values!" });

    const user = await userService.getByEmail(email);
    if (user) {
      return res
        .status(400)
        .send({ status: "error", message: "User already exists" });
    }

    const newUser = {
      first_name,
      last_name,
      email,
      password,
    };

    const response = await userService.register(newUser);

    res.send({
      status: "success",
      message: "user registered",
      payload: response,
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).send(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userService.login(email);

    if (!user) {
      return res
        .status(401)
        .send({ status: "error", message: "Invalid credentials" });
    }

    if (!validatePassword(user, password))
      return res
        .status(401)
        .send({ status: "error", message: "Invalid credentials" });

    const userResponseDto = await userService.getByEmail(email);
    console.log("userResponseDto: ", userResponseDto);

    const accessToken = generateToken(userResponseDto);

    res.send({
      status: "success",
      message: "user login",
      payload: { accessToken, user: userResponseDto },
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).send(error);
  }
};

export const update = async (req, res) => {
  try {
    const { uid } = req.params;
    const { first_name, last_name, email, role } = req.body;

    if (!first_name || !last_name || !email || !role)
      return res
        .status(400)
        .send({ status: "error", message: "Incomplete values!" });

    const user = await userService.getUser(uid);
    if (!user)
      return res
        .status(404)
        .send({ status: "error", message: "User not found" });

    const response = await userService.update(uid, {
      first_name,
      last_name,
      email,
      role,
    });

    res.send({
      status: "success",
      message: "user updated",
      payload: response,
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).send(error);
  }
};

export const remove = async (req, res) => {
  try {
    const { uid } = req.params;

    const user = await userService.getUser(uid);
    if (!user)
      return res
        .status(404)
        .send({ status: "error", message: "User not found" });

    const response = await userService.remove(uid);

    res.send({
      status: "success",
      message: "user deleted",
      payload: response,
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).send(error);
  }
};
