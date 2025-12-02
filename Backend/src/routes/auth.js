import express from "express";
import User from "../models/user.js";
import { protect } from "../middleware/auth.js";
import jwt from 'jsonwebtoken';

const router = express.Router();
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw Object.assign(new Error("JWT_SECRET missing"), { status: 500 });
  }
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
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
            role: user.role,
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
            role: user.role,
        });
    } catch(err){
        return next(err);
    }
});

//me
router.get("/me", protect, async (req, res) => {
    res.status(200).json(req.user)
});

//change password
router.post("/change-password", protect, async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword){
        return res.status(400).json({message: "Please fill out all the fields"});
    }
    if(newPassword.length < 8){
        return res.status(400).json({message: "Password must be at least 8 characters"});
    }
    try{
        if (!req.user) {
            return res.status(401).json({ message: "not authorized" });
        }
        const user = await User.findById(req.user._id);
        if (!(await user.matchPassword(oldPassword))){
            return res.status(401).json({message: "Wrong Old Password"});
        }
        user.password = newPassword;
        await user.save();
        res.status(200).json({message: "Password changed successfully"});
    } catch(err){
        res.status(500).json({message: "Server error"});
    }
});

//delete account
router.delete("/delete-account", protect, async (req, res, next) => {
    try{
        if (!req.user) {
            return res.status(401).json({ message: "not authorized" });
        }
        await User.findByIdAndDelete(req.user._id);
        res.json({message: "Account deleted successfully"});
    } catch(err){
        res.status(500).json({message: "Server error"});
    }
});

router.post("/upgrade", protect, async (req, res, next) => {
    try{
        if (!req.user) {
            return res.status(401).json({ message: "not authorized" });
        }
        const user = await User.findById(req.user._id);
        if (user.role === 'pro'){
            return res.status(400).json({message: "User is already a pro!"});
        }
        user.role = 'pro';
        await user.save();
        // return the updated role so frontend can update its state
        res.status(200).json({message: "User upgraded to pro successfully", role: user.role});
    } catch(err){
        res.status(500).json({message: "Server error"});
    }
});

export default router;