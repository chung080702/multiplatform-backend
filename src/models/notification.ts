import { Schema, model } from "mongoose";

export const Notification = model("Notification", new Schema({
    _id: String,
    accountId: String,
    content: String,
    url: String
}))