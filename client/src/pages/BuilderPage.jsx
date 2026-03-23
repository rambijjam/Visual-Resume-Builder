import { useState } from "react";
import ResumeFormContainer from "../ResumeForm/ResumeFormContainer";
import ResumePreview from "../ResumePreview/ResumePreview";

const BuilderPage = ()=>{
    const [previewUrl, setPreviewUrl] = useState(null)
    const [compiling, setCompiling] = useState(false)

    return(
        <div className="flex h-[calc(100vh-70px)] bg-gray-950 text-white">

            <div className="w-1/2 border-r border-gray-800 overflow-y-auto p-6 scroll-smooth">

                <ResumeFormContainer
                setPreviewUrl={setPreviewUrl}
                setCompiling={setCompiling}
                />
            </div>

            <div className="w-1/2 flex items-center justify-center">
                <ResumePreview
                url={previewUrl}
                compiling={compiling}
                />
            </div>
        </div>
    )
}

export default BuilderPage;