import { TrophyIcon } from "lucide-react"
import { useResume } from "../context/ResumeContext"
import BulletEditor from "./BulletEditor"

const emptyAchievement = { title: '', link: '', description: [] }

const Achievements = ()=>{
    const {resumeData, updateSection} = useResume()
    const achievements = resumeData.achievements

    const addEntry = ()=>updateSection('achievements',[...achievements, {...emptyAchievement}])
    const removeEntry = (index)=>updateSection('achievements',achievements.filter((_, i)=> i!==index))

    const handleChange = (index, field, value)=>{
        const updated = achievements.map((a,i)=>i===index?{...a, [field]:value} : a)
        updateSection('achievements', updated)
    }

    return (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-md">

        <div className="flex items-center justify-between mb-6">
            <div className="text-xl font-semibold text-white mb-6">
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <TrophyIcon />
                    Achievements
                </span>
            </div>

            <button
            onClick={addEntry}
            className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition"
            >
            + Add Achievement
            </button>
        </div>

        {achievements.length === 0 && (
            <p className="text-gray-400 text-sm">
            No achievements yet
            </p>
        )}

        {achievements.map((item, index) => (
            <div
            key={index}
            className="mb-6 border border-white/10 rounded-lg p-5 bg-black/30"
            >

            <div className="flex items-center justify-between mb-4">
                <h4 className="text-white font-medium">
                Achievement #{index + 1}
                </h4>

                <button
                onClick={() => removeEntry(index)}
                className="text-sm text-red-400 hover:text-red-300 transition"
                >
                Remove
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


                <div>
                <label className="block text-sm text-gray-400 mb-2">
                    Title
                </label>

                <input
                    type="text"
                    value={item.title || ''}
                    onChange={(e) =>
                    handleChange(index, 'title', e.target.value)
                    }
                    placeholder="Google Certified DevOps Engineer"
                    className="w-full rounded-md bg-white/5 px-3 py-2 text-white outline-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:outline-indigo-500"
                />
                </div>

                <div>
                    <label className="block text-sm text-gray-400 mb-2">
                        Link
                    </label>

                    <input
                        type="text"
                        value={item.link || ''}
                        onChange={(e) =>
                            handleChange(index, 'link', e.target.value)
                        }
                        placeholder="httpls://"
                        className="w-full rounded-md bg-white/5 px-3 py-2 text-white outline-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:outline-indigo-500"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm text-gray-400 mb-2">
                        Description
                    </label>

                    <BulletEditor
                        points = {item.description.length ? item.description : [""]}
                        setPoints={(newPoints)=>
                            handleChange(index, 'description', newPoints)
                        }
                    />
                </div>

            </div>
            </div>
        ))}
        </div>
    )
}

export default Achievements