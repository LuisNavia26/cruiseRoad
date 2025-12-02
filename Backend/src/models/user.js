import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    firstname: { type: String, required: true, trim: true },
    lastname:  { type: String, required: true, trim: true },
    username:  { type: String, required: true, unique: true, trim: true, lowercase: true, index: true },
    password:  { type: String, required: true },
    role:      { type: String, enum: ['user', 'pro'], default: 'user' }
  }, {timestamps: true});

userSchema.pre("save", async function(next){
    if (!this.isModified("password")) return next();
    try{
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next(); 
} catch (err){
    return next(err);
}
});

userSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

const User = mongoose.model("User", userSchema);

export default User;