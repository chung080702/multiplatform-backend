import { Router } from "express";
import { acceptPersonalContribute, acceptSupportRequest, createPersonalContribute, createSupportRequest, getEventsOfSupportRequest, getPendingSupportRequets, getPersonalContribute, getPersonalContributesOfSupportRequest, getSupportRequet, getSupportRequets, getSupportRequetsOfUser, rejectPersonalContribute, rejectSupportRequest, updateSupportRequest } from "../controllers/supportRequestController.js";
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
        this.router.get("/page/:pageNumber/search/:search?", getSupportRequets);
        this.router.get("/page/:pageNumber/pending/search/:search?", getPendingSupportRequets);
        this.router.get("/account/:accountId/page/:pageNumber/search/:search?", getSupportRequetsOfUser);
        this.router.get("/:supportRequestId", getSupportRequet);
        this.router.put("/:supportRequestId", uploadFiles, authenticateToken, updateSupportRequest);
        this.router.post("/:supportRequestId", acceptSupportRequest);
        this.router.delete("/:supportRequestId", rejectSupportRequest);
        this.router.post("/:supportRequestId/contribute", uploadFiles, authenticateToken, createPersonalContribute);
        this.router.get("/:supportRequestId/contribute/page/:pageNumber", getPersonalContributesOfSupportRequest);
        this.router.get("/contribute/:personalContributeId", getPersonalContribute);
        this.router.post("/contribute/:personalContributeId", acceptPersonalContribute);
        this.router.delete("/contribute/:personalContributeId", rejectPersonalContribute);
        this.router.get("/:supportRequestId/event/page/:pageNumber", getEventsOfSupportRequest);
    }
}