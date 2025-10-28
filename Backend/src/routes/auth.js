import express from "express";
import User from "../models/user.js";
import { protect } from "../middleware/auth.js";
import jwt from 'jsonwebtoken';

const router = express.Router();
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw Object.assign(new Error("JWT_SECRET missing"), { status: 500 });
  }
  return jwt.sign({ sub: id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};
//register
router.post('/register', async (req, res, next) => {
    try{
        const firstname = req.body.firstname ?? req.body.firstName;
        const lastname  = req.body.lastname  ?? req.body.lastName;
        let { username, password } = req.body;
        if (!firstname || !lastname || !username || !password){
            return res.status(400).json({message: "please fill out all the fields"})
        }
        username = username.trim().toLowerCase();
        const userExists = await User.findOne({username});

        if (userExists){
            return res.status(409).json({message: "username already exists"})
        }

        const user = await User.create({firstname, lastname, username, password});
        return res.status(201).json({
            id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            username: user.username,
        });
    } catch (err){
        if(err.code === 11000){
            return res.status(400).json({message: "username already exists"});
        }
        return next(err);
    }
});

//login
router.post('/login', async (req, res, next) => {
    let {username, password} = req.body;
    try {
        if (!username || !password) {
            return res.status(400).json({message: "please fill out all the fields"});
        }
        username = username.trim().toLowerCase();
        const user = await User.findOne({username});

        if(!user || !(await user.matchPassword(password))){
            return res.status(401).json({message: "invalid credentials"});
        }
        const token = generateToken(user._id);
        return res.status(200).json({
            id: user._id,
            username: user.username,
            token,
        });
    } catch(err){
        //res.status(500).json({message: "server error"});
        return next(err);
    }
});

//me
router.get("/me", protect, async (req, res) => {
    res.status(200).json(req.user)
});



export default router;