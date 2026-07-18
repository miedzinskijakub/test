# Wyszukiwarka promotorów

Wyszukiwarka promotorów działa jako prosta strona internetowa oparta na:

- pliku `index.html`,
- danych pobieranych z Google Sheets,
- plikach PDF z sylwetkami promotorów,
- hostingu na Vercel,
- automatycznym wdrażaniu zmian z repozytorium GitHub.

Strona nie wymaga osobnego backendu ani bazy danych. Dane promotorów są edytowane w arkuszu Google, a pliki PDF są przechowywane bezpośrednio w repozytorium projektu.

---

## 1. Struktura projektu

```text
strona/
├── index.html
├── package.json
├── package-lock.json
├── README.md
├── scripts/
│   └── check404.js
└── profiles/
    ├── pl/
    │   ├── przykładowa-sylwetka.pdf
    │   └── ...
    └── en/
        ├── example-profile.pdf
        └── ...
```

- `profiles/pl` – polskie wersje sylwetek,
- `profiles/en` – angielskie wersje sylwetek,
- `scripts/check404.js` – test sprawdzający, czy linki do PDF-ów działają,
- `index.html` – cała wyszukiwarka i logika pobierania danych z arkusza.

---

## 2. Jak działa połączenie z Google Sheets

Dane są pobierane bezpośrednio z opublikowanego arkusza Google w formacie CSV.

W pliku `index.html` znajduje się adres:

```js
const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1oVB9E0bPJmFyJ1YXhzJH6wyNPV9j6vUhJ6CIjIFxSKE/gviz/tq?tqx=out:csv&sheet=WFPiK";
```

Po otwarciu strony:

1. przeglądarka pobiera dane z arkusza,
2. PapaParse zamienia CSV na dane JavaScript,
3. wyszukiwarka tworzy filtry i karty promotorów,
4. nazwy plików z kolumn `sylwetka_PL` i `sylwetka_EN` są zamieniane na pełne adresy PDF.

Adres strony produkcyjnej jest zapisany w:

```js
const SITE_URL =
  "https://test-pi-plum-24.vercel.app";
```

Przykład:

```text
wartość w arkuszu:
Aneta Grodecka promotorstwo formularz.pdf

adres utworzony przez stronę:
https://test-pi-plum-24.vercel.app/profiles/pl/Aneta%20Grodecka%20promotorstwo%20formularz.pdf
```

W arkuszu nie trzeba wpisywać całego adresu URL. Wystarczy pełna i dokładna nazwa pliku PDF.

Kod obsługuje również pełne adresy zaczynające się od `http://` lub `https://`, ale standardowo należy wpisywać samą nazwę pliku.

---

## 3. Kolumny w arkuszu

| Kolumna | Zastosowanie |
|---|---|
| `name` | imię i nazwisko promotora |
| `discipline_PL` | dyscyplina po polsku |
| `discipline_EN` | dyscyplina po angielsku |
| `unit_PL` | jednostka po polsku |
| `unit_EN` | jednostka po angielsku |
| `research_PL` | obszary badawcze po polsku |
| `research_EN` | obszary badawcze po angielsku |
| `Adres e-mail` | adres e-mail |
| `Aktywny` | określa, czy osoba ma być widoczna |
| `sylwetka_PL` | dokładna nazwa polskiego pliku PDF |
| `sylwetka_EN` | dokładna nazwa angielskiego pliku PDF |

Obszary badawcze można rozdzielać średnikami:

```text
językoznawstwo; fonetyka; język angielski
```

Każda wartość zostanie pokazana jako osobny znacznik.

---

## 4. Dodawanie nowego promotora

1. Otwórz arkusz Google.
2. Dodaj nowy wiersz.
3. Uzupełnij co najmniej:
   - `name`,
   - dyscyplinę,
   - jednostkę,
   - e-mail,
   - obszary badawcze,
   - `Aktywny`.
4. Jeżeli istnieją sylwetki PDF, wpisz ich dokładne nazwy w:
   - `sylwetka_PL`,
   - `sylwetka_EN`.
5. Dodaj pliki PDF do odpowiednich folderów:
   - polski PDF do `profiles/pl`,
   - angielski PDF do `profiles/en`.
6. Wykonaj commit i push do GitHuba.
7. Poczekaj na automatyczne wdrożenie przez Vercel.

Przykład:

```text
name:
Jan Kowalski

sylwetka_PL:
Jan Kowalski promotorstwo formularz.pdf

sylwetka_EN:
Jan Kowalski supervisor form.pdf
```

