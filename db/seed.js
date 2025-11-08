import db from "#db/client";

import { createPlaylist } from "#db/queries/playlists";
import { createPlaylistTrack } from "#db/queries/playlists_tracks";
import { createTrack } from "#db/queries/tracks";
import { createUser } from "#db/queries/users";
import bcrypt from "bcrypt";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  // First create tracks
  for (let i = 1; i <= 20; i++) {
    await createTrack("Track " + i, i * 50000);
  }

  // Create users and their playlists
  for (let i = 1; i <= 3; i++) {
    const hashedPassword = await bcrypt.hash("password", 10);
    const user = await createUser("user" + i, hashedPassword);

    // Create a playlist for each user
    const playlist = await createPlaylist(
      "Playlist " + i,
      "User " + i + "'s playlist",
      user.id
    );

    // Add 5 tracks to each playlist
    for (let j = 1; j <= 5; j++) {
      const trackId = (i - 1) * 5 + j; // This will distribute tracks among playlists
      await createPlaylistTrack(playlist.id, trackId);
    }
  }
}
