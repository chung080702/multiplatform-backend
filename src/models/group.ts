import { Schema, Types, model } from "mongoose";

const GroupSchema = new Schema({
    _id: {
        type: String,
        default: () => new Types.ObjectId().toHexString()
    },
    name: String,
    description: String,
    createAt: { type: Date, default: Date.now },
    imageId: { type: String, ref: 'Image' }
})

GroupSchema.index({ createAt: 1 })

export const Group = model("Group", GroupSchema)

