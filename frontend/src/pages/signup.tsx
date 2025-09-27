import Quotes from '../components/Quotes'
import Signupauth from '../components/signupauth'

function Signup() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left side - Sign up form */}
        <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
          <div className="w-full max-w-lg">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-10 lg:p-12">
              <Signupauth />
            </div>
          </div>
        </div>
        
        {/* Right side - Quote section */}
        <div className="hidden lg:flex flex-1 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 items-center justify-center p-8 lg:p-12 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 right-1/4 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10 text-white max-w-lg">
            <Quotes />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup