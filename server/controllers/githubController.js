const { getrepoDetails } = require('../services/githubService');

exports.getRepo = async (req, res)=>{
    try{
        const { url } = req.query;
        if(!url){
            return res.status(400).json({message: 'Github Repo URL is required'});
        }

        const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
        if(!match){
            return res.status(400).json({message: 'Invalid Github Repo URL'});
        }

        const [, owner, repo] = match;

        const repoData = await getrepoDetails(owner, repo.replace(/\.git$/,''));
        res.json(repoData);
        //console.log(repoData)
    }catch(error){
        //console.log(error)
        return res.status(500).json({message: ' Error Fetching Github Repo', error: error.message});
    }
}