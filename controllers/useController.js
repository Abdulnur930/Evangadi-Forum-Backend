//db connection
const dbConnection = require("../db/dbConfig");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
async function register(req, res) {
  const { username, firstname, lastname, email, password } = req.body;
  if (!email || !password || !firstname || !lastname || !username) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "please provide all required fields" });
  }
  try {
    const [user] = await dbConnection.query(
      "select username, userid from users where username = ? or email =?",
      [username, email]
    );

    if (user.length > 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "user already existed" });
    }
    // console.log("password", password.length);
    if (password.length < 8) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "password must be at least 8 characters" });
    }

    // encrypt the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await dbConnection.query(
      "INSERT INTO users (username, firstname, lastname, email, password) VALUES (?,?,?,?,?) ",
      [username, firstname, lastname, email, hashedPassword]
    );
    return res.status(StatusCodes.CREATED).json({ msg: "user registered" });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "something went wrong, try again later!" });
  }
}
async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "please enter all required fields" });
  }

  try {
    const [user] = await dbConnection.query(
      "select username, userid,firstname, password from users where email=?",
      [email]
    );
    if (user.length == 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "invalid credential" });
    }

    // compare password

    const isMatch = await bcrypt.compare(password, user[0].password);

    if (!isMatch) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "invalid credential" });
    }
    const username = user[0].username;
    const userid = user[0].userid;
    const firstname = user[0].firstname;
    const token = jwt.sign({ username, userid,firstname }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return res
      .status(StatusCodes.OK)
      .json({ msg: "user login successful", token, username,firstname });
  } catch (error) {
    console.log(error.message);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "something went wrong, try again later!" });
  }
}
async function checkUser(req, res) {
  const { username, userid,firstname } = req.user;
  res.status(StatusCodes.OK).json({ msg: "valid user", username, userid,firstname });
}
module.exports = { login, checkUser, register };
