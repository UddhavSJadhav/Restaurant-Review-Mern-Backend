import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AuthDAO from "../dao/authDAO.js";

const { sign } = jwt;
const email_reg_exp = new RegExp(
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
);
const password_reg_exp = new RegExp(/^([a-zA-Z0-9!@#$%^&*]{8,})$/);

class AuthCtrl {
  static async apiSignIn(req, res, next) {
    const { email, password } = req.body;
    try {
      let errors = {};
      if (!email) errors.email = "*Email is required";
      else if (!email_reg_exp.test(email))
        errors.email = "*Invalid email format";

      if (!password) errors.password = "*Password is required";

      if (Object.keys(errors).length > 0) return res.status(400).json(errors);

      const existingUser = await AuthDAO.findUser(email);

      if (!existingUser)
        return res.status(400).json({ email: "User does not exists." });

      const isPasswordCorrect = await bcrypt.compare(
        password,
        existingUser.password
      );

      if (!isPasswordCorrect)
        return res.status(400).json({ password: "Invalid Credentials." });

      const token = sign(
        { email: existingUser.email, id: existingUser._id },
        "test",
        { expiresIn: "1h" }
      );

      res.status(200).json({ result: existingUser, token });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  }

  static async apiSignUp(req, res, next) {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    try {
      let errors = {};
      if (!firstName) errors.firstName = "*Firstname is required";
      if (!lastName) errors.lastName = "*Lastname is required";
      if (!email) errors.email = "*Email is required";
      else if (!email_reg_exp.test(email))
        errors.email = "*Invalid email format";

      if (password === "") errors.password = "*Password is required";
      else if (!password_reg_exp.test(password))
        errors.password =
          "*Password must have atleast 8 characters and special characters";

      if (Object.keys(errors).length > 0) return res.status(400).json(errors);

      const existingUser = await AuthDAO.findUser(email);

      if (existingUser)
        return res.status(400).json({ email: "User already exists" });

      if (password !== confirmPassword)
        return res.status(400).json({ password: "Passwords don't match" });

      const hashedPassword = await bcrypt.hash(password, 12);

      const result = await AuthDAO.createUser({
        email,
        password: hashedPassword,
        name: `${firstName} ${lastName}`,
      });

      const getUser = await AuthDAO.findUserById(result.insertedId);

      const token = jwt.sign(
        { email: getUser.email, id: getUser._id },
        "test",
        {
          expiresIn: "1h",
        }
      );

      res.status(200).json({ result: getUser, token });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  }

  static async apiCheckToken(req, res, next) {
    const { token } = req.body;
    try {
      const decodedData = jwt.verify(token, "test");

      const getUser = await AuthDAO.findUserById(decodedData.id);
      if (
        getUser &&
        getUser.email === decodedData.email &&
        decodedData.exp * 1000 > new Date().getTime()
      )
        return res.status(200).json({
          id: decodedData.id,
          name: getUser.name,
          email: getUser.email,
          token,
        });

      return res.status(400).json({ message: "Invalid token" });
    } catch (err) {
      return res.status(500).json({ message: `Something went wrong. ${err}` });
    }
  }
}

export default AuthCtrl;
