import api from "./api";

export const getRepo = (url)=>
    api.get(`/github/repo?url=${encodeURIComponent(url)}`)


