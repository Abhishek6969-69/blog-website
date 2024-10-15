
import Quotes from '../components/Quotes'
import Signupauth from '../components/signupauth'
function Signup() {
  return (
    <div className=' flex '>
        <div className=' w-1/2 h-screen  bg-[#FFFFF0]'>
            <Signupauth />
        </div>
<div className=' w-1/2 h-screen bg-slate-300 flex items-center    justify-center '>
    <Quotes />
</div>

    </div>
  )
}

export default Signup