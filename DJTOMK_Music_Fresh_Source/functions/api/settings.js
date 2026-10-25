export async function onRequestGet() {
  return new Response(JSON.stringify({ siteName: "DJ TOMK MUSIC", playback: true, uploadEnabled: false }), {
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
}
