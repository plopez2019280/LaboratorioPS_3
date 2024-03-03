import mongoose from "mongoose";

const CommentsSchema = mongoose.Schema({
    idUser: {
        type: String,
        ref: "User",
        required: [true, "The userId is obligatory"],
    },
    userName: {
        type: String,
        ref: "User",
        required: [true, "The username is obligatory"],
    },
    idPublication: {
        type: String,
        ref: "Publications",
        required: [true, "The post is obligatory"],
    },
    descriptionComment: {
        type: String,
        required: [true, "The description is obligatory"],
    },
    estado: {
        type: Boolean,
        default: true,
    }
});

export default mongoose.model('Comments', CommentsSchema);