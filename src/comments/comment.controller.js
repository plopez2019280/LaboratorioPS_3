import {response, request} from "express";
import Comment from '../comments/comment.model.js';
import Usuario from '../users/user.model.js';
import jwt from 'jsonwebtoken';

export const commentsPost = async (req, res) => {
    const user = req.usuario;
    const {descriptionComment, userName} = req.body;


    try{
        if (!descriptionComment) {
            return res.status(400).json({
                msg: 'Please, The description of the comments is required'
            });
        }

        if (!userName) {
            return res.status(400).json({
                msg: 'Please, The username is required'
            });
        }

        const comment = new Comment({
            descriptionComment,
            idUser: user.id,
            userName,
            idPublication: req.idPublication, 
        });

        await comment.save();

        res.status(200).json({
            msg: 'The Comment ADDED successfully',
            comment
        });

    }catch(error) {
        console.error('ERROR - Creating Comment: ', error);
        res.status(400).json({error: "ERROR - Creating Comment"});
    }
};

export const commentsGet = async (req = request, res = response) => {
    const {limite, desde} = req.query;
    const query = {estado: true};
    const [total, comments] = await Promise.all([
        Comment.countDocuments(query),
        Comment.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.status(200).json({
        total,
        comments
    });
};

export const commentsPut = async (req, res = response) => {
    const { id } = req.params;
    const { _id, ...resto } = req.body;

    try {
        const token = req.header("x-token");
        if (!token) {
            return res.status(401).json({ msg: "No TOKEN in the application" });
        }

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const usuario = await Usuario.findById(uid);
        if (!usuario) {
            return res.status(401).json({ msg: 'The user DOES NOT EXIST in the database.' });
        }

        const comment = await Comment.findById(id);
        if (!comment || comment.idUser.toString() !== uid) {
            return res.status(403).json({ msg: 'You do not have permission to update this comment' });
        }

        await Comment.findByIdAndUpdate(id, resto);

        const updatedComment = await Comment.findOne({ _id: id });

        res.status(200).json({ msg: 'Comment successfully updated', comment: updatedComment });
    } catch (error) {
        console.error('ERROR - Actualizando el comentario:', error);
        res.status(500).json({ error: 'ERROR - Actualizando el comentario' });
    }
};

export const commentsDelete = async (req, res) => {
    const { id } = req.params;

    try {
        const token = req.header("x-token");
        if (!token) {
            return res.status(401).json({ msg: "There is NOT token in the request" });
        }
        
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const usuario = await Usuario.findById(uid);
        
        if (!usuario) {
            return res.status(401).json({ msg: "The User does NOT EXIST in the DB" });
        }

        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({ msg: "The Comment NOT FOUND" });
        }

        if (comment.idUser.toString() !== uid) {
            return res.status(403).json({ msg: "You do NOT have permission to delete this comment" });
        }

        comment.estado = false;
        await comment.save();

        res.status(200).json({ msg: "Comment DELETED successfully", comment, usuario });

    } catch (error) {
        console.error("ERROR - Deleting Comment: ", error);
        res.status(400).json({ error: "ERROR - Deleting Comment" });
    }
};