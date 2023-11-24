import { Schema, Types, model } from "mongoose";

export const SupportRequest = model("SupportRequest", new Schema({
    _id: {
        type: String,
        default: () => new Types.ObjectId().toHexString()
    },
    accountId: String,
    create: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: ["pending", "reject", "active", "inactive"]
    },
    title: String,
    description: String,
    imageIds: [String]
}));

