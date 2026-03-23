const path = require('path');
const Resume = require('../models/Resume');
const { generateTex, saveTex } = require('../services/resumeService');
const fs = require("fs");


const util = require("util");
const exec = util.promisify(require("child_process").exec);

exports.previewResume = async (req, res)=>{
  try{
    const resumeData = req.body
    const texContent = generateTex(resumeData);
    const tempDir = path.join(__dirname, '../temp')

    if(!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    const baseName = `preview_${Date.now()}`

    const texPath = path.join(tempDir, `${baseName}.tex`)
    const pdfPath = path.join(tempDir, `${baseName}.pdf`)

    fs.writeFileSync(texPath, texContent)

    //console.log("compiling....")

    try{
      const {stdout, stderr} = await exec(
        `pdflatex -output-directory="${tempDir}" "${texPath}"`,
        {timeout : 10000}
      );

      //console.log(stdout);
      //console.log(stderr);
    }catch(err){
      console.log("Latex Error", err.stderr || err);
      return res.status(500).json({
        message : "Latex compile failed",
        error : err.stderr
      })
    }

    await exec(`pdflatex -output-directory="${tempDir}" "${texPath}"`)

    res.sendFile(path.resolve(pdfPath))

    //clean files
    setTimeout(()=>{
      const files = [".tex",".pdf",".aux",".log",".out"]

      files.forEach(ext=>{
        const file = path.join(tempDir, `${baseName}${ext}`)
        if(fs.existsSync(file)) fs.unlinkSync(file)
      })
    }, 10000)
  }catch(err){
    console.log(err)
    res.status(500).json({message : "Preview Compiler Failed", error : err.stderr|| err.message||err})
  }
}

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

const checkResume = (resumeData)=>{
  const hasContent = (value)=>{
    if(typeof value == 'string') return value.trim().length>0;

    if(Array.isArray(value)){
      return value.some((item)=>hasContent(item));
    }

    if(typeof value == 'object'){
      return Object.values(value).some((v)=>hasContent(v));
    }

    return false;
  }

  return !hasContent(resumeData)
}

exports.generateResume = async (req, res) => {
  try {
    const resumeData = req.body;
    if(checkResume(resumeData)) return res.status(400).json({message : 'Please enter something to generate the resume'})
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

    res.json({ message: 'Resume generated successfully', resumeId: resume._id, texContent, filename,pdfName });
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

