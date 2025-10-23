import express from "express";
import User from "../models/user.js";
import { protect } from "../middleware/auth.js";
import jwt from 'jsonwebtoken';

const router = express.Router();

//register
router.post('/register', async (req, res) => {
    const {username, email, password} = req.body;
    try{
        if (!username || !email || !password){
            return res.status(400).json({message: "please fill out all the fields"})
        }
        const userExists = await User.findOne({email});
        if (userExists){
            return res.status(400).json({message: "user already exists"})
        }

        const user = await User.create({username, email, password});
        const token = generateToken(user._id);
        res.status(201).json({
            id: user._id,
            username: user.username,
            email: user.email,
            token,
        });
    } catch (err){
        res.status(500).json({message: "server error"});
    }
});

//login
router.post('/login', async (req, res) => {
    const {email, password} = req.body;
    try {
        if (!email || !password) {
            return res
                .status(400)
                .json({message: "please fill out all the fields"});
        }
        const user = await User.findOne({email});

        if(!user || !(await user.matchPassword(password))){
            return res
                .status(401)
                .json({message: "invalid credentials"});
        }
        const token = generateToken(user._id);
        res.status(200).json({
            id: user._id,
            username: user.username,
            email: user.email,
            token,
            
        });
    } catch(err){
        res.status(500).json({message: "server error"});
    }
});

//me
router.get("/me", protect, async (req, res) => {
    res.status(200).json(req.user)
});

//generate JWT token
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "30d"})
}

export default router;