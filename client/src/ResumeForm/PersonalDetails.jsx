import { UserIcon } from "lucide-react";
import { useResume } from "../context/ResumeContext";

const PersonalDetails = ()=>{
    const {resumeData, updateSection} = useResume()
    const data = resumeData.personalDetails

    const handleChange = (e)=>{
        updateSection('personalDetails', {...data,[e.target.name] : e.target.value});
    }
    
    const fields = [
        { name: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
        { name: 'email', label: 'Email', type: 'email', placeholder: 'john@example.com' },
        { name: 'phone', label: 'Phone', type: 'tel', placeholder: '+1 234 567 8900' },
        { name: 'linkedin', label: 'LinkedIn URL', type: 'url', placeholder: 'https://linkedin.com/in/johndoe' },
        { name: 'portfolio', label: 'Portfolio URL', type: 'url', placeholder: 'https://johndoe.dev' },
        { name: 'location', label: 'Location', type: 'text', placeholder: 'New York, NY' },
    ]

    return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-md">

        <div className="text-xl font-semibold text-white mb-6">
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <UserIcon />
              Personal Details
          </span>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {fields.map((field) => (
          <div key={field.name}>

            <label className="block text-sm text-gray-400 mb-2">
              {field.label}
            </label>

            <input
              type={field.type}
              name={field.name}
              value={data[field.name] || ""}
              onChange={handleChange}
              placeholder={field.placeholder}
              className="w-full rounded-md bg-white/5 px-3 py-2 text-white outline outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:outline-indigo-500 transition"
            />

          </div>
        ))}
      </div>

    </div>
  );
};



export default PersonalDetails