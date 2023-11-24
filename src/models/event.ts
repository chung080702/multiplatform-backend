import { Schema, Types, model } from "mongoose";

export const Event = model("Event", new Schema({
    _id: {
        type: String,
        default: () => new Types.ObjectId().toHexString()
    },
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
    imageIds: [String]
}));