import { Schema, model } from "mongoose";

export const Event = model("Event", new Schema({
    _id: String,
    supportRequestId: String,
    name: String,
    start: Date,
    end: Date,
    address: String,
    description: String,
    status: {
        type: String,
        enum: ["pending", "accept", "reject"]
    },
    imageUrls: [String]
}));