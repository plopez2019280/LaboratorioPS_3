import { response, request } from "express";
import bcryptjs from "bcryptjs";
import User from "./user.model.js";

export const usuariosGet = async (req = request, res = response) => {
  const { limite, desde } = req.query;
  const query = { estado: true };
  const [total, usuarios] = await Promise.all([
    User.countDocuments(query),
    User.find(query).skip(Number(desde)).limit(Number(limite)),
  ]);

  res.status(200).json({
    total,
    usuarios,
  });
};

export const usuariosPost = async (req, res) => {
  const { username, email, password } = req.body;
  const usuario = new User({ username, email, password });

  const salt = bcryptjs.genSaltSync();
  usuario.password = bcryptjs.hashSync(password, salt);

  await usuario.save();

  res.status(200).json({
    usuario,
  });
};

export const getUsuarioById = async (req, res) => {
  const { id } = req.params;
  const usuario = await User.findOne({ _id: id });

  res.status(200).json({
    usuario,
  });
};

export const usuariosPut = async (req, res = response) => {
  const { id } = req.params;
  const { _id, password, google, ...resto } = req.body;

  if (password) {
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync(password, salt);
  }

  await User.findByIdAndUpdate(id, resto);

  const usuario = await User.findOne({ _id: id });

  res.status(200).json({
    msg: "Updated User",
    usuario,
  });
};
