const { v4: uuidv4 } = require("uuid");
const { StatusCodes } = require("http-status-codes");
const dbConnection = require("../db/dbConfig");

const askQuestion = async (req, res) => {
  req.body.questionid = uuidv4();
  const { questionid, userid, title, description, tag } = req.body;
  // const userid = req.user.userid;
  //check if title and description are not empty
  if (!title || !description) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "please fill all required fields" });
  }

  try {
    await dbConnection.query(
      "INSERT INTO questions(questionid,userid,title,description, tag) VALUES (?,?,?,?,?)",
      [questionid, userid, title, description, tag]
    );
    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "question asked successfully" });
  } catch (error) {
    console.log(error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "something went wrong while asking question, please try again later",
    });
  }
};
//get all the questions
const getAllQuestions = async (req, res) => {
  try {
    const [questions] = await dbConnection.query(
      "SELECT questions.*, users.username FROM questions JOIN users ON questions.userid = users.userid ORDER BY questions.id DESC"
    );
    return res.status(StatusCodes.OK).json(questions);
  } catch (error) {
    console.log(error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "something went wrong while fetching questions, please try again",
    });
  }
};

const getSingleQuestion = async (req, res) => {
  // Extract the questionid from the request parameters
  //   console.log(req.params);
  const questionid = req.params.questionid;
  try {
    const [question] = await dbConnection.query(
      "SELECT * FROM questions WHERE questionid = ?",
      [questionid]
    );
    // console.log(question);
    if (question.length === 1) {
      res.status(StatusCodes.OK).json(question[0]);
    } else {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Question not found" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};

module.exports = { askQuestion, getAllQuestions, getSingleQuestion };
