import mongoose from 'mongoose';

const UserSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, "The title is obligatory"],
    },
    category: {
        type: String,
        required: [true, "The category is obligatory"],
    },
    description: {
        type: String,
        required: [true, "The description is obligatory"],
    },
    img: {
        type: String,
    },
    estado: {
        type: Boolean,
        default: true,
    },
    google: {
        type: Boolean,
        default: true,
    },
});

export default mongoose.model('Publications', UserSchema);