import { Router } from "express";
import { uploadFile } from "../controllers/imageController.js";
import { acceptJoinGroup, createGroup, deleteMember, getGroup, getGroups, getGroupsOfUser, getJoinGroupRequest, getJoinGroupRequestOfUser, getJoinGroupRequests, getMember, getMembers, joinGroup, rejectJoinGroup, updateGroup, updateMember } from "../controllers/groupController.js";
import { authenticateToken } from "../controllers/authenController.js";


export class GroupRoutes {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routers();
    }

    routers(): void {
        this.router.post("/", uploadFile, authenticateToken, createGroup);
        this.router.put("/:groupId", uploadFile, authenticateToken, updateGroup);
        this.router.get("/:groupId", getGroup);
        this.router.get("/page/:pageNumber", getGroups);
        this.router.get("/user/page/:pageNumber", authenticateToken, getGroupsOfUser);
        this.router.post("/:groupId/join", joinGroup);
        this.router.put("/:groupId/join/:joinRequestId", acceptJoinGroup);
        this.router.delete("/:groupId/join/:joinRequestId", rejectJoinGroup);
        this.router.get("/:groupId/join/page/:pageNumber", authenticateToken, getJoinGroupRequests);
        this.router.get("/join/:joinRequestId", getJoinGroupRequest);
        this.router.get("/:groupId/user/join", authenticateToken, getJoinGroupRequestOfUser);
        this.router.get("/:groupId/member/page/:pageNumber", getMembers);
        this.router.get("/:groupId/member/:memberId", getMember);
        this.router.delete("/:groupId/member/:memberId", deleteMember);
        this.router.put("/:groupId/member/:memberId", updateMember);
    }
}