

const Secondarybtn = ({name, onClick}:{name:string, onClick?: () => void}) => {
  return (
    <button 
      className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-lg border border-gray-300 shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"  
      onClick={onClick}
    >
      {name}
    </button>
  )
}

export default Secondarybtn