import { Schema, Types, model } from "mongoose";

const GroupContributeSchema = new Schema({
    _id: {
        type: String,
        default: () => new Types.ObjectId().toHexString()
    },
    eventId: { type: String, ref: 'Event', required: true },
    groupId: { type: String, ref: 'Group', required: true },
    accountId: { type: String, ref: 'Account', required: true },
    createAt: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: ["Pending", "Accepted", "Rejected"]
    },
    imageIds: [String]
})

GroupContributeSchema.index({ createAt: 1 });

export const GroupContribute = model("Group Contribute", GroupContributeSchema);



const PersonalContributeSchema = new Schema({
    _id: {
        type: String,
        default: () => new Types.ObjectId().toHexString()
    },
    supportRequestId: { type: String, ref: 'Support Request', required: true },
    accountId: { type: String, ref: 'Account', required: true },
    createAt: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: ["Pending", "Accepted", "Rejected"]
    },
    imageIds: [String]
})

PersonalContributeSchema.index({ createAt: 1 });

export const PersonalContribute = model("Personal Contribute", PersonalContributeSchema)

