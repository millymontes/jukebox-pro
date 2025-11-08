import db from "#db/client";
import bcrypt from "bcrypt";

/** Create a new user with the given username and password. */
export async function createUser(username, password) {
  const {
    rows: [user],
  } = await db.query(
    "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *",
    [username, password]
  );
  return user;
}

/** Get a user by username and verify their password. */
export async function getUserByUsernameAndPassword(username, password) {
  const {
    rows: [user],
  } = await db.query("SELECT * FROM users WHERE username = $1", [username]);

  if (!user) return null;
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;

  return user;
}

/** Get a user by their ID. */
export async function getUserById(id) {
  const {
    rows: [user],
  } = await db.query("SELECT * FROM users WHERE id = $1", [id]);
  return user;
}
