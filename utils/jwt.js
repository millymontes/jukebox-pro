// omgmomgomgomgomg this took me for ever but im hoping itll be accepted.

import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;

export function createToken(payload) {
  const token = jwt.sign(payload, SECRET, { expiresIn: "7d" });
  return token.replace(/-/g, "_");
}

export function verifyToken(token) {
  const restored = token.replace(/_/g, "-");
  return jwt.verify(restored, SECRET);
}
