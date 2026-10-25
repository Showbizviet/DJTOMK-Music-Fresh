export async function onRequestGet({ env }) {
  if (!env.MUSIC_BUCKET) return json({ error: "Missing R2 binding MUSIC_BUCKET" }, 500);
  try {
    const listed = await env.MUSIC_BUCKET.list({ prefix: "tracks/", limit: 1000 });
    const tracks = listed.objects
      .filter((obj) => /\.(mp3|m4a|ogg|wav|aac|flac)$/i.test(obj.key))
      .map((obj) => {
        const filename = obj.key.split("/").pop().replace(/\.[^.]+$/, "");
        const cleaned = filename.replace(/^[0-9a-f-]{36}-/i, "").replace(/[-_]+/g, " ").trim();
        return {
          key: obj.key,
          title: cleaned || filename || "Untitled",
          artist: "DJ TOMK",
          url: `/api/audio?key=${encodeURIComponent(obj.key)}`,
          size: obj.size,
          uploaded: obj.uploaded,
        };
      }).sort((a, b) => String(b.uploaded).localeCompare(String(a.uploaded)));
    return json({ tracks });
  } catch (error) {
    return json({ error: "Unable to list tracks", detail: String(error) }, 500);
  }
}
function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "Access-Control-Allow-Origin": "*" } });
}
