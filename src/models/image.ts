import { Schema, Types, model } from "mongoose";

export const Image = model("Image", new Schema({
    _id: {
        type: String,
        default: () => new Types.ObjectId().toHexString()
    },
    data: Buffer,
    contentType: { type: String, required: true }
}));




