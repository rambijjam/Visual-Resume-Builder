import { useEffect, useState } from "react";
import Achievements from "./Achievements";
import Education from "./Education";
import Experience from "./Experience";
import GitHubProjects from "./GitHubProjects";
import PersonalDetails from "./PersonalDetails";
import Skills from "./Skills";
import { useResume } from "../context/ResumeContext";
import { downloadResumePdf, downloadResumeTex, generateResume, previewResume } from "../services/resumeService";
import FormProgress from "./FormProgress";
import { CheckIcon } from "lucide-react";
import { toast } from "react-toastify";

const steps = [PersonalDetails, Education, Experience, Skills, Achievements, GitHubProjects];

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

const ResumeFormContainer = ({setPreviewUrl, setCompiling})=>{
    const [currentStep, setCurrentStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [generated, setGenerated] = useState(null)
    const {resumeData} = useResume()

    const CurrentComponent = steps[currentStep-1]

    useEffect(()=>{
        if (checkResume(resumeData)) return;
        const timer = setTimeout(async()=>{
            try{
                setCompiling(true)
                const blob = await previewResume(resumeData)
                console.log(resumeData)

                const url = window.URL.createObjectURL(blob)

                setPreviewUrl(prev=>{
                    if(prev) URL.revokeObjectURL(prev)
                    return url
                })
            }catch(error){
                console.log(error)
                console.log("preview failed")
            }finally{
                setCompiling(false)
            }
        }, 1000)
        return ()=>clearTimeout(timer)
    },[
        resumeData
      ]
    )

    const handleNext = ()=>setCurrentStep((s)=>Math.min(s+1,6))
    const handlePrev = ()=>setCurrentStep((s)=>Math.max(1,s-1))

    const handleSubmit = async ()=>{
        setLoading(true)
        try{
            const res = await generateResume(resumeData)
            console.log(res)
            setGenerated(res.data)
            toast.success('Resume generated successfully!')
        }catch(err){
            console.log(err)
            toast.error(err.response?.data?.message || 'Failed to generate resume') 
        }finally{
            setLoading(false)
        }
    }

    const handleDownloadPDF = async (id)=>{

        const blob = await downloadResumePdf(id)
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')

        a.href = url
        a.download = generated.pdfName || `resume_${id}.pdf`

        document.body.appendChild(a)
        a.click()
        URL.revokeObjectURL(url)
        a.remove()
    }

    const handleDownloadTex = async (id)=>{

        const blob = await downloadResumeTex(id)
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')

        a.href = url
        a.download =  `resume_${id}.tex`

        document.body.appendChild(a)
        a.click()
        URL.revokeObjectURL(url)
        a.remove()
    }
    
    return (
        <div className="max-w-5xl mx-auto p-6">
            <FormProgress currentStep={currentStep} />

            <div className="mt-8 bg-gray-900 border border-gray-800 rounded-xl shadow-lg">
                <CurrentComponent />
            </div>

            {generated && (currentStep === 6) && (
                <div className="mt-6 bg-green-900/20 border border-green-600 rounded-lg p-4 flex items-center justify-between">

                <div className="flex items-center gap-2 text-green-400">
                    <CheckIcon size={18} />
                    Resume Generated Successfully
                </div>

                <div className="flex gap-3">

                    <button
                    onClick={() => handleDownloadPDF(generated.resumeId)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium"
                    >
                    Download PDF
                    </button>

                    <button
                    onClick={() => handleDownloadTex(generated.resumeId)}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium"
                    >
                    Download TEX
                    </button>

                </div>
                </div>
            )}

            <div className="flex justify-between mt-8">

                <button
                onClick={handlePrev}
                disabled={currentStep === 1}
                className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-40"
                >
                Previous
                </button>

                {currentStep < 6 ? (
                <button
                    onClick={handleNext}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium"
                >
                    Next
                </button>
                ) : (
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-5 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-medium disabled:opacity-50"
                >
                    {loading ? "Generating..." : "Generate Resume"}
                </button>
                )}

            </div>
        </div>
    )
}

export default ResumeFormContainer