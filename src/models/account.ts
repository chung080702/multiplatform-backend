import { Schema, model, Types } from "mongoose";

export const Account = model("Account", new Schema({
    _id: {
        type: String,
        default: () => new Types.ObjectId().toHexString()
    },
    password: String,
    fullName: String,
    telephone: String,
    email: String,
    role: {
        type: String,
        enum: ["admin", "member"]
    },
    imageId: String
}));




