let groq = null;

exports.getGroqClient = ()=>{
    if(!process.env.GROQ_API_KEY){
        throw new Error("GROQ_API_KEY is not configured");
    }
    if(!groq){
        const  Groq  = require('groq-sdk');
        groq = new Groq({apiKey : process.env.GROQ_API_KEY});
    }

    return groq;
}

exports.generateBulletPoints = async (description)=>{
    const client = getGroqClient();
    if(!client){
        return [
            `• Developed and implemented ${description}`,
            `• Collaborated with team members to deliver ${description}`,
            `• Improved efficiency through ${description}`,
        ];
    }
    try{
        const response = await client.chat.completions.create({
            model : 'llama-3.1-8b-instant',
            messages : [
                {
                    role : 'system', 
                    content : 'You are a professional resume writer. Generate 3-5 concise, impactful bullet points for a resume based on the provided description. Each bullet point should start with a strong action verb.',
                }, 
                { 
                    role : 'user',
                    content : `Generate bullet points for ${description}`,
                }
            ], 
            temperature : 0.7,
        });
        const text = response.choices[0].message.content;
        // console.log(text);
        return text.split('\n').filter((line)=> line.trim().length > 0);
    }catch(error){
        // console.log(error);
        return [`• ${description}`];
    }
};

exports.enhanceText = async (text) =>{
    const client = getGroqClient();

    if(!client){
        return `Enhanced ${text}`;
    }

    try{
        const response = await client.chat.completions.create({
            model : 'llama-3.1-8b-instant',
            messages : [
                {
                    role: 'system',
                    content: 'You are a professional resume writer. Enhance the provided text to make it more professional, concise, and impactful for a resume.',
                },
                {
                    role : 'user',
                    content : `Enhance this resume text : ${text}`,
                },
            ],
            temperature : 0.7,
        })

        return response.choices[0].message.content;
    }catch(error){
        return text;
    }
};