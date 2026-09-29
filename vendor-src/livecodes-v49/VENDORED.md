# Vendored LiveCodes v49

This directory contains the LiveCodes v49 source archive (upstream commit `69260cf`).

The blog uses a locally built copy at `assets/vendor/livecodes-v49/`. Rebuild it with:

```sh
./scripts/build-vendored-livecodes-v49.sh
```

Local modifications keep the LiveCodes bootstrap and result surfaces dark while iframes are loading or being repainted. The article's D3 dependency remains external and is not vendored.
