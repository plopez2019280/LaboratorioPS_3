import jwt from "jsonwebtoken";
import Usuario from "../users/user.model.js";

export const validarJWT = async (req, res, next) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      msg: "There is no token in the request",
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    const usuario = await Usuario.findById(uid);
    if (!usuario) {
      return res.status(401).json({
        msg: "User does not exists in the database",
      });
    }

    if (!usuario.estado) {
      return res.status(401).json({
        msg: "Invalid token - the user does not exists",
      });
    }

    req.usuario = usuario;

    next();
  } catch (e) {
    console.log(e),
      res.status(401).json({
        msg: "Invalid token",
      });
  }
};
