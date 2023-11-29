import { Schema, Types, model } from "mongoose";

const EventSchema = new Schema({
    _id: {
        type: String,
        default: () => new Types.ObjectId().toHexString()
    },
    supportRequestId: { type: String, ref: 'Support Request' },
    name: String,
    start: Date,
    end: Date,
    address: String,
    description: String,
    status: {
        type: String,
        enum: ["Pending", "Accepted", "Rejected"]
    },
    imageIds: [{ type: String, ref: 'Image' }]
})

EventSchema.index({ start: 1, end: 1 });

export const Event = model("Event", EventSchema);