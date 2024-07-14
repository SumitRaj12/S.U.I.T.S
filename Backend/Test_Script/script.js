import fs from "fs";
import axios from "axios";
import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
config();

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
    const JDOODLE_API_URL = "https://api.jdoodle.com/v1/execute";
    const CLIENT_ID = process.env.CLIENT_ID;
    const CLIENT_SECRET = process.env.CLIENT_SECRET;

    const solutionFile = req.file.path; 
    const story = req.body.story;
    let inputFile, expectedOutputFile;

    if (story == "bellman") {
      inputFile = "bellman_input.txt";
      expectedOutputFile = "bellman_output.txt";
    } else if (story == "huffman") {
      inputFile = "huffman_input.txt";
      expectedOutputFile = "huffman_output.txt";
    } else if (story === "schedule") {
      inputFile = "schedule_input.txt";
      expectedOutputFile = "schedule_output.txt";
    } else if (story == "tsp") {
      inputFile = "tsp_input.txt";
      expectedOutputFile = "tsp_output.txt";
    } else {
      return res
        .status(400)
        .send({ success: false, message: "Invalid story." });
    }

    const dirname = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      "../Cases/"
    );
    const input = fs
      .readFileSync(path.join(dirname, inputFile), "utf8")
      .trim()
      .split("===");
    const expectedOutputs = fs
      .readFileSync(path.join(dirname, expectedOutputFile), "utf8")
      .trim()
      .split("===");

    if (input.length !== expectedOutputs.length) {
      console.error(
        "Mismatch in number of input and expected output test cases."
      );
      return res.status(400).send({
        success: false,
        message: "Mismatch in number of input and expected output test cases.",
      });
    }
    const sourceCode = fs.readFileSync(solutionFile, "utf8");
    const ext = path.extname(solutionFile);
    const langConfig = getLanguageAndVersion(ext);

    if (!langConfig) {
      console.error("Unsupported language.");
      return res.status(400).send({
        success: false,
        message: "Unsupported language.",
      });
    }

    let cnt = 0;
    for (let i = 0; i < 10; i++) {
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
      success: true,
      message: `${cnt}/10 TestCases passed.\nThe accuracy is ${(cnt / 10) * 100}%`,
    });
  } catch (error) {
    console.error("Error running test:", error);
    return res.status(500).send({
      success: false,
      message: "Error running test",
    });
  }
};

export default runTest;
