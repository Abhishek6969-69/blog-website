

const Button = ({name}:{name:string}) => {
  return (
    <div>
 <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-500 transition  "  onClick={() => {
          
          }}>
      {name}
    </button>
    </div>
  )
}

export default Button