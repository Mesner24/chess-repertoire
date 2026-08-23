# Piece artwork

Four sets of drawn pieces, vendored here rather than fetched at runtime — the app has to
work with no network, and a piece set that arrives over the wire is a piece set that
sometimes does not.

`make-pieces.mjs` reads this folder and generates `piece-art.js`. Do not edit that file
by hand; edit here and regenerate.

## What is here, and on what terms

Every set was chosen so the app stays unencumbered. **All four are permissive — none are
copyleft**, so none of them place any obligation on the app's own source. That was the
selection rule, not a coincidence: the owner wants keeping this closed to remain a free
choice rather than something a piece set decided for him.

| set | artist | licence | obligation |
|---|---|---|---|
| `chessnut` | [Alexis Luengas](https://github.com/LexLuengas/chessnut-pieces) | Apache 2.0 | keep the notice |
| `fantasy` | [Maurizio Monge](https://github.com/maurimo/chess-art) | MIT | keep the notice |
| `celtic` | [Maurizio Monge](https://github.com/maurimo/chess-art) | MIT | keep the notice |
| `rhosgfx` | [RhosGFX](https://rhosgfx.itch.io/) | CC0 1.0 | none |

Licence texts sit beside the artwork as `LICENSE-chessnut.txt` (Apache 2.0) and
`LICENSE-chess-art.txt` (MIT, covering fantasy and celtic). CC0 is a public domain
dedication and carries no notice requirement; RhosGFX is credited anyway because being
credited is the decent thing whether or not a licence compels it.

The attributions are also shown in the app, under Settings, so they travel with the
thing people actually receive rather than living only in this folder.

## Sets deliberately NOT taken

- **cburnett**, **merida**, **mono** — GPLv2+. The classic Staunton look, and the most
  recognisable of the lot, but copyleft artwork compiled into a single-file app is a
  genuine entanglement rather than a theoretical one. Available if this ever goes open
  source; not before.
- **maestro**, **tatiana**, **staunty**, **fresca**, **cardinal**, **gioco**,
  **california**, **caliente** and friends — CC BY-**NC**-SA. Non-commercial is fine for
  a personal trainer, but share-alike on the artwork plus a usage restriction is a
  standing condition on a file that gets published to two public hosts.
- **alpha**, **chess7**, **companion**, **leipzig** — "freeware" with no licence text at
  all. A permission you cannot read is not a permission you can rely on.

## Where these came from

Downloaded from [lichess-org/lila](https://github.com/lichess-org/lila) under
`public/piece/<set>/`, whose `COPYING.md` is the source for the licence column above.
Lichess redistributes these and therefore has to state the terms accurately, which makes
it a better citation than the artists' scattered download pages.

Every file was scanned before being embedded: no `<script>`, no event handlers, no
`<foreignObject>`, and no remote `href` — an SVG is a document format that can carry
executable content, and these are drawn into the app itself.

## Chess.com

Not here, and not coming. Their sets are their own artwork; this app is published at two
public URLs, so shipping them would be redistributing someone else's assets. The request
that started this was "make my pieces look like chess.com's", and the honest answer was
that the real gap was font glyphs versus drawn pieces — which these fix.
