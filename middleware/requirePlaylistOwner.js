import { getPlaylistById } from "#db/queries/playlists";

export default async function requirePlaylistOwner(req, res, next) {
  if (!req.user) return res.status(401).send("Unauthorized");

  const playlist = await getPlaylistById(req.params.id);
  if (!playlist) return res.status(404).send("Playlist not found.");

  if (playlist.user_id !== req.user.id) {
    return res
      .status(403)
      .send("You do not have permission to access this playlist.");
  }

  req.playlist = playlist;
  next();
}
