# Život v USA

Český blog postavený na Hugu a tématu PaperMod. Zdrojové články jsou v
`content/posts/`; výsledný web publikuje GitHub Pages.

## Lokální vývoj

Používej **Hugo Extended 0.167.0**, stejnou verzi jako GitHub Actions.
Instalační balíčky jsou v [oficiálním vydání Huga](https://github.com/gohugoio/hugo/releases/tag/v0.167.0).
Pro tento projekt není potřeba Node.js, npm ani Dart Sass.

Po naklonování repozitáře stáhni připnutou verzi tématu:

```sh
git submodule update --init --recursive
hugo version
hugo server
```

Náhled je na `http://localhost:1313/`. Pro zobrazení rozepsaných článků použij
`hugo server --buildDrafts`.

Produkční sestavení:

```sh
hugo build --gc --minify
```

Hugo vytvoří adresář `public/`. Výsledné soubory, cache `resources/` ani
`.hugo_build.lock` se necommitují.

## Publikování

Workflow `.github/workflows/hugo.yml` sestaví pull requesty bez publikování.
Push do `main` nebo ruční spuštění workflow web sestaví a publikuje na GitHub
Pages. V nastavení repozitáře musí být zdroj Pages nastavený na **GitHub Actions**.
Vlastní doména a její DNS se nastavují samostatně v GitHub Pages a Cloudflare.

## Údržba

PaperMod je Git submodul připnutý na konkrétní commit. Při aktualizaci tématu
nebo Huga ověř současně produkční build, vyhledávání, kategorie, tagy,
stránkování a zobrazení na mobilu ve světlém i tmavém režimu.
