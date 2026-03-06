const jwt = require('jsonwebtoken');

const authMiddleware = (req,res,next)=>{
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if(!token){
        return res.status(401).json({message:"Unauthorized"});
    }   

    const secret = process.env.JWT_SECRET;
    if(!secret){
        return res.status(500).json({message:"Server configuration error"});
    }

    try{
        const decoded = jwt.verify(token,secret);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({message:"Invalid token"});
    }
}

module.exports = authMiddleware;