---

## 5. Dodawanie nowej sylwetki do istniejącej osoby

1. Skopiuj PDF do odpowiedniego folderu:
   - `profiles/pl`,
   - `profiles/en`.
2. W arkuszu znajdź daną osobę.
3. Wpisz dokładną nazwę pliku w odpowiedniej kolumnie.
4. Zapisz arkusz.
5. Dodaj plik do GitHuba i wykonaj push.
6. Po wdrożeniu sprawdź link lub uruchom test 404.

---

## 6. Podmiana istniejącego PDF-a

### Opcja A – zachowanie tej samej nazwy

Najprostsza metoda:

1. przygotuj nowy PDF,
2. nadaj mu dokładnie taką samą nazwę jak poprzedniemu,
3. zastąp plik w folderze `profiles/pl` lub `profiles/en`,
4. wykonaj commit i push.

Nie trzeba wtedy zmieniać nic w arkuszu.

### Opcja B – zmiana nazwy pliku

1. usuń lub zastąp stary PDF,
2. dodaj nowy plik,
3. wpisz jego dokładną nazwę w arkuszu,
4. wykonaj commit i push,
5. uruchom test 404.

---

## 7. Zmiana danych promotora

Dane tekstowe są pobierane z Google Sheets, więc nie trzeba edytować kodu strony.

Aby zmienić nazwisko, dyscyplinę, jednostkę, e-mail, obszary badawcze, aktywność osoby albo nazwę powiązanego PDF-a, wystarczy edytować odpowiednią komórkę w arkuszu.

Po odświeżeniu strony dane powinny zostać pobrane ponownie.

Jeżeli przeglądarka pokazuje stare dane, wykonaj twarde odświeżenie:

```text
Ctrl + F5
```

---

## 8. Usuwanie lub ukrywanie promotora

### Zalecane: ukrycie osoby

W kolumnie `Aktywny` wpisz:

```text
nie
```

Można również użyć:

```text
no
false
```

Wyszukiwarka nie pokaże wtedy tej osoby, ale dane pozostaną w arkuszu.

### Całkowite usunięcie

Można usunąć cały wiersz z arkusza. Jeżeli PDF-y tej osoby nie będą już potrzebne, należy również usunąć je z folderów:

```text
profiles/pl
profiles/en
```

Po usunięciu plików wykonaj commit i push.

---

## 9. Usuwanie samej sylwetki

Aby pozostawić promotora w wyszukiwarce, ale usunąć link do PDF-a:

1. wyczyść komórkę `sylwetka_PL` lub `sylwetka_EN`,
2. opcjonalnie usuń odpowiadający plik PDF z repozytorium,
3. wykonaj commit i push, jeżeli plik został usunięty.

Pusta komórka oznacza, że link do danej wersji sylwetki nie będzie wyświetlany.

---

## 10. Ważne zasady dotyczące nazw plików

Nazwa w arkuszu musi być identyczna z nazwą pliku w repozytorium.

Należy zachować:

- spacje,
- polskie znaki,
- wielkie i małe litery,
- podkreślenia,
- nawiasy,
- rozszerzenie `.pdf`.

Przykład poprawny:

```text
Aneta Grodecka promotorstwo formularz (1).pdf
```

Vercel działa na systemie, w którym wielkość liter może mieć znaczenie. Te nazwy mogą być traktowane jako różne:

```text
Kowalski.pdf
kowalski.pdf
```

Najlepiej kopiować nazwę pliku bezpośrednio z Eksploratora Windows i wklejać ją do arkusza.

---

## 11. Test linków i błędów 404

W projekcie znajduje się skrypt:

```text
scripts/check404.js
```

Skrypt:

- pobiera dane z Google Sheets,
- sprawdza kolumny `sylwetka_PL` i `sylwetka_EN`,
- tworzy adresy zgodne z konfiguracją strony,
- wysyła zapytanie do każdego PDF-a,
- wypisuje pliki działające i błędy, np. `404`.

### Pierwsze uruchomienie

Otwórz PowerShell w głównym folderze projektu:

```powershell
cd C:\Users\Jakub\Downloads\strona
```

Zainstaluj zależność:

```powershell
npm install papaparse
```

Instalację wykonuje się tylko raz.

### Uruchomienie testu

```powershell
node scripts/check404.js
```

Przykładowy poprawny wynik:

```text
✅ Jan Kowalski (PL)
✅ Jan Kowalski (EN)

Znaleziono 0 błędów.
```

