import { Schema, model } from "mongoose";

export const Account = model("Account", new Schema({
    _id: String,
    password: String,
    fullName: String,
    telephone: String,
    email: String,
    role: {
        type: String,
        enum: ["admin", "member"]
    },
    imageUrl: String
}));




