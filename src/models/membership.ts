import { Schema, Types, model } from "mongoose";

const MembershipSchema = new Schema({
    _id: {
        type: String,
        default: () => new Types.ObjectId().toHexString()
    },
    accountId: { type: String, ref: 'Account', required: true },
    groupId: { type: String, ref: 'Group', required: true },
    role: {
        type: String,
        enum: ["Admin", "Member"]
    },
    status: {
        type: String,
        enum: ["Pending", "Accepted", "Rejected"]
    },
    createAt: { type: Date, default: Date.now }
})

MembershipSchema.index({ groupId: 1, createAt: 1 });

export const Membership = model("Membership", MembershipSchema)