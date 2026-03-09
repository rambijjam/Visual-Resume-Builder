const path = require('path');
const Resume = require('../models/Resume');
const { generateTex, saveTex } = require('../services/resumeService');
const fs = require("fs");


const util = require("util");
const exec = util.promisify(require("child_process").exec);

const deleteFiles = async (outputDir, baseName)=>{
  const fs = require('fs/promises');
  const extensionsToDelete = [".aux", ".log", ".out"];

  for(const ext of extensionsToDelete){
    const junkFilePath = path.join(outputDir,`${baseName}${ext}`);
    try{
      await fs.unlink(junkFilePath);
    }catch(err){
      if(err.code !== 'ENOENT') console.error(`Failed to delete ${junkFilePath}:`,err);
    }
  }
}

exports.generateResume = async (req, res) => {
  try {
    const resumeData = req.body;
    const texContent = generateTex(resumeData); // we have template for the latex content
    const filename = `resume_${req.user.id}_${Date.now()}.tex`; 
    const filePath = saveTex(texContent, filename); 

    const pdfName = filename.replace(/\.tex$/,'.pdf');
    const pdfPath = path.join(__dirname,"../output",pdfName);
    const outputDir = path.join(__dirname,"../output");

    await exec(`pdflatex -output-directory="${outputDir}" "${filePath}"`);
    await exec(`pdflatex -output-directory="${outputDir}" "${filePath}"`);

    const baseName = filename.replace(/\.tex$/,'');
    await deleteFiles(outputDir, baseName);

    const resume = await Resume.create({
      userId: req.user.id,
      resumeData,
      generatedTexPath : filePath,
      generatedPdfPath: pdfPath,
    });

    res.json({ message: 'Resume generated successfully', resumeId: resume._id, texContent, filename });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error generating resume', error: error.message });
  }
};

exports.getHistory = async (req,res) =>{
    try{
        const resumes = await Resume.find({userId : req.user._id}).sort({createdAt : -1});
        res.json(resumes);
    }catch(error){
        res.status(500).json({message : "Error fetching resume history", error : error.message});
    }
};

exports.downloadResumeTex = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user.id });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    res.download(resume.generatedTexPath, `resume_${resume._id}.tex`);
  } catch (error) {
    res.status(500).json({ message: 'Error downloading resume', error: error.message });
  }
};

exports.downloadPDF = async (req,res)=>{
  try{
    const resume = await Resume.findOne({_id : req.params.id,userId : req.user.id})
    if(!resume){
      return res.status(404).json({ message: 'Resume not found' });
    }

    if(!fs.existsSync(resume.generatedPdfPath)){
      return res.status(404).json({message : "PDF not found on server"});
    }

    res.download(resume.generatedPdfPath, `resume_${resume._id}.pdf`);
  }catch(error){
    res.status(500).json({message : 'Error downloading resume', error : error.message});
  }
};

