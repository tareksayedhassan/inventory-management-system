import jwt from "jsonwebtoken";

export default (payload: string | object) => {
  const secret = process.env.JWT_SECRET_KEY;
  if (!secret) throw new Error("JWT_SECRET_KEY is not defined!");

  const token = jwt.sign(payload, secret, {
    expiresIn: "60m",
  });
  return token;
};
