import { useState } from "react"
import { useResume } from "../context/ResumeContext"
import api from '../services/api'
import { toast } from "react-toastify"
import BulletEditor from "./BulletEditor"
import { BriefcaseBusinessIcon, BriefcaseMedicalIcon, SparkleIcon } from 'lucide-react'

const emptyExp = { company: '', role: '', duration: '', description: [] }

const Experience = ()=>{
    const {resumeData, updateSection } = useResume()
    const experience = resumeData.experience
    const [enhancing, setEnhancing] = useState(null)

    const addEntry = ()=> updateSection('experience', [...experience, {...emptyExp}])
    const removeEntry = (index)=>updateSection( 'experience',experience.filter((_,ind) => index !== ind))

    const handleChange = (index, field, value)=>{
        const updated = experience.map((exp,i)=> i===index ? {...exp, [field]:value} : exp)
        updateSection('experience', updated)
    }

    const handleEnhance = async (index)=>{
        const exp = experience[index]
        const validPoints = exp.description.map((p)=>p.trim()).filter((p)=>p.length>0);

        if(validPoints.length === 0){
            toast.error("Please add some bullet points first");
            return ;
        }

        setEnhancing(index)
        try{
            const res = await api.post('/ai/enhance', {
                text: validPoints.join("\n"),
            })

            console.log(res);

            const bullets = res.data.enhanced;

            handleChange(index, 'description', bullets)
            toast.success('Descritpion Enhanced')
        }catch(error){
            console.log(error)
            toast.error('Failed to enhance. Check your API key.')
        }finally{
            setEnhancing(null)
        }
    }

    return (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-md">

        <div className="flex items-center justify-between mb-6">
            <div className="text-xl font-semibold text-white mb-6">
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <BriefcaseBusinessIcon />
                    Experience
                </span>
            </div>

            <button
            onClick={addEntry}
            className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition"
            >
            + Add Experience
            </button>
        </div>

        {experience.length === 0 && (
            <p className="text-gray-400 text-sm">
            No experience entries yet.
            </p>
        )}

        {experience.map((exp, index) => (
            <div
            key={index}
            className="mb-6 border border-white/10 rounded-lg p-5 bg-black/30"
            >

            <div className="flex items-center justify-between mb-4">
                <h4 className="text-white font-medium">
                Experience #{index + 1}
                </h4>

                <button
                onClick={() => removeEntry(index)}
                className="text-sm text-red-400 hover:text-red-300 transition"
                >
                Remove
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {[
                { field: "company", label: "Company", placeholder: "Google" },
                { field: "role", label: "Role / Title", placeholder: "Software Engineer" },
                { field: "duration", label: "Duration", placeholder: "Jan 2022 - Present" },
                ].map(({ field, label, placeholder }) => (
                <div key={field}>

                    <label className="block text-sm text-gray-400 mb-2">
                    {label}
                    </label>

                    <input
                    type="text"
                    value={exp[field] || ""}
                    onChange={(e) =>
                        handleChange(index, field, e.target.value)
                    }
                    placeholder={placeholder}
                    className="w-full rounded-md bg-white/5 px-3 py-2 text-white outline-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:outline-indigo-500 transition"
                    />

                </div>
                ))}

            </div>

            <div className="mt-4">

                <label className="block text-sm text-gray-400 mb-2">
                Description
                </label>

                <BulletEditor 
                    points = {exp.description.length?exp.description :[""]}
                    setPoints={(newPoints)=>handleChange(index, 'description', newPoints)}
                />

                <div className="mt-3 flex justify-end">
                    <button
                        onClick={() => handleEnhance(index)}
                        disabled={enhancing === index}
                        className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 disabled:opacity-50"
                    >
                        {enhancing === index ? "Enhancing..." : 
                            (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                <SparkleIcon />
                                Enhance All
                            </span>
                            ) 
                        }
                    </button>
                </div>

            </div>

            </div>
        ))}
        </div>
    )
}

export default Experience