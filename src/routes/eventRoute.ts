import { Router } from "express";
import { acceptEvent, acceptGroupContribute, createGroupContribute, getEvent, getEvents, getGroupContribute, getGroupContributesOfEvent, rejectEvent, rejectGroupContribute } from "../controllers/eventController.js";
import { uploadFiles } from "../controllers/imageController.js";
import { authenticateToken } from "../controllers/authenController.js";


export class EventRoutes {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routers();
    }

    routers(): void {
        this.router.get("/page/:pageNumber/search/:search?", getEvents);
        this.router.get("/:eventId", getEvent);
        this.router.post("/:eventId", acceptEvent);
        this.router.delete("/:eventId", rejectEvent);
        this.router.post("/:eventId/contribute", uploadFiles, authenticateToken, createGroupContribute);
        this.router.get("/:eventId/contribute", getGroupContributesOfEvent);
        this.router.get("/contribute/:groupContributeId", getGroupContribute);
        this.router.post("/contribute/:groupContributeId", acceptGroupContribute);
        this.router.delete("/contribute/:groupContributeId", rejectGroupContribute);
    }
}