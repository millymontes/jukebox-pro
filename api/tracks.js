import express from "express";
const router = express.Router();
export default router;

import { getPlaylistsByTrackId } from "#db/queries/playlists";
import { getTracks, getTrackById } from "#db/queries/tracks";
import requireUser from "#middleware/requireUser";

router.get("/", async (req, res) => {
  const tracks = await getTracks();
  res.send(tracks);
});

router.get("/:id/playlists", requireUser, async (req, res, next) => {
  try {
    const track = await getTrackById(req.params.id);
    if (!track) return res.status(404).send("Track not found.");
    const playlists = await getPlaylistsByTrackId(track.id, req.user.id);
    res.send(playlists);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", (req, res) => {
  res.send(req.track);
});

router.get("/:id/playlists", requireUser, async (req, res) => {
  const playlists = await getPlaylistsByTrackId(req.track.id, req.user.id);
  res.send(playlists);
});
