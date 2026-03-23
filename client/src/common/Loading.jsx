const Loading = ({message = "Loading..."})=>{
    return (
        <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mb-4 shadow-[0_0_10px_rgba(99,102,241,0.5)"></div>
            <p className="text-gray-400">{message}</p>
        </div>
    )
}

export default Loading;