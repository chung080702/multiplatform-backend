import { Schema, Types, model } from "mongoose";

const JoinRequestSchema = new Schema({
    _id: {
        type: String,
        default: () => new Types.ObjectId().toHexString()
    },
    accountId: { type: String, ref: 'Account', required: true },
    groupId: { type: String, ref: 'Group', required: true },
    status: {
        type: String,
        enum: ["Pending", "Accepted", "Rejected"]
    },
    createAt: { type: Date, default: Date.now }
})

JoinRequestSchema.index({ groupId: 1, status: 1 });

export const JoinRequest = model("Join Request", JoinRequestSchema);