# Jak napsat a publikovat článek s fotografiemi

Články se píší v Markdownu v repozitáři `zivotvusa.cz`. Každý nový článek
ukládej do vlastní složky v `content/posts/`: text do `index.md` a fotografie
vedle něj. Hotovou ukázku najdeš v
[content/posts/ukazka-fotografie](../content/posts/ukazka-fotografie/index.md).

## 1. Založ článek

Vyber krátký název složky bez diakritiky a mezer, například `vylet-do-denveru`.
Název bude součástí adresy článku. Vytvoř tuto strukturu:

```text
content/posts/vylet-do-denveru/
├── index.md
├── denver-panorama.jpg
└── park.jpg
```

V editoru vytvoř složku a soubor `index.md`. V terminálu můžeš složku založit
takto (příkazy v tomto návodu spouštěj z kořene repozitáře `zivotvusa.cz`):

```sh
mkdir -p content/posts/vylet-do-denveru
```

Do `index.md` vlož následující šablonu a uprav údaje i text. Pokud zatím nemáš
titulní fotografii, vynech celý blok `cover`.

```markdown
---
title: "Náš výlet do Denveru"
date: 2026-10-09T10:00:00-06:00
draft: true
description: "Co jsme zažili během jednoho dne v Denveru."
categories: ["cestovani"]
tags: ["Colorado", "Denver", "rodina"]
cover:
  image: "denver-panorama.jpg"
  alt: "Pohled na centrum Denveru s horami v pozadí."
  caption: "Denver během našeho podzimního výletu."
  relative: true
---

Krátký úvod: kam jsme vyrazili a proč o tom chci napsat.

<!--more-->

## Co jsme zažili

Sem patří samotný příběh.

![Stromy podél pěšiny v parku.](park.jpg)

## Co bych doporučil příště

Praktické tipy nebo závěrečná vzpomínka.
```

Záhlaví mezi `---` se nazývá **front matter**. Dodrž odsazení mezerami,
zejména u `cover`. Význam jednotlivých položek:

| Položka | Co vyplnit |
| --- | --- |
| `title` | Nadpis článku; v textu už nepřidávej další nadpis `#`. |
| `date` | Datum a čas publikování včetně časového posunu. V Coloradu je letní čas `-06:00`, zimní `-07:00`. |
| `draft` | `true` pro rozepsaný článek, `false` pro publikování. |
| `description` | Krátké shrnutí obsahu. |
| `categories` | Kategorie; používej existující názvy, například `cestovani` nebo `finance`. |
| `tags` | Konkrétní témata, místa nebo klíčová slova. |
| `cover` | Volitelná titulní fotografie, její popis a popisek. |

Článek s datem v budoucnosti se v běžném sestavení nezobrazí, ani když má
`draft: false`. Pro okamžité zveřejnění nastav aktuální nebo minulé datum.

## 2. Napiš text

Mezi odstavci nech prázdný řádek. Základní formátování:

```markdown
## Nadpis části
### Menší nadpis

**Tučný text**, *kurzíva* a [text odkazu](https://example.com/).

- První bod
- Druhý bod

1. První krok
2. Druhý krok

> Citace nebo krátká poznámka.
```

Značka `<!--more-->` oddělí úvodní shrnutí pro seznam článků od zbytku textu.
Před ni dej krátký úvod, který čtenáři vysvětlí, o čem článek je.

## 3. Přidej fotografie

Z telefonu nebo pCloud exportuj **webové kopie** a vlož je do složky článku.
Originály mohou zůstat v pCloud; do textu odkazuj na místní soubory, aby web
nepotřeboval přístup do tvého účtu.

- Pro fotografie používej JPG; HEIC z telefonu nejdřív exportuj do JPG.
- Jako výchozí nastavení exportu zvol delší stranu kolem 1 600–2 000 pixelů
  a kvalitu JPG kolem 80 %. Zkontroluj, že je snímek stále ostrý a soubor nemá
  zbytečně několik megabajtů.
- Pojmenuj soubory například `denver-panorama.jpg`, bez mezer a diakritiky.
  Název v textu musí přesně odpovídat souboru, včetně velikosti písmen.
