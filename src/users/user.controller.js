import { response, request } from "express";
import bcryptjs from 'bcryptjs';
import User from './user.model.js';

export const usuariosGet = async(req = request, res = response) => {
    const { limite, desde } = req.query;
    const query = { estado: true };
    const [total, usuarios] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.status(200).json({
        total,
        usuarios
    });
}

export const usuariosPost = async(req, res) => {
    const { username, email, password } = req.body;
    const usuario = new User({ username, email, password });

    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    await usuario.save();

    res.status(200).json({
        usuario
    });
}

export const getUsuarioById = async(req, res) => {
    const { id } = req.params;
    const usuario = await User.findOne({ _id: id });

    res.status(200).json({
        usuario
    })
}

export const usuariosPut = async (req, res) => {
    const { id } = req.params;
    const { _id, password, nuevoPassword, google, email, nuevoEmail, ...resto } = req.body;

    try {
        const usuario = await User.findById(id);
        if (!usuario) {
            return res.status(404).json({ msg: 'User not found' });
        }

        if (usuario.email !== email) {
            return res.status(400).json({ msg: 'The current email does not match with the registered one' });
        }

        if (password && nuevoPassword) {
            const passwordCorrecto = bcryptjs.compareSync(password, usuario.password);
            if (!passwordCorrecto) {
                return res.status(400).json({ msg: 'The current password is incorrect.' });
            }
            const salt = bcryptjs.genSaltSync();
            resto.password = bcryptjs.hashSync(nuevoPassword, salt);
        } else if (password || nuevoPassword) {
            return res.status(400).json({ msg: 'Both the current password and the new password must be provided.' });
        }

        if (nuevoEmail) {
            resto.email = nuevoEmail;
        }
        await User.findByIdAndUpdate(id, resto, { new: true });

        res.status(200).json({
            msg: 'User updated successfully',
            id,
            nuevoEmail: nuevoEmail || email, 
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error updating user'
        });
    }
};


