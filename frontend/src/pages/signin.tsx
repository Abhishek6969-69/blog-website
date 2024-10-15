import Signinauth from "../components/signinauth"
import Quotes from "../components/Quotes"
function Signin() {
  return (
    <div className=' flex '>
    <div className=' w-1/2 h-screen  bg-[#FFFFF0]'>
        <Signinauth />
    </div>
<div className=' w-1/2 h-screen bg-slate-300 flex items-center    justify-center '>
<Quotes />
</div>

</div>
  )
}

export default Signin