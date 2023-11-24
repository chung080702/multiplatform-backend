import { Schema, Types, model } from "mongoose";

export const Group = model("Group", new Schema({
    _id: {
        type: String,
        default: () => new Types.ObjectId().toHexString()
    },
    name: String,
    description: String,
    create: { type: Date, default: Date.now },
    imageId: String
}))

