const axios = require('axios');

const getHeaders = ()=>{
    const headers  = { Accept : 'application/vnd.github.v3+json' };
    if(process.env.GITHUB_TOKEN){
        headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }
    return headers;
}

exports.getrepoDetails = async (owner, repo) => {
    try{
        const headers = getHeaders();
        const response = await Promise.all([
            axios.get(`https://api.github.com/repos/${owner}/${repo}`, { headers }),
            axios.get(`https://api.github.com/repos/${owner}/${repo}/languages`, { headers }),
        ]);
        
        let readme = '';
        try{
            const readmeRes = await axios.get(`https://api.github.com/repos/${owner}/${repo}/readme`, { headers });
            readme = Buffer.from(readmeRes.data.content, 'base64').toString('utf-8');
        }catch(e){
            readme = 'No README available';
        }

        const repoData = response[0].data;
        return{
            name : repoData.name,
            description : repoData.description || 'No description',
            languages : Object.keys(response[1].data),
            stars : repoData.stargazers_count,
            forks : repoData.forks_count,
            url : repoData.html_url,
            readme,
        };
    }catch(error){
        // console.log(error)
        if(error.response && error.response.status === 404){    
            throw new Error('Repository not found');
        }else if(error.response && error.response.status === 403){  
            throw new Error('GitHub API rate limit exceeded');
        }else{
            throw new Error('Error fetching repository details');
        }
    }
};