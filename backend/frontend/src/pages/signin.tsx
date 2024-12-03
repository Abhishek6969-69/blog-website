import Signinauth from "../components/signinauth";
import Quotes from "../components/Quotes";

function Signin() {
  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 h-screen bg-[#FFFFF0] flex items-center justify-center">
        <Signinauth />
      </div>
      <div className="hidden md:flex w-1/2 h-screen bg-slate-300 items-center justify-center">
        <Quotes />
      </div>
    </div>
  );
}

export default Signin;
