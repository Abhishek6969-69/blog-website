

const Button = ({name, onClick}:{name:string, onClick?: () => void}) => {
  return (
    <button 
      className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"  
      onClick={onClick}
    >
      {name}
    </button>
  )
}

export default Button