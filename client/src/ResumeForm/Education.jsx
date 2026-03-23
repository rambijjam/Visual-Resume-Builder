import { GraduationCapIcon } from "lucide-react";
import { useResume } from "../context/ResumeContext";

const emptyEdu = { university: '', degree: '', field: '', gpa: '', startDate: '', endDate: '' }


const Education = ()=>{
    const { resumeData , updateSection } = useResume();
    const education = resumeData.education

    const addEntry = ()=> updateSection('education', [...education, {...emptyEdu}])

    const removeEntry = (index)=> updateSection('education', education.filter((_,i)=> i!==index))

    const handleChange = (index, field, value)=>{
        const updated = education.map((edu,i)=> i===index ? {...edu, [field]:value}:edu)
        updateSection('education', updated)
    }

    return (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-md">
            <div className="flex items-center justify-between mb-6">
                
                <div className="text-xl font-semibold text-white mb-6">
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <GraduationCapIcon />
                        Education
                    </span>
                </div>

                <button
                    onClick={addEntry}
                    className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition">
                    + Add Education
                </button>
            </div>

            {education.length === 0 && (
                <p className="text-gray-400 text-sm">
                    No education entries yet. Click "Add Education" to start.
                </p>
            )}

            {education.map((edu, index) => (
            <div
                key={index}
                className="mb-6 border border-white/10 rounded-lg p-5 bg-black/30"
            >

                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-white font-medium">
                        Education #{index + 1}
                    </h4>

                    <button
                        onClick={() => removeEntry(index)}
                        className="text-sm text-red-400 hover:text-red-300 transition">
                        Remove
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        { field: "university", label: "University/Institution", placeholder: "MIT" },
                        { field: "degree", label: "Degree", placeholder: "Bachelor of Science" },
                        { field: "field", label: "Field of Study", placeholder: "Computer Science" },
                        { field: "gpa", label: "GPA (optional)", placeholder: "3.8/4.0" },
                        { field: "startDate", label: "Start Date", placeholder: "Aug 2019" },
                        { field: "endDate", label: "End Date", placeholder: "May 2023" },
                    ].map(({ field, label, placeholder }) => (
                        <div key={field}>
                            <label className="block text-sm text-gray-400 mb-2">
                                {label}
                            </label>

                            <input
                                type="text"
                                value={edu[field] || ""}
                                onChange={(e) =>
                                handleChange(index, field, e.target.value)
                                }
                                placeholder={placeholder}
                                className="w-full rounded-md bg-white/5 px-3 py-2 text-white outline outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:outline-indigo-500 transition"
                                />
                        </div>
                    ))}
                </div>
            </div>
        ))}
        </div>
    );
}

export default Education