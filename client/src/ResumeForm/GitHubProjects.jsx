import { useState } from "react";
import { useResume } from "../context/ResumeContext"
import { toast } from "react-toastify";
import { GitForkIcon, GithubIcon, SparkleIcon, StarIcon } from 'lucide-react'
import { getRepo } from "../services/githubService";
import api from "../services/api";
import BulletEditor from "./BulletEditor";

const GitHubProjects = ()=>{
    const {resumeData, updateSection} = useResume();
    const projects = resumeData.projects || [];
    const [url, setUrl] = useState('')
    const [fetching, setFetching] = useState(false)
    const [generatingPoints, setGeneratingPoints] = useState(null)

    const handleFetch = async ()=>{
        if(!url) { toast.warning('Enter a GitHub URL'); return }
        setFetching(true)
        try{
            const res = await getRepo(url)
            const readme = res.data.readme || "";
            const description = res.data.description || "";
            const bullets_response = await api.post('/ai/generate-project-bullets',{
                readme,
                description
            })
            const name = res.data.name;
            const bullets = bullets_response.data.points;
            const languages = res.data.languages || [];
            const newProject = {
                    name, 
                    duration : '', 
                    languages, 
                    bullets,
                    link : url
            }
            updateSection('projects', [...projects, newProject])
            setUrl('')
            toast.success(`Fetched : ${res.data.name}`)
        }catch(err){
            toast.error(err.response?.data?.message || 'Failed to fetch repo')
        }finally{
            setFetching(false)
        }
    }   

    // const handleGeneratePoints = async(index)=>{
    //     const proj = projects[index]
    //     setGeneratingPoints(index)
    //     try{
    //         const res = await api.post('/ai/generate-points', {
    //             description : `${proj.name} : ${proj.description}. Technologies : ${(proj.languages || []).join(', ')}`
    //         })
    //         const updated = projects.map((p,i)=>{
    //             return(
    //                 i===index ? {...p, bullets : res.data.points} : p
    //             )
    //         })

    //         updateSection('projects', updated)
    //         toast.success('Bullet points generated!')
    //     }catch(err){
    //         console.log(err)
    //         toast.error('Failed to generated points')
    //     }finally{
    //         setGeneratingPoints(null)
    //     }
    // }

    const handleChange = (index, field, value)=>{
        const updatedProjects = projects.map((p,ind)=>ind == index?{...p,[field]:value}:p);
        updateSection("projects", updatedProjects);
    }

    const removeProject = (index)=>{
        updateSection('projects',projects.filter((_,i) => i!==index))
    }

    return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-md">

        <div className="text-xl font-semibold text-white mb-6">
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <GithubIcon />
                GitHub Projects
            </span>
        </div>

        <div className="flex gap-3 mb-6">

        <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleFetch()}
            placeholder="https://github.com/username/repo"
            className="flex-1 rounded-md bg-white/5 px-3 py-2 text-white  outline-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:outline-indigo-500"
        />


        <button
            onClick={handleFetch}
            disabled={fetching}
            className="px-4 py-2 rounded-md bg-indigo-500 text-sm font-semibold text-white hover:bg-indigo-400 disabled:opacity-50 transition"
        >
            {fetching ? "Fetching..." : "Fetch Repo"}
        </button>

        </div>

        {projects.length === 0 && (
        <p className="text-gray-400 text-sm">
            No projects added yet. Paste a GitHub URL above.
        </p>
        )}

        {projects.map((proj, index) => (
        <div
            key={index}
            className="mb-6 rounded-xl border border-white/10 bg-linear-to-br from-white/5 to-white/0 p-5 shadow-sm hover:shadow-md transition"
        >

            <div className="flex items-center justify-between mb-4">
            <input
                value={proj.name || ""}
                onChange={(e) => handleChange(index, "name", e.target.value)}
                placeholder="Project Name"
                className="bg-transparent text-white text-lg font-semibold border-b border-white/10 focus:outline-none focus:border-indigo-500"
            />

            <button
                onClick={() => removeProject(index)}
                className="text-xs px-2 py-1 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
            >
                Remove
            </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">

            <div>
                <label className="text-xs text-gray-400">Duration</label>
                <input
                type="text"
                value={proj.duration || ""}
                onChange={(e) => handleChange(index, "duration", e.target.value)}
                placeholder="Aug 2023 - Present"
                className="w-full mt-1 rounded-md bg-white/5 px-3 py-2 text-sm text-white outline-none border border-white/10 focus:border-indigo-500"
                />
            </div>

            <div>
                <label className="text-xs text-gray-400">Technologies</label>
                <input
                value={(proj.languages || []).join(", ")}
                onChange={(e) =>
                    handleChange(
                    index,
                    "languages",
                    e.target.value.split(",").map((l) => l.trim())
                    )
                }
                placeholder="React, Node.js, MongoDB"
                className="w-full mt-1 rounded-md bg-white/5 px-3 py-2 text-sm text-white outline-none border border-white/10 focus:border-indigo-500"
                />
            </div>
            </div>


            <div className="flex items-center justify-between text-sm text-gray-400 mb-4">

            <div className="flex gap-4">
                <span className="flex items-center gap-1">
                <StarIcon className="w-4 h-4" />
                {proj.stars || 0}
                </span>

                <span className="flex items-center gap-1">
                <GitForkIcon className="w-4 h-4" />
                {proj.forks || 0}
                </span>
            </div>

            {proj.html_url && (
                <a
                href={proj.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300 text-xs"
                >
                View Repo →
                </a>
            )}
            </div>

            <div className="bg-black/30 border border-white/10 rounded-lg p-4">
            <p className="text-xs text-gray-400 mb-2">Bullet Points</p>

            <BulletEditor
                points={proj.bullets && proj.bullets.length > 0 ? proj.bullets : [""]}
                setPoints={(newPoints) =>
                handleChange(index, "bullets", newPoints)
                }
            />
            </div>

        </div>
        ))}

    </div>
    )
}

export default GitHubProjects;