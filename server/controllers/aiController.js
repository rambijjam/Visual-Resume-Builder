const { enhanceText, pointsfromReadme, generatePointsfromDescription } = require("../services/aiService");

// exports.generatePoints = async (req,res)=>{
//     try{
//         const { description } = req.body;
//         if(!description){
//             return res.status(400).json({message : "Description is required"});
//         }

//         const points = await generateBulletPoints(description);

//         res.json({points});
//     }catch(error){
//         //console.log(error)
//         return res.status(500).json({message : "Error generating bullet points", error : error.message});
//     }
// }

exports.enhance = async (req, res)=>{
    try{
        const {text} = req.body;
        // console.log(text)
        if(!text){
            return res.status(400).json({message : "Text is required"});
        }

        const enhanced = await enhanceText(text);
        //console.log(enhanced)
        res.json({enhanced : enhanced});
    }catch(error){
        res.status(500).json({message : "Error enhancing text", error : error.message});
    }
}

const isGoodReadme = (readme)=>{
    if(typeof readme !== 'string') return false;

    readme = readme.trim();

    if(readme.length<100) return false;
    if(!readme.includes("##")) return false;
    
    const boilerplates = [
        "todo : write readme",
        "todo: write readme",
        "getting started with create react app",
        "project setup",
        "this is node.js project bootstrapped with",
    ];

    const contentLower = readme.toLowerCase();
    const hasBoilerPlate = boilerplates.some(bp=>contentLower.includes(bp));
    if(hasBoilerPlate) return false;
    return true;
}

exports.generateProjectBullets = async (req,res)=>{
    try{
        const {readme, description} = req.body;

        let bullets;
        if(isGoodReadme(readme)) bullets = await pointsfromReadme(readme);
        else if(description) bullets = await generatePointsfromDescription(description);
        else bullets = ["Built a project demonstrating core functionlity and features "]

        res.json({points : bullets});
    }catch(error){
        res.status(500).json({message : "Error Reading Readme", error:error.message});
    }
}