import { Router } from "express";
import { acceptPersonalContribute, acceptSupportRequest, createPersonalContribute, createSupportRequest, getPersonalContribute, getPersonalContributesOfSupportRequest, getSupportRequet, getSupportRequets, rejectPersonalContribute, rejectSupportRequest, updateSupportRequest } from "../controllers/supportRequestController.js";
import { authenticateToken } from "../controllers/authenController.js";
import { uploadFiles } from "../controllers/imageController.js";

export class SupportRequestRoutes {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routers();
    }

    routers(): void {
        this.router.post("/", uploadFiles, authenticateToken, createSupportRequest);
        this.router.get("/page/:pageNumber", getSupportRequets);
        this.router.get("/:supportRequestId", getSupportRequet);
        this.router.put("/:supportRequestId", uploadFiles, authenticateToken, updateSupportRequest);
        this.router.post("/:supportRequestId", acceptSupportRequest);
        this.router.delete("/:supportRequestId", rejectSupportRequest);
        this.router.post("/:supportRequestId/contribute", uploadFiles, authenticateToken, createPersonalContribute);
        this.router.get("/:supportRequestId/contribute/page/:pageNumber", getPersonalContributesOfSupportRequest);
        this.router.get("/contribute/:personalContributeId", getPersonalContribute);
        this.router.post("/contribute/:personalContributeId", acceptPersonalContribute);
        this.router.delete("/contribute/:personalContributeId", rejectPersonalContribute);
    }
}