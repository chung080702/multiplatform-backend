import { Router } from "express";
import { getAccount, getProfile, updateAccount } from "../controllers/accountController.js";
import { authenticateToken } from "../controllers/authenController.js";
import { uploadFile } from "../controllers/imageController.js";


export class AccountRoutes {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routers();
    }

    routers(): void {
        this.router.get("/", authenticateToken, getAccount);
        this.router.put("/:accountId", uploadFile, authenticateToken, updateAccount);
        this.router.get("/:accountId", getProfile);

    }
}