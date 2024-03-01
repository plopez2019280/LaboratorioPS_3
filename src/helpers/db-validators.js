import User from "../users/user.model.js";

export const existenteEmail = async (email = "") => {
  const existeEmail = await User.findOne({ email });
  if (existeEmail) {
    throw new Error(`The email ${email} has already been registered`);
  }
};

export const existeUsuarioById = async (id = "") => {
  const existUser = await User.findById(id);
  if (!existUser) {
    throw new Error(`The ID: ${email} does not exists`);
  }
};

