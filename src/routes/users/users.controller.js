const bcrypt = require("bcrypt");

const {
  checkIfEmailExistQuery,
  registerUserQuery,
  findUserQuery,
} = require("./users.query");

const { generateToken } = require("./../../utils");

async function registerUserController(req, res) {
  try {
    const { username, email, password } = req.body;
    console.log("Hello");

    if (!username || !email || !password)
      return res.status(400).json({
        message: "User name, email and password are reuired",
        success: false,
      });

    if (password.length < 8)
      return res.status(400).json({
        message: "Password must be at least 8",
        success: false,
      });

    if (!email.includes("@") || !email.includes("."))
      return res.status(400).json({
        message: "Provide a valid email",
        success: false,
      });

    const emailExist = await checkIfEmailExistQuery(email);
    console.log(emailExist);

    if (emailExist)
      return res.status(400).json({
        message: "Email already Exist",
        success: false,
      });

    const hashPassword = await bcrypt.hash(password, +process.env.HASH_VALUE);
    const data = await registerUserQuery(username, email, hashPassword);
    console.log(data);

    return res.status(200).json(data);
  } catch (err) {
    console.log(err.message);
  }
}

async function logInController(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(401).json({
        success: false,
        message: "Email and ppassword field are required",
      });

    const user = await findUserQuery(email);
    // console.log(user);

    const passwordHash = await bcrypt.compare(password, user.user_password);
    // console.log(passwordHash);
    delete user.user_password;

    const token = generateToken(user.id);

    res.status(200).json({
      success: true,
      token,
      user,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(401).json({
      success: false,
      message: "Invalid Cridentials",
    });
  }
}

module.exports = {
  registerUserController,
  logInController,
};
