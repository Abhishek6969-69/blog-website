
import Quotes from '../components/Quotes'
import Signupauth from '../components/signupauth'
function Signup() {
  return (
    <div className=' flex flex-col md:flex-row '>
        <div className='w-full md:w-1/2 h-screen  bg-[#FFFFF0]'>
            <Signupauth />
        </div>
<div className='hidden w-1/2 h-screen bg-slate-300 md:flex items-center    justify-center '>
    <Quotes />
</div>

    </div>
  )
}

export default Signup