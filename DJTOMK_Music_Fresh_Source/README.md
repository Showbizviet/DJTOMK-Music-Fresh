# DJ TOMK MUSIC — Fresh Cloudflare Pages source

A clean, minimal music library site with a responsive player, search, Cloudflare Pages Functions, and Cloudflare R2 streaming.

## Project structure

```text
DJTOMK_Music_Fresh_Source/
├── index.html
├── README.md
└── functions/
    └── api/
        ├── audio.js       # GET /api/audio?key=tracks/...
        ├── tracks.js      # GET /api/tracks
        └── settings.js    # GET /api/settings
```

## Cloudflare Pages setup

1. Upload/push the contents of this folder to a new GitHub repository, or replace the contents of a dedicated source folder.
2. In Cloudflare Pages, set the **Root directory** to the folder containing `index.html` and `functions/`.
3. Set the build command to blank and the build output directory to `.` if the project settings support static output from the root.
4. Open **Settings → Functions → R2 bucket bindings** and add a binding named exactly `MUSIC_BUCKET` connected to the existing bucket `djtomk-music`.
5. Ensure the R2 object keys start with `tracks/`, for example `tracks/song.mp3`.
6. Deploy, then test `/api/tracks`, followed by `/api/audio?key=tracks%2Fsong.mp3`.

## Notes

- This package intentionally does not include audio files, Cloudflare account secrets, bucket IDs, or private credentials.
- The source assumes existing R2 objects live under `tracks/` and the Pages binding is named `MUSIC_BUCKET`.
- Upload API is not included in this fresh baseline. Do not expose an unauthenticated public upload endpoint to the internet; add authenticated uploads separately if needed.
- This streaming endpoint returns the R2 object body and supports normal playback. It does not implement HTTP byte-range slicing for seek requests; seek may depend on browser behavior. Add explicit Range handling if full seeking compatibility is required.
