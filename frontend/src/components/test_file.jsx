import { useState, useRef, useContext } from "react";
import axios from "axios";
import { Bars } from "react-loader-spinner";
import { Context } from "../context/context.jsx";
const Test = () => {
  const [file, setFile] = useState(null);
  const [story, setStory] = useState("");
  const [resp, setResp] = useState(null);
  const [passed, setPassed] = useState(0);
  const [successRate, setSuccessRate] = useState(0);
  const [loader, setLoader] = useState(false);
  const [leader, setLeader] = useState(null);
  const [USN,setUSN]=useState(null);
  const fileInputRef = useRef(null);
  const context = useContext(Context);

  const handleUSN=(event)=>{
    setUSN(event.target.value);
  }
  const handleNameChange = (event) => {
    setLeader(event.target.value);
  };
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleStoryChange = (event) => {
    setStory(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("story", story);
    formData.append("id", context.credId);
    formData.append("secret", context.secret);
    formData.append("name", leader);
    formData.append('usn',USN);
    setLoader(true);
    //https://s-u-i-t-s.onrender.com/v1/test
    try {
      const response = await axios.post(
        "https://s-u-i-t-s.onrender.com/v1/test",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResp(response.data.message); // Store the response message in the state
      setPassed(response.data.passed);
      setSuccessRate(response.data.completion);
    } catch (err) {
      console.error("Axios Error", err);
      setResp("Error uploading file or processing request."); // Display error message
    } finally {
      setLoader(false);
      setFile(null);
      setStory("");
      setLeader("");
      setUSN("");
      fileInputRef.current.value = "";
    }
  };

  const bg_color =
    passed < 4
      ? "bg-red-500 text-white"
      : passed >= 4 && passed < 8
      ? "bg-orange-500 text-white"
      : "bg-green-500 text-white";

  return (
    <>
      <div className="flex flex-col justify-center items-center flex-grow">
        <form
          className="flex flex-col justify-center items-center border rounded-xl bg-white p-4 w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/2 xl:w-1/3"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder="Team Leader Name"
            value={leader}
            onChange={handleNameChange}
            className="m-1 w-full p-3 text-xl rounded-xl transition duration-300 ease-in-out transform hover:scale-105 shadow-lg bg-gray-50 border"
          />

          <input
            type="text"
            value={USN}
            placeholder="Team Leader USN"
            onChange={handleUSN}
            className="m-1 w-full p-3 text-xl rounded-xl transition duration-300 ease-in-out transform hover:scale-105 shadow-lg bg-gray-50 border"
          />
          <select
            name="story"
            onChange={handleStoryChange}
            value={story}
            className="m-3 p-5 bg-gray-100 text-xl w-full transition duration-300 ease-in-out transform hover:scale-105"
          >
            <option value="" className="text-gray-800">
              Select Story
            </option>
            <option value="bellman">Bellman Ford</option>
            <option value="tsp">Travelling Salesman</option>
            <option value="schedule">Scheduling</option>
            {/* <option value="huffman">Huffman Code</option> */}
          </select>

          <input
            type="file"
            name="file"
            onChange={handleFileChange}
            className="m-3 p-4 text-xl border rounded-xl w-full transition duration-300 ease-in-out transform hover:scale-105"
            ref={fileInputRef}
          />
          <button
            type="submit"
            className="bg-blue-400 rounded-xl p-3 text-xl text-white flex justify-center items-center w-full transition duration-300 ease-in-out transform hover:scale-105"
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
        {resp && (
          <div className="m-8 flex justify-center items-center sm:flex-col lg:flex-row">
            <span className={`${bg_color} p-4 rounded sm:m-1 sm:text-center `}>
              {passed} out of 10 test cases passed
            </span>
            <span className="ml-3 text-xl italic">Score {successRate}%</span>
          </div>
        )}
      </div>
    </>
  );
};
export default Test;
