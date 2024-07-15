import fs from "fs";
import axios from "axios";
import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { Submit } from "../Model/submit.model.js";
config();

const getLanguageAndVersion = (ext) => {
  const languages = {
    ".py": { language: "python3", versionIndex: "4" },
    ".java": { language: "java", versionIndex: "3" },
    ".cpp": { language: "cpp17", versionIndex: "0" },
    ".c": { language: "c", versionIndex: "5" }, // Added C language support
  };
  return languages[ext] || null;
};

const runTest = async (req, res) => {
  try {
    const JDOODLE_API_URL = "https://api.jdoodle.com/v1/execute";
    const CLIENT_ID = req.body.id;
    const CLIENT_SECRET = req.body.secret;
    const usn = req.body.usn;
    const name = req.body.name;
    console.log(name + " " + usn);

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

    let score = 0;
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
        score++;
        console.log(`Test case ${i + 1} for ${solutionFile} passed.`);
      } else {
        console.log(`Test case ${i + 1} for ${solutionFile} failed.`);
        console.log(`Expected:\n${currentExpectedOutput}`);
        console.log(`Actual:\n${output}`);
      }
    }
    // updating the mongodb.
    try {
      let user = await Submit.findOne({ usn });

      if (user) {
        if (score > user.score) {
          user.score = score;
          await user.save();
        }
      } else {
        const accuracy = (score / 10) * 100;
        user = new Submit({ name, usn, score, story, accuracy });
        await user.save();
      }
      console.log("Successfully stored");
    } catch (err) {
      console.log("Error in storing in db " + err);
    }
    return res.status(200).send({
      success: true,
      passed: score,
      completion: (score / 10) * 100,
      message: `${score}/10 TestCases passed.\nThe accuracy is ${
        (score / 10) * 100
      }%`,
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