- Před nahráním zkontroluj obsah snímku i metadata; případné GPS údaje odstraň
  při exportu, pokud je nechceš zveřejnit. Repozitář i nahrané fotografie jsou veřejné.

### Titulní fotografie

V záhlaví nastav `cover.image` na název souboru uloženého vedle `index.md`.
`cover.alt` popisuje, co je na snímku, pro čtečky obrazovky;
`cover.caption` je viditelný popisek. Používej blok `cover` z šablony výše.

PaperMod při produkčním sestavení vytváří menší varianty titulní fotografie.
Fotografie vložené do textu níže tímto blokem nezmenšuje, proto je předem exportuj
v rozumné velikosti.

### Fotografie uvnitř textu

Pro jednoduchý obrázek napiš:

```markdown
![Stromy podél pěšiny v parku.](park.jpg)
```

Text v hranatých závorkách je alternativní popis, nikoli viditelný popisek.
Pro viditelný popisek a otevření fotografie po kliknutí použij Hugo `figure`:

```text
{{< figure
  src="park.jpg"
  alt="Stromy podél pěšiny v parku."
  caption="Odpolední procházka v Denveru. Foto: vlastní archiv."
  link="park.jpg"
  target="_blank"
  rel="noopener noreferrer"
>}}
```

Takto otevřeš stejnou webovou kopii v nové záložce. Pro každý další snímek vlož
další obrázek nebo blok `figure` tam, kde souvisí s příběhem.
U převzatých fotografií uveď autora a zdroj a ověř oprávnění k použití.

## 4. Prohlédni si náhled

Nainstaluj verzi Hugo Extended uvedenou v [README](../README.md#lokální-vývoj).
Při prvním spuštění stáhni téma a potom spusť náhled:

```sh
git submodule update --init --recursive
hugo server --buildDrafts
```

Otevři adresu, kterou Hugo vypíše v terminálu (obvykle `http://localhost:1313/`).
Úpravy uloženého textu se v náhledu obnovují automaticky. Pokud je datum článku
v budoucnosti, použij `hugo server --buildDrafts --buildFuture`.
Server zastavíš pomocí `Ctrl+C`.

Před publikováním zkontroluj nadpis, odstavce, odkazy, titulní fotografii,
všechny fotografie v textu a popisky. Prohlédni si také úzké okno prohlížeče,
které přibližuje zobrazení na telefonu.

## 5. Publikuj článek

1. V záhlaví změň `draft: true` na `draft: false` a ověř datum.
2. Zkontroluj produkční sestavení příkazem `hugo build --gc --minify`.
3. Ulož do Gitu celou složku článku včetně fotografií a odešli změny na GitHub.
   Pokud pracuješ ve větvi, otevři pull request a po úspěšném buildu jej mergni
   do `main`. Push do `main` spustí sestavení a publikování na GitHub Pages.
4. V záložce **Actions** na GitHubu počkej na úspěšné dokončení workflow
   **Build and deploy Hugo site**. Samotný build pull requestu web nepublikuje.
5. Otevři web z odkazu v dokončeném deploymentu a ověř nový článek i fotografie.

Commituj zdrojový `index.md` a fotografie; generované `public/`, `resources/`
ani `.hugo_build.lock` se necommitují. I soubory článku s `draft: true` jsou
ve veřejném repozitáři viditelné, jen se nezobrazují na sestaveném webu.

Pokud používáš pouze web GitHubu, založ soubor přes **Add file → Create new file**
s cestou `content/posts/vylet-do-denveru/index.md`. Potom v jeho složce použij
**Add file → Upload files** pro fotografie. Nejprve vše připrav ve stejné větvi
a mergni až po nahrání všech souborů a úspěšném buildu. Náhled článku s Hugo
`figure` a titulní fotografií ověř lokálně; zobrazení Markdownu na GitHubu není
náhled výsledného blogu.

## Pozdější úpravy a komentáře

Text i fotografie upravuj ve stejné složce; další publikování proběhne opět
po změně v `main`. Název složky nebo cestu publikovaného článku neměň bez
zachování původního `commentId`: komentáře jsou navázané na ID odvozené z cesty.
Podrobnosti jsou v [README](../README.md#náhled-a-komentáře).
Pokud u článku nechceš komentáře, přidej do záhlaví `comments: false`.
