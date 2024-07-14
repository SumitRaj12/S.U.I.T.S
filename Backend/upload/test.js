import fs from "fs";
import axios from "axios";
import { config } from "dotenv";
config();

const JDOODLE_API_URL = "https://api.jdoodle.com/v1/execute";
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

const getLanguageAndVersion = (ext) => {
  const languages = {
    ".py": { language: "python3", versionIndex: "4" },
    ".java": { language: "java", versionIndex: "3" },
    ".cpp": { language: "cpp17", versionIndex: "0" },
  };
  return languages[ext] || null;
};

const runTest = async (req, res) => {
  try {
    const { inputFile, expectedOutputFile, solutionFile } = req.body();

    const input = fs.readFileSync(inputFile, "utf8").trim().split("===");
    const expectedOutputs = fs
      .readFileSync(expectedOutputFile, "utf8")
      .trim()
      .split("===");

    if (input.length !== expectedOutputs.length) {
      console.error(
        "Mismatch in number of input and expected output test cases."
      );
      return res.status(400).send({
        success:false,
        message:"Mismatch in number of input and expected output test cases."
      })
    }

    const sourceCode = fs.readFileSync(solutionFile, "utf8");

    const ext = solutionFile.slice(solutionFile.lastIndexOf("."));
    const langConfig = getLanguageAndVersion(ext);

    if (!langConfig) {
      console.error("Unsupported language.");
      return res.status(400).send({
        success:false,
        message:"Unsupported language."
      });
    }
    let cnt=0;
    for (let i = 0; i < input.length; i++) {
      const currentInput = input[i].trim();
      const currentExpectedOutput = expectedOutputs[i].trim();

      const response = await axios.post(JDOODLE_API_URL, {
        script: sourceCode,
        language: langConfig.language,
        versionIndex: langConfig.versionIndex,
        stdin: currentInput,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
      });

      const output = response.data.output ? response.data.output.trim() : "";
      if (output === currentExpectedOutput) {
        cnt++;
        console.log(`Test case ${i + 1} for ${solutionFile} passed.`);
      } else {
        console.log(`Test case ${i + 1} for ${solutionFile} failed.`);
        console.log(`Expected:\n${currentExpectedOutput}`);
        console.log(`Actual:\n${output}`);
      }
    }
    return res.status(200).send({
      success:true,
      message:`The accuracy is ${(cnt/input.length)*100}`
    })
  } catch (error) {
    console.error("Error running test:", error);
    return res.status(404).send({
      success:false,
      message:"Error running test"
    })
  }
};

export default runTest;
