# Piece artwork

Four freely-licensed SVG piece sets, vendored here and inlined into the build by
`build.mjs` — the same arrangement as `eco-table.js`: generated into the bundle, never
edited by hand, and kept in the repo so a build never depends on reaching the network.

The app used Unicode glyphs (`♚♛♜♝♞♟`, U+265A–265F) before these. Glyphs are solid
silhouettes with no interior, they differ between devices depending on which font is
picked, and they need a ring of text-shadows behind them to stay visible on a light
square. These sets carry their own outlines, so they read on both square colours and
look the same on his phone and his laptop. The glyph path is kept as the `system` set,
because it is the one that needs no assets at all.

## What is here, and under what terms

| set | author | licence | licence text |
|---|---|---|---|
| `chessnut` | [Alexis Luengas](https://github.com/LexLuengas/chessnut-pieces) | Apache 2.0 | `LICENSE-chessnut.txt` |
| `fantasy` | [Maurizio Monge](https://github.com/maurimo/chess-art) | MIT | `LICENSE-chess-art.txt` |
| `celtic` | [Maurizio Monge](https://github.com/maurimo/chess-art) | MIT | `LICENSE-chess-art.txt` |
| `spatial` | [Maurizio Monge](https://github.com/maurimo/chess-art) | MIT | `LICENSE-chess-art.txt` |

The files came from `lichess-org/lila` under `public/piece/<set>/`, whose `COPYING.md`
is the authority on which set carries which licence. That table was read before any of
these were downloaded, not after.

Both licences are permissive: they require the notice to travel with the work, which is
what the two `LICENSE-*.txt` files are for, and `build.mjs` copies them beside the built
site. Neither restricts use, modification or distribution.

## Why these four and not the popular ones

Most of the well-known lichess sets — maestro, tatiana, fresca, cardinal, staunty,
dubrovny, california, caliente — are **CC BY-NC-SA 4.0**. Non-commercial plus
share-alike, on artwork inlined directly into a single HTML file that is published at
two public URLs, is exactly the entanglement this project has otherwise been careful to
avoid: Stockfish is shipped GPL but kept in its own worker, unmodified, so it stays a
separate work. Pulling NC/share-alike artwork into the middle of the app would undo that
care for a nicer knight.

`cburnett` and `merida` are GPLv2+ and were skipped for the same reason. `rhosgfx` is
CC0 and was downloaded, looked at and dropped on the merits: its pieces are baked orange
and cream, so they do not read as white against black on any of his boards.

## Adding another set

Drop a folder of twelve SVGs named `wK wQ wR wB wN wP bK bQ bR bB bN bP` in here, add a
row to `PIECE_SETS` in the source, and record the licence in the table above **and** in
a `LICENSE-*.txt` beside it. Check the licence before downloading, not after — the
lichess `COPYING.md` linked above lists every set it ships.
