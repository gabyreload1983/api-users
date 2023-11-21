import logger from "../../logger/logger.js";
import userModel from "./models/users.js";

export default class Users {
  constructor() {
    logger.info("Working Users with DB in mongoDB");
  }

  getUser = async (uid) => await userModel.findOne({ _id: uid });

  getUsers = async () => await userModel.find();

  getByEmail = async (email) => await userModel.findOne({ email });

  create = async (user) => await userModel.create(user);

  update = async (uid, user) => await userModel.updateOne({ _id: uid }, user);

  delete = async (uid) => await userModel.deleteOne({ _id: uid });
}
