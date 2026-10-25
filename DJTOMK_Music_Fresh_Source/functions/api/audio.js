export async function onRequestGet({ request, env }) {
  if (!env.MUSIC_BUCKET) return new Response("Missing R2 binding MUSIC_BUCKET", { status: 500 });
  const url = new URL(request.url);
  const key = url.searchParams.get("key");
  if (!key || !key.startsWith("tracks/") || key.includes("..") || key.includes("\\")) {
    return new Response("Invalid audio path", { status: 400 });
  }
  try {
    const object = await env.MUSIC_BUCKET.get(key);
    if (!object) return new Response("Audio file not found", { status: 404 });
    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("Content-Type", contentType(key));
    headers.set("Accept-Ranges", "bytes");
    headers.set("Cache-Control", "public, max-age=3600");
    headers.set("Content-Length", String(object.size));
    return new Response(object.body, { status: 200, headers });
  } catch (error) {
    return new Response("Unable to read audio from R2", { status: 500 });
  }
}
function contentType(key) {
  const ext = key.split(".").pop().toLowerCase();
  return ({ mp3: "audio/mpeg", m4a: "audio/mp4", aac: "audio/aac", wav: "audio/wav", ogg: "audio/ogg", flac: "audio/flac" })[ext] || "application/octet-stream";
}
