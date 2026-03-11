const { getGroqClient } = require("./aiService")

exports.checkATSScore = async (resumeText, jobDescription)=>{
    const client = getGroqClient();
    if(!client){
        return {
        score: 72,
        breakdown: {
            keywords: 70,
            formatting: 80,
            relevance: 65,
            completeness: 75,
        },
        suggestions: [
            'Add more quantifiable achievements',
            'Include relevant keywords from the job description',
            'Use standard section headings',
            'Ensure consistent formatting throughout',
        ],
        missingKeywords: ['leadership', 'agile', 'cross-functional'],
        };
    }
    try{
        const prompt = jobDescription
        ? `Analyze this resume against the job description and return a JSON object with: score (0-100), breakdown (object with keywords, formatting, relevance, completeness scores), suggestions (array of strings), missingKeywords (array of strings).\n\nResume:\n${resumeText}\n\nJob Description:\n${jobDescription}`
        : `Analyze this resume for ATS compatibility and return a JSON object with: score (0-100), breakdown (object with keywords, formatting, relevance, completeness scores), suggestions (array of strings), missingKeywords (array of strings).\n\nResume:\n${resumeText}`;

        const response = await client.chat.completions.create({
            model : 'llama-3.1-8b-instant',
            messages : [
                {
                    role : 'system',
                    content : 'You are an ATS (application Tracking system) expert. Analyze resumes and return only valid JSON'
                },
                {
                    role : 'user',
                    content : prompt,
                },   
            ],
            temperature : 0.7,
        });

        const content = response.choices[0].message.content;
        const jsonMatch = content.match(/\{[\s\S]*\}/)
        if(jsonMatch) return JSON.parse(jsonMatch[0]);

        throw new Error('No JSON found in response');

    }catch(error){
        return {
            score: 60,
            breakdown: { keywords: 60, formatting: 65, relevance: 55, completeness: 60 },
            suggestions: ['Unable to fully analyze. Please try again.'],
            missingKeywords: [],
        };
    }
}