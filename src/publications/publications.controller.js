import { response, request } from "express";
import Publications from './publications.model.js';

export const publicationsGet = async(req = request, res = response) => {
    const { limite, desde } = req.query;
    const query = { estado: true };
    const [total, publications] = await Promise.all([
        Publications.countDocuments(query),
        Publications.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.status(200).json({
        msg: "-Post list-",
        total,
        publications
    });
}

export const publicationsPost = async(req, res) => {
    const { title, category, description } = req.body;
    const publications = new Publications({ title, category, description });

    await publications.save();

    res.status(200).json({
        msg: "-Post uploaded successfully!",
        publications
    });
}

export const getPublicationsById = async(req, res) => {
    const { id } = req.params;
    const publications = await Publications.findOne({ _id: id });

    res.status(200).json({
        msg: "-Successful search!-",
        publications
    })
}

export const publicationsPut = async(req, res = response) => {
    const { id } = req.params;
    const { _id, ...resto } = req.body;

    await Publications.findByIdAndUpdate(id, resto);

    const publications = await Publications.findOne({ _id: id });

    res.status(200).json({
        msg: '-Post successfully updated!-',
        publications
    });
}


export const publicationsDelete = async(req, res) => {
    const { id } = req.params;

    const publications = await Publications.findByIdAndUpdate(id, { estado: false });
    const publicationsAutentic = req.publications;

    res.status(200).json({ msg: '-Post deleted successfully!-', publications, publicationsAutentic });
}