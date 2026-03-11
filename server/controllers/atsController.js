const fs = require('fs');
const { checkATSScore } = require('../services/atsService');

exports.checkATS = async (req, res)=>{
    try{
        let resumeText = req.body.resumeText || '';
        const jobDescription = req.body.jobDescription;

        if(req.file){
            try{
                const pdfParse = require('pdf-parse');
                const pdfData = await pdfParse(fs.readFileSync(req.file.path))
                resumeText = pdfData.text;
            }catch(error){
                res.status(400).json({message : 'Error Parsing PDF', error : error.message});
            }
        }

        if(!resumeText){
            res.status(400).json({message : "Text or PDF is required"});
        }

        const result = await checkATSScore(resumeText, jobDescription);
        res.json(result);
    }catch(error){
        console.log(error);
        res.status(500).json({message : "Error Checking ATS Score", error : error.message});
    }
}