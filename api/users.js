import express from "express";
import bcrypt from "bcrypt";
let router = express.Router();
export default router;

import { createUser, getUserByUsernameAndPassword } from "#db/queries/users";
import requireBody from "#middleware/requireBody";
import { createToken } from "#utils/jwt";

router.post("/register", async (req, res, next) => {
  try {
    if (!req.body) return res.status(400).send("Request body is required.");

    const { username, password } = req.body;

    if (
      typeof username !== "string" ||
      typeof password !== "string" ||
      !username.trim() ||
      !password.trim()
    ) {
      return res.status(400).send("Request body requires: username, password");
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await createUser(username.trim(), hashed);
    const token = await createToken({ id: user.id });
    return res.status(201).send(token);
  } catch (err) {
    next(err);
  }
});

router.post(
  "/login",
  requireBody(["username", "password"]),
  async (req, res) => {
    let { username, password } = req.body;
    let user = await getUserByUsernameAndPassword(username, password);
    if (!user) return res.status(400).send("Invalid username or password.");
    let token = await createToken({ id: user.id });
    res.send(token);
  }
);
