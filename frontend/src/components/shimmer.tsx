
; // Import custom CSS for keyframes
import React from "react";
import { PacmanLoader } from "react-spinners";

const override: React.CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const Shimmer = () => {
 
  return (
    <div className=" w-screen h-screen flex justify-center items-center">
    <div className="sweet-loading md:mb-56 md:mr-36 ">
        <PacmanLoader
          cssOverride={override}
          size={100}
          color={"#77DD77"}
          
          speedMultiplier={1.5}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
      </div>
  );
};

export default Shimmer;
