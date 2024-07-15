import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { Context } from "../context/context.jsx";
import { Bars } from "react-loader-spinner";

const Credentials = () => {
  const context = useContext(Context);
  const [loader, setLoader] = useState(false);
  const [id, setId] = useState(null);
  const [sec, setSec] = useState(null);

  const handleIdChange = (event) => {
    setId(event.target.value);
  };

  const handleSecretChange = (event) => {
    setSec(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoader(true);
    try {
      // Assuming you have an API call here
      // const response = await axios.post('/your-api-endpoint', { id, sec });
      context.setCredId(id);
      context.setSecret(sec);
      localStorage.setItem('id',id);
      localStorage.setItem('sec',sec);
    } catch (error) {
      console.error("Error during submission", error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center flex-grow">
      <form
        className="flex flex-col justify-center items-center border rounded-xl bg-white p-4 w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/2 xl:w-1/3"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col w-full">
          <label className="text-xl italic">Client ID</label>
          <input
            type="text"
            name="id"
            onChange={handleIdChange}
            className="border text-xl rounded-xl p-2 bg-gray-50 transition duration-300 ease-in-out transform hover:scale-105"
          />
        </div>
        <div className="flex flex-col w-full">
          <label className="text-xl italic">Secret Key</label>
          <input
            type="text"
            name="secret"
            onChange={handleSecretChange}
            className="border text-xl rounded-xl p-2 bg-gray-50 transition duration-300 ease-in-out transform hover:scale-105"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-400 rounded-xl m-2 p-3 text-xl text-white flex justify-center items-center w-full transition duration-300 ease-in-out transform hover:scale-105"
        >
          Submit
          {loader && (
            <div className="ml-3 mr-3">
              <Bars
                height="30"
                width="30"
                color="white"
                ariaLabel="bars-loading"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
              />
            </div>
          )}
        </button>
      </form>
    </div>
  );
};

export default Credentials;
