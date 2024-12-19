import { Router } from "express";
import { userSignIn, userSignUp } from "../controller/usuarios-controller.js";

const userRouter=Router();

userRouter.post("/sign-up",userSignUp);
userRouter.post("/sign-in",userSignIn);

export default userRouter;