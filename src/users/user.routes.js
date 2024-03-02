import { Router } from "express";
import { check } from "express-validator";
import {
  usuariosGet,
  usuariosPost,
  getUsuarioById,
  usuariosPut,
} from "./user.controller.js";
import {
  existenteEmail,
  existeUsuarioById,
} from "../helpers/db-validators.js";
import { validarCampos } from "../middlewares/validarCampos.js";

const router = Router();

router.get("/", usuariosGet);

router.get(
  "/:id", [
  check("id", "The ID entered is not valid").isMongoId(),
  check("id").custom(existeUsuarioById),
  validarCampos,
],
  getUsuarioById
);

router.post(
  "/", [
  check("username", "The username is required").not().isEmpty(),
  check("password", "Password must be greater than 6 characters").isLength({
    min: 6,
  }),
  check("email", "The email entered is not valid ").isEmail(),
  check("email").custom(existenteEmail),
  validarCampos,
],
  usuariosPost
);


router.put(
  "/:id",
  [
    check("id", "The ID entered is not valid").isMongoId(),
    check("id").custom(existeUsuarioById),
    check('email', 'The actual email is obligatory').not().isEmpty(),
    check('nuevoEmail', 'The new email is obligatory').isEmail(),
    check('password', 'The actual password is obligatory').not().isEmpty(),
    check('nuevoPassword', 'The new password is obligatory').not().isEmpty(),
    validarCampos,
  ],
  usuariosPut
);

export default router;