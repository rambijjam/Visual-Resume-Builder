import { CheckCircle, FileTextIcon, GithubIcon, ZapIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
// import { useAuth } from '../context/AuthContext'

const Feature = ({icon : Icon, title, description})=>{
    return (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition backdrop-blur-md">
            <div className="w-10 h-10 flex items-center justify-center rounded-md bg-indigo-500/20 text-indigo-400 mb-4">
                <Icon className="w-5 h-5" />
            </div>

            <h3 className="text-lg font-semibold text-white mb-2">
                {title}
            </h3>

            <p className="text-sm text-gray-400">
                {description}
            </p>
        </div>
    )
}

const HomePage = ()=>{
    // const { isAuthenticated } = useAuth();
    return (
        <div>

            <section className="py-24 px-6 text-center">
                <div className="max-w-4xl mx-auto">

                <h1 className="text-4xl md:text-5xl font-bold text-white mb-10 mt-10">
                    Build Your Perfect Resume
                </h1>

                <p className="text-gray-400 text-lg mb-13">
                    Create professional, ATS-optimized resumes with AI-powered bullet points,
                    GitHub integration, and LaTeX export and download PDF.
                </p>

                <Link
                    to="/builder"
                    className="inline-block rounded-md bg-indigo-500 px-10 py-5 font-semibold text-white hover:bg-indigo-400 transition"
                >
                    Get Started Free
                </Link>

                </div>
            </section>

            <section className="py-15 px-6">
                <div className="max-w-7xl mx-auto">

                <h2 className="text-3xl font-bold text-white text-center mb-12">
                    Everything You Need
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

                    <Feature
                    icon={FileTextIcon}
                    title="Multi-Step Form"
                    description="Guided form with sections for personal details, education, experience, skills, and more."
                    />

                    <Feature
                    icon={GithubIcon}
                    title="GitHub Integration"
                    description="Automatically fetch your GitHub projects and extract descriptions, languages, and stats."
                    />

                    <Feature
                    icon={ZapIcon}
                    title="AI Bullet Points"
                    description="Let AI generate professional, impactful bullet points for your experience and projects."
                    />

                    <Feature
                    icon={CheckCircle}
                    title="ATS Checker"
                    description="Score your resume against ATS systems and get actionable improvement suggestions."
                    />

                </div>

                </div>
            </section>

            <section className="py-20 px-6 text-center">
                <div className="max-w-3xl mx-auto bg-white/5 border border-white/10 rounded-xl p-12 backdrop-blur-md">

                <h2 className="text-3xl font-bold text-white mb-4">
                    Ready to Build Your Resume?
                </h2>

                <p className="text-gray-400 mb-8">
                    Build your resume with very little effort using our visual resume builder.
                </p>

                <Link
                    to="/builder"
                    className="inline-block rounded-md bg-indigo-500 px-6 py-3 font-semibold text-white hover:bg-indigo-400 transition"
                >
                    Start Building Now
                </Link>

                </div>
            </section>
        </div>
    )
}

export default HomePage