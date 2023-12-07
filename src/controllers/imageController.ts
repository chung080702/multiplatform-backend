import { NextFunction, Request, Response } from "express";
import logger from "../logger.js";

import multer from "multer";
import { Image } from "../models/image.js";

const upload = multer();

export async function uploadFile(req: Request, res: Response, next: NextFunction) {
    try {
        upload.single("image")(req, res, async (err) => {
            if (err) throw new Error(err);
            if (req.file != null) {
                const newImage = new Image({
                    data: req.file.buffer,
                    contentType: req.file.mimetype,
                });
                await newImage.save();
                req.body.imageId = newImage._id;
            }
            next();
        })

    }
    catch (e: any) {
        logger.error(e);
        res.status(400).send(e)
    }
}

export async function uploadFiles(req: Request, res: Response, next: NextFunction) {
    try {
        upload.array("image")(req, res, async (err) => {
            if (err) throw new Error(err);
            let imageIds = [];
            if (Array.isArray(req.files)) {
                for (const file of req.files) {
                    const newImage = new Image({
                        data: file.buffer,
                        contentType: file.mimetype
                    });

                    await newImage.save();
                    imageIds.push(newImage._id)
                }

            }
            req.body.imageIds = imageIds;
            next();
        })


    }
    catch (e: any) {
        logger.error(e);
        res.status(400).send(e)
    }
}

export async function getFile(req: Request, res: Response, next: NextFunction) {
    try {
        let { fileId } = req.params;
        let image = await Image.findById(fileId);
        if (image == null) throw new Error("Invalid image id");
        res.contentType(image.contentType);
        res.send(image.data)
    }
    catch (e: any) {
        logger.error(e);
        res.status(400).send(e)
    }
}