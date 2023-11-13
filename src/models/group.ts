import { Schema, model } from "mongoose";

export const Group = model("Group", new Schema({
    _id: String,
    name: String,
    description: String,
    create: { type: Date, default: Date.now },
    imageUrl: String
}))

