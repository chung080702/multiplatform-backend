import { Schema, Types, model } from "mongoose";

const SupportRequestSchema = new Schema({
    _id: {
        type: String,
        default: () => new Types.ObjectId().toHexString()
    },
    accountId: { type: String, ref: 'Account', required: true },
    createAt: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: ["Pending", "Rejected", "Active", "Inactive"]
    },
    title: String,
    description: String,
    imageIds: [{ type: String, ref: 'Image' }]
});

SupportRequestSchema.index({ status: 1, createAt: 1 })

export const SupportRequest = model("Support Request", SupportRequestSchema);

