import React, { useEffect } from "react";
import Test from "./components/test_file.jsx";
import Provider from "./context/context.jsx";
import Credentials from "./components/credentials.jsx";
import { Context } from "./context/context.jsx";
import { useContext } from "react";

function App() {
  return (
    <Provider>
      <MainContent />
    </Provider>
  );
}

const MainContent = () => {
  const context = useContext(Context);
 
  return (
    <div className="bg-gray-200 min-h-screen flex flex-col justify-around">
      <h1 className="flex justify-center items-center font-bold text-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl py-4">
        AlgoTest
      </h1>
      {!context.credId ? <Credentials /> : <Test />}
    </div>
  );
};

export default App;
