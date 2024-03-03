import User from "../users/user.model.js";
import Publications from '../publications/publications.model.js';
import Comments from '../comments/comment.model.js';

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

export const existePublicationsById = async(id = '') => {
  const existPublication = await Publications.findById(id);
  if (!existPublication) {
      throw new Error(`The ID: ${title} Does not exist`);
  }
};

export const existeCommentsById = async (id = '') => {
  const existComments = await Comments.findById(id);
  if (!existComments) {
      throw new Error(`The ID: ${descriptionComment} does NOT EXIST`);
  }
};

