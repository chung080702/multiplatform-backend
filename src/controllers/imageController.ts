import { NextFunction, Request, Response } from "express";
import multer from "multer"
import logger from "../logger.js";
import path from "path";
const rootPath = path.resolve(process.cwd());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

export async function uploadFiles(req: Request, res: Response, next: NextFunction) {
    try {
        upload.array("image")(req, res, (err) => {
            if (err) throw new Error(err);
            if (Array.isArray(req.files))
                req.body.imageUrls = req.files.map((e: any) => e.path)
            next()
        })
    }
    catch (e: any) {
        logger.error(e);
        res.status(400).send(e)
    }
}

export async function uploadFile(req: Request, res: Response, next: NextFunction) {
    try {
        upload.single("image")(req, res, (err) => {
            if (err) throw new Error(err);
            req.body.imageUrl = req.file?.path;
            next()
        })
    }
    catch (e: any) {
        logger.error(e);
        res.status(400).send(e)
    }
}

export async function getFile(req: Request, res: Response, next: NextFunction) {
    try {
        let { imageUrl } = req.body;
        res.sendFile(path.join(rootPath, imageUrl))
    }
    catch (e: any) {
        logger.error(e);
        res.status(400).send(e)
    }
}