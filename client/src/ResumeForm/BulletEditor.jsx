import { useRef } from "react"

const BulletEditor = ({points, setPoints})=>{
    const inputRefs = useRef([]);

    const handleChange = (index, value)=>{
        const updated = [...points]
        updated[index] = value;
        setPoints(updated);
    };


    const handleKeyDown = (e, index)=>{
        if(e.key == 'Enter'){
            e.preventDefault();

            const updated = [...points];
            updated.splice(index+1, 0, "");

            setPoints(updated);
            setTimeout(()=>{
                inputRefs.current[index+1]?.focus();
            }, 0);
        }

        if(e.key === 'Backspace' && points[index] === ""){
            if(points.length === 1) return ;
            e.preventDefault();

            const updated = points.filter((_,i)=> i!==index);
            setPoints(updated);

            setTimeout(()=>{
                inputRefs.current[index-1]?.focus();
            },0);
        }
    };


    return(
        <div className="space-y-2">
            {
                points.map((point, index)=>{
                    return(
                      <div key = {index} className="flex items-center gap-2">
                        <span className="text-gray-500">•</span>

                        <input 
                            ref = {(el) => (inputRefs.current[index] = el)}
                            type = "text"
                            value = {point}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            placeholder="Type Something..."
                            className="flex-1 bg-transparent outline-none text-white placeholder-gray-500 border-b border-white/10 focus:border-indigo-500 py-1"
                        />
                      </div>
                    );
                })
            }
        </div>
    );
};

export default BulletEditor;