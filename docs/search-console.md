# Google Search Console pro zivotvusa.cz

Search Console ukazuje indexování webu a návštěvy z vyhledávání Google.
Ověření vlastnictví, odeslání sitemap a kontrola URL se dokončují v Google
účtu vlastníka. Push do repozitáře tyto operace neprovede.

## 1. Ověř vlastnictví domény

Otevři [Google Search Console](https://search.google.com/search-console/).
Pokud už máš ověřenou property pro tento web, použij ji.
Jinak přidej **Domain property** s hodnotou `zivotvusa.cz` bez protokolu a cesty.
Zahrnuje HTTP, HTTPS i subdomény, například `www`.

Google zobrazí konkrétní DNS TXT hodnotu začínající `google-site-verification=`.
V Cloudflare otevři zónu `zivotvusa.cz` → **DNS** → **Records** a přidej:

| Pole | Hodnota |
| --- | --- |
| Type | `TXT` |
| Name | `@` (kořen domény) |
| Content | Přesná hodnota z Google Search Console |
| TTL | `Auto` |

Zachovej existující DNS záznamy. Po uložení se vrať do Search Console a klikni
na **Verify**. Pokud Google záznam ještě nevidí, počkej na propagaci DNS
a zkus ověření znovu. TXT záznam ponech i po úspěšném ověření.

### Alternativa: ověření přes HTML tag

Pokud nemůžeš upravovat DNS, přidej **URL-prefix property** s přesnou adresou
`https://zivotvusa.cz/` a zvol metodu **HTML tag**. Tato metoda neověřuje
Domain property.

Z tagu dodaného Googlem zkopíruj pouze hodnotu atributu `content` do existující
položky `params.analytics.google.SiteVerificationTag` v `hugo.toml`.
Prázdná hodnota ověřovací tag nevytváří. PaperMod vyplněnou hodnotu vloží
do `<head>` stránek; úprava tématu není potřeba.

Spusť `hugo build --gc --minify`, commitni a pushni změnu. Po úspěšném
deploymentu GitHub Pages ověř ve zdrojovém HTML živé homepage, že obsahuje
`google-site-verification` se správnou hodnotou. Potom v Search Console
klikni na **Verify**. Hodnotu ponech v konfiguraci i po ověření.

Ověřovací hodnota je veřejná. Pro tento postup není potřeba ukládat heslo,
OAuth token ani klíč služby do repozitáře. Nastavení `SiteVerificationTag`
nepřidává Google Analytics ani měření návštěvníků.

## 2. Odešli sitemap

Ve správné ověřené property otevři **Sitemaps** a odešli:

`https://zivotvusa.cz/sitemap.xml`

Pokud pole u URL-prefix property už obsahuje `https://zivotvusa.cz/`, doplň
pouze `sitemap.xml`. Po zpracování zkontroluj stav **Success**.
Hugo sitemap aktualizuje při sestavení; po každém článku ji nemusíš odesílat znovu.
Web na ni také odkazuje z [robots.txt](https://zivotvusa.cz/robots.txt).
Odeslání sitemap nezaručuje indexování jednotlivých stránek.

## 3. Zkontroluj důležité URL

V nástroji **URL Inspection** postupně zadej:

- `https://zivotvusa.cz/`
- `https://zivotvusa.cz/posts/oba-od-zacatku/`

Zkontroluj stav indexování a Googlem zvolenou canonical URL. Pokud stránka
není indexovaná, použij **Test live URL**. Při úspěšném testu můžeš použít
**Request indexing**. Živý test potvrzuje dostupnost pro Google, nikoli
zařazení do indexu; žádost nezaručuje okamžité indexování.

## 4. Sleduj výsledky

V přehledu **Performance → Search results** sleduj kliknutí, imprese, CTR,
dotazy a stránky. Pro české publikum můžeš použít filtr země **Czechia**.
Jednou měsíčně porovnej posledních 28 dní s předchozím obdobím a podívej se,
které dotazy přivádějí čtenáře. U nového webu nemusí být data hned dostupná.
V přehledu **Page indexing** kontroluj případné problémy s články.

Oficiální návody: [ověření vlastnictví](https://support.google.com/webmasters/answer/9008080),
[Sitemaps](https://support.google.com/webmasters/answer/7451001),
[URL Inspection](https://support.google.com/webmasters/answer/9012289),
[výsledky vyhledávání](https://support.google.com/webmasters/answer/7576553).
