import { Schema, model } from "mongoose";

export const SupportRequest = model("SupportRequest", new Schema({
    _id: String,
    accountId: String,
    create: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: ["pending", "reject", "active", "inactive"]
    },
    title: String,
    description: String,
    imageUrls: [String]
}));

