import User from "../models/user.js";
import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith("bearer")){
        try{
        token = req.headers.authorization.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_Secret)

        req.user = await User.findById(decoded.id).select("-password")

        return next();
        } catch(err){
            console.error("token verification failed: ", err.message);
            return res.status(401).json({message: "not authorized, token failed"})
        }
    }
    return res.status(401).json({message: "not authorized, token failed"})
}

//Authorization: bearer <token>