# WP Sounds

Interaction sounds for the WordPress block editor, synthesized live in the browser with Web Audio. No audio files, no dependencies, editor-only.

The idea is restraint: sound marks outcomes, not activity. Typing, block selection, and ordinary clicks stay silent. A cue plays only when the editor finishes something on your behalf, or reveals something new.

## Sound map

| Moment | Cue |
| --- | --- |
| Pre-publish panel opens | `bloom` |
| Publishing starts | `loading` |
| Publish succeeds | `success` |
| Save draft succeeds | `tick` |
| Save fails | `error` |
| Toggle controls | `toggle` |
| Snackbar dismissed by click | `droplet` (auto-dismiss stays silent) |
| Block inserter opens | `bloom` |

Autosaves are silent on purpose.

## Install

Clone into your plugins directory and activate:

```sh
cd wp-content/plugins
git clone https://github.com/kellychoffman/wp-sounds-cuelume.git
```

Or grab the zip from GitHub (Code, then Download ZIP) and upload it via Plugins, then Add New Plugin.

For a quick local spin with [wp-now](https://github.com/WordPress/playground-tools/tree/trunk/packages/wp-now):

```sh
cd wp-sounds-cuelume
npx @wp-now/wp-now start --php 8.2
```

## How it works

- `wp-sounds-cuelume.php` enqueues one script on `enqueue_block_editor_assets`, so nothing loads on the front end.
- `js/editor-sounds.js` holds the whole thing: the inlined [Cuelume](https://www.npmjs.com/package/cuelume) synth engine (v0.1.2, ESM-only upstream, hence the inline copy), plus the editor wiring.
- Outcome cues come from `wp.data.subscribe()` watching `core/editor` state transitions (`isSavingPost`, `isPublishingPost`, `didPostSaveRequestSucceed`, publish sidebar, inserter). Toggle and snackbar cues use delegated DOM listeners on the editor chrome.

To experiment, the engine is exposed on the console as `CuelumeSounds`:

```js
CuelumeSounds.play( "sparkle" );
CuelumeSounds.sounds; // all 14 names
CuelumeSounds.setEnabled( false );
```

Swapping which cue plays where is a one-word edit in the wiring section at the bottom of `editor-sounds.js`.

## Credits and license

- Sound synthesis: [Cuelume](https://cuelume-site.pages.dev/) by Daniel Belyi, MIT licensed.
- Plugin code: GPL-2.0-or-later.
