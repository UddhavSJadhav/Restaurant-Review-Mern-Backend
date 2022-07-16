import jwt from "jsonwebtoken";
const { verify } = jwt;

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const decodedData = verify(token, "test");

    req.user_id = decodedData?.id;

    next();
  } catch (error) {
    console.log(error);
  }
};

export default auth;
