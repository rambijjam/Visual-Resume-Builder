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

    if(!/^https?:\/\//.test(url)) return '';
    return url.replace(/[{}\\]/g, '');
};

const buildEducationSection = (education) =>{
    if(!education || education.length === 0) return "";
    return education.map((edu)=>{
        return `
            \\textbf{${escapeLatex(edu.university)}} \\hfill ${escapeLatex(edu.startDate)} -- ${escapeLatex(edu.endDate)} \\\\
            ${escapeLatex(edu.degree)} in ${escapeLatex(edu.field)} ${edu.gpa ? `\\hfill GPA: ${escapeLatex(edu.gpa)}` : ''} \\\\
        `
    }).join('\n');
};

const buildExperienceSection = (experience) =>{
    if(!experience || experience.length === 0) return "";
    return experience.map((exp)=>{
        return `
            \\textbf{${escapeLatex(exp.role)}} at \\textit{${escapeLatex(exp.company)}} \\hfill ${escapeLatex(exp.duration)} \\\\
            \\begin{itemize}[leftmargin=*]
            \\item ${escapeLatex(exp.description || '')}
            \\end{itemize}
        `
    }).join('\n');
};

const buildProjectsSection = (projects) =>{
    if(!projects || projects.length === 0) return "";
    return projects.map((proj)=>{   
        const safeUrl = sanitizeUrl(proj.link);
        return `
            \\textbf{${escapeLatex(proj.name)}} ${safeUrl ? `\\hfill \\href{${safeUrl}}{GitHub}` : ''} \\\\
            ${escapeLatex(proj.description || '')} \\\\
            ${proj.languages && proj.languages.length > 0 ? `\\textit{Technologies: ${proj.languages.map(escapeLatex).join(', ')}}` : ''}
            `;
    }).join('\n');
};

const buildSkillsSection = (skills) =>{
    if(!skills || skills.length === 0) return "";
    const lines = [];
    if (skills.technical && skills.technical.length > 0) lines.push(`\\textbf{Technical:} ${skills.technical.map(escapeLatex).join(', ')}`);
    if (skills.frameworks && skills.frameworks.length > 0) lines.push(`\\textbf{Frameworks:} ${skills.frameworks.map(escapeLatex).join(', ')}`);
    if (skills.languages && skills.languages.length > 0) lines.push(`\\textbf{Languages:} ${skills.languages.map(escapeLatex).join(', ')}`);
    if (skills.soft && skills.soft.length > 0) lines.push(`\\textbf{Soft Skills:} ${skills.soft.map(escapeLatex).join(', ')}`);
    return lines.join(' \\\\\n');
};

const buildAchievementsSection = (achievements) =>{
    if(!achievements || achievements.length === 0) return "";
    return `
        \\begin{itemize}[leftmargin=*]\n` +
        achievements.map((a) => `  \\item \\textbf{${escapeLatex(a.title)}} (${escapeLatex(a.type)}) -- ${escapeLatex(a.description || '')} ${a.date ? `\\hfill ${escapeLatex(a.date)}` : ''}`).join('\n') +
        `\n\\end{itemize}`;
}

exports.generateTex = (resumeData) =>{    
    const templatePath = path.join(__dirname, '../templates/resume.tex');
    let template = fs.readFileSync(templatePath, 'utf-8');
    
    const personal = resumeData.personalDetails || {};

    const replacements = {
        '{{NAME}}': escapeLatex(personal.name || 'Your Name'),
        '{{EMAIL}}': escapeLatex(personal.email || ''),
        '{{PHONE}}': escapeLatex(personal.phone ),
        '{{LINKEDIN}}': escapeLatex(personal.linkedin || ''),
        '{{PORTFOLIO}}': escapeLatex(personal.portfolio || ''),
        '{{LOCATION}}': escapeLatex(personal.location || ''),
        '{{EDUCATION_SECTION}}': buildEducationSection(resumeData.education),
        '{{EXPERIENCE_SECTION}}': buildExperienceSection(resumeData.experience),
        '{{PROJECTS_SECTION}}': buildProjectsSection(resumeData.projects),
        '{{SKILLS_SECTION}}': buildSkillsSection(resumeData.skills),
        '{{ACHIEVEMENTS_SECTION}}': buildAchievementsSection(resumeData.achievements)
    };

    for( const [placeholder, value] of Object.entries(replacements)){
        template = template.split(placeholder).join(value);
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
