import axios from "axios";
import { Bars } from "react-loader-spinner";
import { useRef, useState } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [story, setStory] = useState("");
  const [resp, setResp] = useState(null);
  const [loader, setLoader] = useState(false);
  const fileInputRef = useRef(null);

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
    setLoader(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/v1/test",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResp(response.data.message); // Store the response message in the state
    } catch (err) {
      console.error("Axios Error", err);
      setResp("Error uploading file or processing request."); // Display error message
    } finally {
      setLoader(false);
      setFile(null);
      setStory("");
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <div className="bg-gray-200 min-h-screen flex flex-col">
        <h1 className="flex justify-center items-center font-bold text-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl py-4">
          The Executer
        </h1>
        <div className="flex flex-col justify-center items-center flex-grow">
          <form
            className="flex flex-col justify-center items-center border rounded-xl bg-white p-4 w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4"
            onSubmit={handleSubmit}
          >
            <select
              name="story"
              onChange={handleStoryChange}
              value={story}
              className="m-3 p-4 bg-gray-200 text-xl w-full"
            >
              <option value="" className="text-gray-800">
                Select Story
              </option>
              <option value="bellman">Bellman Ford</option>
              <option value="tsp">Travelling Salesman</option>
              <option value="schedule">Scheduling</option>
              <option value="huffman">Huffman Code</option>
            </select>

            <input
              type="file"
              name="file"
              onChange={handleFileChange}
              className="m-3 p-4 text-xl border rounded-xl w-full"
              ref={fileInputRef}
            />
            <button
              type="submit"
              className="bg-blue-400 rounded-xl p-3 text-xl text-white flex justify-center items-center w-full"
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
            <div className="mt-4 p-4 bg-white border rounded-xl w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4">
              {resp}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
