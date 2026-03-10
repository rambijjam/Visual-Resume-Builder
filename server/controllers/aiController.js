const { generateBulletPoints, enhanceText } = require("../services/aiService");

exports.generatePoints = async (req,res)=>{
    try{
        const { description } = req.body;
        if(!description){
            return res.status(400).json({message : "Description is required"});
        }

        const points = await generateBulletPoints(description);

        res.json({points});
    }catch(error){
        return res.status(500).json({message : "Error generating bullet points", error : error.message});
    }
}

exports.enhance = async (req, res)=>{
    try{
        const {text} = req.body;
        if(!text){
            return res.status(500).json({message : "Text is required"});
        }

        const enhanced = await enhanceText(text);
        res.json({enhanced});
    }catch(error){
        res.status(500).json({message : "Error enhancing text", error : error.message});
    }
}