// StatAtlas hand-in program (Node 22, standard library only).
//
// The site lives in app/ beside this file as plain static files: index.html
// plus the modules and stylesheet it loads, with its data in its own files.
// Nothing it runs, styles or shows loads over the network. This program
// hands it in: it copies app/ and screenshots/ into /output (or
// $MAKEFUN_OUTPUT_DIR outside the grader) and writes /output/dossier.json
// with the vendored make.fun library, which is the summary the judge reads:
// the screenshots, the first load's files and bytes, and the source.
//
// vendor/makefun-frontend.ts is the kit's copy, unchanged: the scorer
// rebuilds the dossier with its own copy and compares the two byte for byte.
//
// Run it locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// The scorer's own caps (see the kit's reference/gate.json): text_max_bytes
// shapes the dossier text; the others refuse an entry the scorer would
// refuse — more than 4 screenshots or one over 256 KiB; more than 993 files
// and directories in app/ or 16 MiB of app files, which count beside /output's
// own 1,000-entry cap together with screenshots/ and dossier.json.
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);