Przykładowy błąd:

```text
❌ Jan Kowalski (EN) -> 404
https://test-pi-plum-24.vercel.app/profiles/en/Jan%20Kowalski.pdf
```

Błąd `404` oznacza zazwyczaj, że:

- plik nie istnieje,
- plik jest w złym folderze,
- nazwa w arkuszu różni się od nazwy pliku,
- różni się wielkość liter,
- zmiany nie zostały jeszcze wdrożone na Vercel.

---

## 12. Kiedy uruchamiać test 404

Test warto uruchomić:

- po dodaniu nowych PDF-ów,
- po zmianie nazw plików,
- po podmianie sylwetek,
- po większej aktualizacji arkusza,
- przed publikacją,
- po zakończeniu wdrożenia na Vercel.

Test sprawdza stronę produkcyjną, dlatego najpierw należy poczekać, aż Vercel zakończy wdrażanie zmian.

---

## 13. Aktualizacja strony przez GitHub i Vercel

Po dodaniu, zmianie lub usunięciu plików:

```powershell
git status
git add .
git commit -m "Aktualizacja sylwetek promotorów"
git push
```

Po wykonaniu `git push` Vercel automatycznie rozpocznie nowe wdrożenie.

Następnie:

1. poczekaj, aż deployment otrzyma status `Ready`,
2. otwórz stronę produkcyjną,
3. wykonaj `Ctrl + F5`,
4. uruchom test 404.

---

## 14. Typowa procedura dodania nowej osoby

1. Dodaj wiersz w Google Sheets.
2. Uzupełnij dane promotora.
3. Dodaj PDF-y do `profiles/pl` i `profiles/en`.
4. Wpisz dokładne nazwy plików w `sylwetka_PL` i `sylwetka_EN`.
5. W terminalu wykonaj:

```powershell
git add .
git commit -m "Dodanie nowego promotora"
git push
```

6. Poczekaj na Vercel.
7. Uruchom:

```powershell
node scripts/check404.js
```

8. Sprawdź osobę w wyszukiwarce.

---

## 15. Typowe problemy

### PDF zwraca 404

Sprawdź:

- czy plik znajduje się w odpowiednim folderze,
- czy nazwa w arkuszu jest identyczna,
- czy rozszerzenie to `.pdf`,
- czy zmiany zostały wysłane na GitHub,
- czy deployment Vercela jest zakończony.

### Osoba nie pojawia się w wyszukiwarce

Sprawdź:

- czy `name` nie jest puste,
- czy `Aktywny` nie ma wartości `nie`, `no` lub `false`,
- czy arkusz jest dostępny publicznie,
- czy nie ma błędu w nazwach kolumn.

### Dane nie aktualizują się

Wykonaj:

```text
Ctrl + F5
```

Jeżeli problem nadal występuje, otwórz:

```text
F12 → Console
```

### Test nic nie wypisuje

Sprawdź, czy plik `scripts/check404.js` nie jest pusty i czy na końcu znajduje się:

```js
check404();
```

### Błąd `Identifier 'Papa' has already been declared`

Kod został najprawdopodobniej wklejony dwa razy. Usuń całą zawartość pliku `scripts/check404.js` i wklej jedną pełną wersję skryptu.

---

## 16. Najważniejsze informacje dla administratora

- dane osób zmieniamy w Google Sheets,
- PDF-y dodajemy do repozytorium,
- w arkuszu wpisujemy dokładną nazwę pliku,
- polskie PDF-y trafiają do `profiles/pl`,
- angielskie PDF-y trafiają do `profiles/en`,
- usunięcie lub zmiana pliku wymaga `git push`,
- Vercel wdraża zmiany automatycznie,
- po wdrożeniu należy uruchomić test 404,
- osoby można ukrywać za pomocą kolumny `Aktywny`.

---

## 17. Adresy używane przez projekt

Strona produkcyjna:

```text
https://test-pi-plum-24.vercel.app
```

Arkusz danych:

```text
https://docs.google.com/spreadsheets/d/1oVB9E0bPJmFyJ1YXhzJH6wyNPV9j6vUhJ6CIjIFxSKE/gviz/tq?tqx=out:csv&sheet=WFPiK
```

Przy zmianie domeny lub arkusza należy zaktualizować w `index.html`:

```js
const SHEET_URL = "...";
const SITE_URL = "...";
```

Te same wartości powinny być również używane w `scripts/check404.js`.
