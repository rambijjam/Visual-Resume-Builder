import { useState } from "react"
import { useResume } from "../context/ResumeContext"
import { WrenchIcon } from "lucide-react"

const SkillCategory = ({title, category, skills, onAdd, onRemove})=>{
    const [input, setInput] = useState('')

    const handleAdd = ()=>{
        const trimmed = input.trim()
        if(trimmed && !skills.includes(trimmed)){
            onAdd(category, trimmed)
            setInput('')
        }
    }

    return(
        <div className="mb-6">

        <label className="block text-sm text-gray-400 mb-2">
            {title}
        </label>

        <div className="flex gap-3 mb-3">

            <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                e.preventDefault()
                handleAdd()
                }
            }}
            placeholder={`Add ${title.toLowerCase()}...`}
            className="flex-1 rounded-md bg-white/5 px-3 py-2 text-white outline-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:outline-indigo-500"
            />

            <button
            onClick={handleAdd}
            className="px-4 py-2 rounded-md bg-indigo-500 text-sm font-semibold text-white hover:bg-indigo-400 transition"
            >
            Add
            </button>

        </div>

        <div className="flex flex-wrap gap-2">

            {skills.map((skill) => (
            <span
                key={skill}
                className="flex items-center gap-2 px-3 py-1 text-sm bg-white/10 text-gray-200 rounded-md"
            >
                {skill}
                <button
                onClick={() => onRemove(category, skill)}
                className="text-red-400 hover:text-red-300"
                >
                ×
                </button>
            </span>
            ))}

        </div>

        </div>
    )
}

const Skills = ()=>{
    const {resumeData, updateSection} = useResume();
    const skills = resumeData.skills || {}
    const addSkill = (category, skill)=>{
        updateSection('skills', {...skills, [category]:[...(skills[category]||[]), skill]})
    }

    const removeSkill = (category, skill)=>{
        updateSection('skills', {...skills, [category] : skills[category].filter((s)=>s !== skill ) })
    }

    return (
        <div className = "bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-md">
            <div className="text-xl font-semibold text-white mb-6">
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <WrenchIcon />
                    Skills
                </span>
            </div>
            <SkillCategory title= "Technical Skills" category="technical" skills = {skills.technical || []} onAdd={addSkill} onRemove={removeSkill}/>
            <SkillCategory title= "Frameworks & Libraries" category="frameworks" skills = {skills.frameworks || []} onAdd={addSkill} onRemove={removeSkill}/>
            <SkillCategory title= "Programming Languages" category="languages" skills = {skills.languages || []} onAdd={addSkill} onRemove={removeSkill}/>
            <SkillCategory title= "Soft Skills" category="soft" skills = {skills.soft || []} onAdd={addSkill} onRemove={removeSkill}/>
        </div>
    )
}

export default Skills