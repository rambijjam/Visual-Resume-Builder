import {  Briefcase, Folder, GraduationCap, Trophy, User, Wrench } from "lucide-react";

const steps = [
  {number : 1, label : "Personal", icon : User},
  {number : 2, label : "Education", icon : GraduationCap},
  {number : 3, label : "Experience", icon : Briefcase},
  {number : 4, label : "Skills", icon : Wrench},
  {number : 5, label : "Achivements", icon : Trophy},
  {number : 6, label : "Projects", icon : Folder},
]

const FormProgress = ({ currentStep }) => {

  const progressPercent = ((currentStep - 1)/(steps.length-1)*100)

  return (
    <div className="w-full mb-12">
      <div className="relative">

        <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-800 rounded" />

        <div
          className="absolute top-5 left-0 h-0.5 bg-indigo-500 rounded transition-all duration-500 ease-in-out"
          style={{ width: `${progressPercent}%` }}
        />

        <div className="flex justify-between relative z-10">
          {steps.map((step) => {
            const Icon = step.icon;
            const isCompleted = currentStep > step.number;
            const isActive = currentStep === step.number;

            return (
              <div
                key={step.number}
                className="flex flex-col items-center group"
              >

                <div
                  className={`
                    w-10 h-10 flex items-center justify-center rounded-full
                    transition-all duration-300 ease-in-out
                    ${
                      isActive
                        ? "bg-indigo-500 text-white scale-110 shadow-lg shadow-indigo-500/30"
                        : isCompleted
                        ? "bg-green-500 text-white"
                        : "bg-gray-800 text-gray-400 border border-gray-700"
                    }
                  `}
                >
                  {isCompleted ? (
                    "✓"
                  ) : (
                    <Icon size={18} />
                  )}
                </div>

                <span
                  className={`
                    mt-2 text-xs transition-all duration-300
                    ${
                      isActive
                        ? "text-indigo-400"
                        : "text-gray-500 group-hover:text-gray-300"
                    }
                  `}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FormProgress;