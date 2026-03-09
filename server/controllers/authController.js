const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (user)=>{
    const secret = process.env.SECRET_KEY;
    if(!secret){
        throw new Error("JWT_SECRET is not defined in environment variables");
    }
    const token = jwt.sign(
        {id : user._id, email: user.email, name : user.name},
        secret, 
        {expiresIn: "1h"}
    );
    return token;   
}

exports.register = async (req,res)=>{
    try{
        // console.log("Register Route is Called");
        const {name, email, password} = req.body;
        if(!email || !password || !name){
            return res.status(400).json({message:"Please provide all required fields"});
        }

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"User already exists"});
        }   
        const user = await User.create({name, email, password});
        const token = generateToken(user);
        return res.status(201).json({token, user : {id: user._id, name: user.name, email: user.email}});
    }catch(error){
        // console.log(error);
        res.status(500).json({message:"Server error", error: error.message});
    }
};

exports.login = async (req,res)=>{
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({message:"Please provide email and password"});
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"Invalid credentials"});
        }
        const isMatch = await user.comparePassword(password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"});
        }
        const token = generateToken(user);
        return res.status(200).json({token, user : {id: user._id, name: user.name, email: user.email}});    
    }catch(error){
        res.status(500).json({message:"Server error", error: error.message});
    }
};

exports.getMe = async (req,res)=>{
    try{
        const user = await User.findById(req.user.id).select("-password");
        if(!user){ 
            return res.status(404).json({message:"User not found"});
        }
        return res.status(200).json({user});
    }catch(error){
        res.status(500).json({message:"Server error", error: error.message});
    }
};



