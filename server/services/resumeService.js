const fs = require("fs");
const path = require("path");

const escapeLatex = (str) =>{
    if(!str) return "";

    const replacements = {
        '\\' : '\\textbackslash{}',
        '&' : '\\&',
        '%' : '\\%',
        '$' : '\\$',
        '#' : '\\#',
        '_' : '\\_',
        '{' : '\\{',
        '}' : '\\}',
        '~' : '\\textasciitilde{}',
        '^' : '\\textasciicircum{}'
    };

    return String(str).replace(/([\\&%$#_{}~^])/g, match => replacements[match] || match);
};

const sanitizeUrl = (url) =>{
    if(!url) return "";

    let clean = url.trim();

    if(!/^https?:\/\//i.test(clean)) clean = "https://"+clean;
    return clean.replace(/[{}\\]/g, '');
};


const buildEducationSection = (education) =>{
    if(!education || education.length === 0) return "";
    const items = education
      .map((edu) => {
        if (!edu.university) return "";

        return `
  \\resumeSubheading{${escapeLatex(edu.university)}}{}{${escapeLatex(
          edu.degree
        )} in ${escapeLatex(edu.field)}}{${escapeLatex(
          edu.startDate
        )} -- ${escapeLatex(edu.endDate)}}
  `;
      })
      .filter(Boolean);

    if (items.length === 0) return "";

    return `
  \\resumeSubHeadingListStart
  ${items.join("\n")}
  \\resumeSubHeadingListEnd
  `;
};

const buildExperienceSection = (experience) =>{
    if(!experience || experience.length === 0) return "";
  const items = experience
      .map((exp) => {
        const bullets = Array.isArray(exp.description)
          ? exp.description
          : [exp.description];

        const validBullets = bullets
          .filter((b) => typeof b === "string")
          .map((b) => b.trim())
          .filter((b) => b.length > 0);

        if (!exp.role || validBullets.length === 0) return "";

        return `
  \\resumeSubheading{${escapeLatex(exp.role)}}{${escapeLatex(
          exp.duration
        )}}{${escapeLatex(exp.company)}}{}
  \\resumeItemListStart
  ${validBullets.map((b) => `\\resumeItem{${escapeLatex(b)}}`).join("\n")}
  \\resumeItemListEnd
  `;
      })
      .filter(Boolean);

    if (items.length === 0) return "";

    return `
  \\resumeSubHeadingListStart
  ${items.join("\n")}
  \\resumeSubHeadingListEnd
  `;
};

const buildProjectsSection = (projects) =>{
    if(!projects || projects.length === 0) return "";
  const items = projects
      .map((proj) => {
        const bullets = Array.isArray(proj.bullets)
          ? proj.bullets
          : [];

        const validBullets = bullets
          .filter((b) => typeof b === "string")
          .map((b) => b.trim())
          .filter((b) => b.length > 0);

        if (!proj.name || validBullets.length === 0) return "";

        return `
\\resumeSubheading
{${escapeLatex(proj.name)}}{${escapeLatex(proj.duration)}}
{${proj.languages.map(escapeLatex).join(", ")}}
{\\href{${sanitizeUrl(proj.link)}}{GitHub}}

\\resumeItemListStart
${validBullets.map(b => `\\resumeItem{${escapeLatex(b)}}`).join("\n")}
\\resumeItemListEnd
`;
      })
      .filter(Boolean);

    if (items.length === 0) return "";

    return `
  \\resumeSubHeadingListStart
  ${items.join("\n")}
  \\resumeSubHeadingListEnd
  `;
};

const buildSkillsSection = (skills) => {
    if (!skills) return "";

    const parts = [];

    if (skills.languages?.length) {
        parts.push(`\\textbf{Languages}: ${skills.languages.map(escapeLatex).join(", ")}`);
    }

    if (skills.frameworks?.length) {
        parts.push(`\\textbf{Frameworks}: ${skills.frameworks.map(escapeLatex).join(", ")}`);
    }

    if (skills.technical?.length) {
        parts.push(`\\textbf{Technical}: ${skills.technical.map(escapeLatex).join(", ")}`);
    }

    if (skills.soft?.length) {
        parts.push(`\\textbf{Soft Skills}: ${skills.soft.map(escapeLatex).join(", ")}`);
    }

    if (parts.length === 0) return "";

    return `
\\resumeSubHeadingListStart
${parts.map(p => `\\resumeItem{${p}}`).join("\n")}
\\resumeSubHeadingListEnd
`;
};

const buildAchievementsSection = (achievements) =>{
    if(!achievements || achievements.length === 0) return "";
    const items = achievements
        .map((a)=>{
          const validBullets = a.description
            .filter((b)=> typeof b === 'string')
            .map((b)=> b.trim())
            .filter((b)=>b.length>0)

          if(!a.title || validBullets.length === 0) return "";

        return `
          \\resumeSubheading{${escapeLatex(a.title)}}{${
            a.link ? `\\href{${sanitizeUrl(a.link)}}{Link}` : ""
          }}{}{}
          \\resumeItemListStart
          ${validBullets.map((b) => `\\resumeItem{${escapeLatex(b)}}`).join("\n")}
          \\resumeItemListEnd
          `;
    }).filter(Boolean);

    if(items.length === 0) return "";

return `
\\resumeSubHeadingListStart
${items.join("\n")}
\\resumeSubHeadingListEnd
`;
}

const buildSections = (resumeData) => {
  const sections = [];

  const education = buildEducationSection(resumeData.education);
  if (education) {
    sections.push(`
\\section{Education}
${education}
`);
  }

  const experience = buildExperienceSection(resumeData.experience);
  if (experience) {
    sections.push(`
\\section{Experience}
${experience}
`);
  }

  const projects = buildProjectsSection(resumeData.projects);
  if (projects) {
    sections.push(`
\\section{Projects}
${projects}
`);
  }

  const skills = buildSkillsSection(resumeData.skills);
  if (skills) {
    sections.push(`
\\section{Skills}
${skills}
`);
  }

  const achievements = buildAchievementsSection(resumeData.achievements);
  if (achievements) {
    sections.push(`
\\section{Achievements}
${achievements}
`);
  }

  return sections.join("\n").trim();
};


exports.generateTex = (resumeData) =>{    
    const templatePath = path.join(__dirname, '../templates/resume.tex');
    let template = fs.readFileSync(templatePath, 'utf-8');
    
    const personal = resumeData.personalDetails || {};

    const sections = buildSections(resumeData)
  
    const contactParts = [];
    if(personal.phone){
      contactParts.push(`\\faPhone\\ ${escapeLatex(personal.phone)}`);
    }

    if(personal.email){
      contactParts.push(
        `\\faEnvelope\\ \\href{mailto:${personal.email}}{${escapeLatex(personal.email)}}`
      );
    }

    if(personal.linkedin){
      contactParts.push(
        `\\faLinkedin\\ \\href{${sanitizeUrl(personal.linkedin)}}{LinkedIn}`
      )
    }

    if(personal.portfolio){
      contactParts.push(
        `\\faGlobe\\ \\href{${sanitizeUrl(personal.portfolio)}}{Portfolio}`
      )
    }

    if(personal.location){
      contactParts.push(`\\faMapMarker\\ ${escapeLatex(personal.location)}`);
    }

    const contactLine = contactParts.length? contactParts.join(" \\quad $|$ \\quad"):"";

    const replacements = {
        '{{NAME}}': escapeLatex(personal.name || 'Your Name'),
        '{{CONTACT_LINE}}' : contactLine,
        '{{LOCATION}}': personal.location ? `\\faMpaMarker*\\ ${escapeLatex(personal.location)}`:"",
        '{{SECTIONS}}' : sections
    };

    for( const [placeholder, value] of Object.entries(replacements)){
        template = template.replace(new RegExp(placeholder, "g"),value);
    }

    return template;

};

exports.saveTex = (content, filename) =>{
    const outputDir = path.join(__dirname, '../output');
    if(!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, {recursive:true});

    const filePath = path.join(outputDir, filename);
    fs.writeFileSync(filePath, content, 'utf-8');

    return filePath;
};
