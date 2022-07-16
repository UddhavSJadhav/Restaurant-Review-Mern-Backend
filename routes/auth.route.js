import express from "express";
import AuthCtrl from "../controllers/auth.controller.js";

const router = express.Router();

router.route("/signin").post(AuthCtrl.apiSignIn);
router.route("/signup").post(AuthCtrl.apiSignUp);
router.route("/checktoken").post(AuthCtrl.apiCheckToken);

export default router;
