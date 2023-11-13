import { Router } from "express";
import { authenticateToken } from "../controllers/authenController.js";
import { getProfile } from "../controllers/profileController.js";


export class ProfileRoutes {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routers();
    }

    routers(): void {
        this.router.get("/", authenticateToken, getProfile);
    }
}