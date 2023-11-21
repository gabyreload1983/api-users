import UserResponseDto from "../dao/DTOs/UserResponse.dto.js";
import User from "../dao/mongoManagers/Users.js";
import CreateUserDto from "../dao/DTOs/CreateUser.dto.js";
import LoginUserDto from "../dao/DTOs/LoginUser.dto.js";

const userManager = new User();

export const getUsers = async () => {
  const users = await userManager.getUsers();
  return users
    .map((user) => new UserResponseDto(user))
    .filter((user) => user.role !== "admin");
};

export const getByEmail = async (email) => {
  const user = await userManager.getByEmail(email);
  if (!user) return null;
  return new UserResponseDto(user);
};

export const register = async (user) => {
  const newUser = new CreateUserDto(user);
  return await userManager.create(newUser);
};

export const login = async (email) => {
  const user = await userManager.getByEmail(email);
  if (!user) return null;
  return new LoginUserDto(user);
};

export const update = async (uid, user) => {
  const updateUser = new UserResponseDto(user);
  return await userManager.update(uid, updateUser);
};

export const remove = async (uid) => await userManager.delete(uid);
