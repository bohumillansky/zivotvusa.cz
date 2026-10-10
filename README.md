# Život v USA

Český blog postavený na Hugu a tématu PaperMod. Zdrojové články jsou v
`content/posts/`; výsledný web publikuje GitHub Pages.

## Psaní článků

Postup od založení článku přes vložení fotografií až po náhled a publikování
je v návodu [Jak napsat a publikovat článek s fotografiemi](docs/psani-clanku.md).

## Lokální vývoj

Používej **Hugo Extended 0.167.0**, stejnou verzi jako GitHub Actions.
Instalační balíčky jsou v [oficiálním vydání Huga](https://github.com/gohugoio/hugo/releases/tag/v0.167.0).
Pro tento projekt není potřeba Node.js, npm ani Dart Sass.

## Náhled a komentáře

Web zatím běží na https://bohumillansky.github.io/zivotvusa.cz/ s `noindex,
nofollow`. Nemá heslo: kdo zná URL, může jej otevřít. Repozitář a komentářové
pull requesty jsou veřejné. `zivotvusa.cz` zatím nepřipojuj jako Pages doménu.

Komentáře jsou obyčejný text sestavovaný do HTML z
`data/comments/<article-id>/<uuid>.json`. Návštěvník vyplní jméno a text,
Cloudflare ověří Turnstile a GitHub App otevře PR. **Merge** jej zveřejní při
dalším buildu; **Close** jej odmítne. Každý PR přidává samostatný soubor, takže
komentáře nepřepisují společný index. Čtení funguje i při nedostupném Workeru.

Jméno, text a čas jsou veřejné. E-mail ani IP neukládáme do komentářů.
V `hugo.toml` jsou jen veřejné hodnoty `commentServiceURL` a `turnstileSiteKey`;
tajné hodnoty patří do Cloudflare secrets. Worker a návod jsou v
[staticman-deployment/cloudflare](https://github.com/bohumillansky/staticman-deployment/tree/main/cloudflare).

ID článku je Hugo `File.UniqueID` (32 hex znaků). Před přejmenováním/přesunem
zdrojového článku zachovej staré ID ve front matter `commentId`.
Článek může zakázat komentáře pomocí `comments: false`.
Publikovaný `comment-posts.json` obsahuje pouze povolené články, bez draftů.
Starý `staticman.yml` není součástí tohoto procesu.

## Článek s fotografiemi

Hotový příklad je v `content/posts/ukazka-fotografie/`: článek `index.md` a dvě
fotografie uložené vedle něj. V záhlaví front matter `cover.image` vybere
titulní fotografii; `cover.alt` a `cover.caption` nastaví její popis a popisek.
PaperMod při produkčním sestavení vytváří menší varianty titulního snímku.

Obyčejný obrázek do textu vložíš Markdownem:

```markdown
![Popis fotografie](moje-fotografie.jpg)
```

Pro fotografii s popiskem a odkazem na větší verzi použij příklad `figure` v
ukázkovém článku. Nové články zakládej jako složku s `index.md` a obrázky.
Používej webové kopie; plné originály mohou zůstat v pCloud. Ukázkový text
i obrázky jsou ilustrační, zdroje snímků jsou uvedené přímo v článku.

Při veřejném spuštění změň `baseURL`, připoj vlastní Pages doménu/DNS a odeber
preview nastavení `previewNoIndex` i cascade `robotsNoIndex`. Současně aktualizuj
`BLOG_BASE_URL` Workeru a hostname Turnstile.

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
