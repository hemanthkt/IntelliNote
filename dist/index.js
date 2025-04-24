"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("./db");
const middleware_1 = require("./middleware");
const utils_1 = require("./utils");
mongoose_1.default.connect("mongodb+srv://hmkt:12345@cluster0.lue3xn6.mongodb.net/IntelliNote?retryWrites=true&w=majority&appName=Cluster0");
app.use(express_1.default.json());
const JWT_PASSWORD = "12345";
const cors_1 = __importDefault(require("cors"));
app.use((0, cors_1.default)());
app.post("/api/v1/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        yield db_1.UserModel.create({
            username, password
        });
        res.json({
            message: "You are signed up"
        });
    }
    catch (error) {
        res.json({
            message: "Username already exists"
        });
    }
}));
app.post("/api/v1/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const existingUser = yield db_1.UserModel.findOne({
        username, password
    });
    if (existingUser) {
        const token = jsonwebtoken_1.default.sign({
            id: existingUser._id
        }, JWT_PASSWORD);
        res.json({
            token: token
        });
    }
}));
app.post("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { type, link } = req.body;
    yield db_1.ContentModel.create({
        link,
        type,
        title: req.body.title,
        // @ts-ignore
        userId: req.userId,
        tags: []
    });
    res.json({
        message: "Content added"
    });
}));
app.get("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore   
    const userId = req.userId;
    if (userId) {
        const allContent = yield db_1.ContentModel.find({
            userId: userId
        }).populate("userId", "username");
        res.json(allContent);
    }
    else {
        res.json({
            message: "invalid credentials"
        });
    }
}));
app.delete("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contentId = req.body.contentId;
    yield db_1.ContentModel.deleteMany({
        contentId,
        // @ts-ignore
        userId: req.userId
    });
}));
app.post("/api/v1/brain/share", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const share = req.body.share;
    const hash = (0, utils_1.random)(10);
    if (share) {
        const existingLink = yield db_1.LinksModel.findOne({
            userId: req.userId
        });
        if (existingLink) {
            res.json({
                hash: existingLink.hash
            });
            return;
        }
        yield db_1.LinksModel.create({
            userId: req.userId,
            hash: hash
        });
    }
    else {
        yield db_1.LinksModel.deleteOne({
            userId: req.userId
        });
    }
    res.json({
        message: "/share/" + hash
    });
}));
app.get("/api/v1/brain/:shareLink", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hash = req.params.shareLink;
    const link = yield db_1.LinksModel.findOne({
        hash
    });
    if (!link) {
        res.json({
            message: "Link in invalid"
        });
        return;
    }
    const user = yield db_1.UserModel.findOne({
        _id: link.userId
    });
    if (!user) {
        res.status(411).json({
            message: "Error ideally should not occur"
        });
        return;
    }
    const content = yield db_1.ContentModel.find({
        userId: link.userId
    });
    res.json({
        username: user.username,
        content
    });
}));
app.listen(3000);
