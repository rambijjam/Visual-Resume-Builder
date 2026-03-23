import api from "./api";

export const previewResume = async (data)=>{
    const res = await api.post('/resume/preview',data,{
        responseType : 'blob'
    })
    return res.data
}

export const generateResume = async (data)=>{
    const res = await api.post('/resume/generate',data)
    return res
}

export const getHistory = async ()=>{
    const res = await api.get('/resume/history')
    return res.data
}

export const downloadResumeTex = async (id)=>{
    const res = await api.get(`/resume/${id}/download-tex`, {responseType:'blob'})
    return res.data
}

export const downloadResumePdf = async (id)=>{
    const res = await api.get(`/resume/${id}/download-pdf`, {responseType : 'blob'})
    return res.data
}