import { createContext, useContext, useState } from "react";

const ResumeContext = createContext(null);

const initialResumeData = {
    personalDetails: { name: '', email: '', phone: '', linkedin: '', portfolio: '', location: '' },
    education: [],
    experience: [],
    skills: { technical: [], soft: [], languages: [], frameworks: [] },
    achievements: [],
    projects: [],
}

export const ResumeProvider = ({children})=>{
    const [resumeData, setResumeData] = useState(initialResumeData);

    const updateSection = (section, data)=>{
        setResumeData((prev)=>({...prev, [section]:data}))
    }

    const resetResume = ()=>{
        setResumeData(initialResumeData);
    }

    return(
        <ResumeContext.Provider value = {{resumeData, updateSection, resetResume}}>
            {children}
        </ResumeContext.Provider>
    )
}

export const useResume = ()=>{
    const context = useContext(ResumeContext);
    if(!context) throw new Error('useResume must be within the ResumeProvider')
    return context 
}

export default ResumeContext
