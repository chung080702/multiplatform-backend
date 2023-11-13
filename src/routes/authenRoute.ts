import { Router } from "express";
import { login, register } from "../controllers/authenController.js";
import { uploadFile } from "../controllers/imageController.js";


export class AuthenRoutes {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routers();
    }

    routers(): void {
        this.router.post("/login", login);
        this.router.post("/register", uploadFile, register);
    }
}