# Matrix-strategier i GitHub Actions

En **matrix-strategi** i GitHub Actions låter dig köra samma jobb flera gånger med olika konfigurationer - automatiskt och parallellt.

## Grundkoncept

Tänk dig att du vill testa din kod i tre olika Node.js-versioner. Istället för att skriva tre separata jobb kan du definiera en matrix:

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18, 20, 22]
    steps:
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      - run: npm test
```

GitHub Actions skapar automatiskt **tre parallella jobb** - ett för varje Node-version.

## Så fungerar det

### 1. Definiera matrix under `strategy`

```yaml
strategy:
  matrix:
    variabelnamn: [värde1, värde2, värde3]
```

### 2. Referera till värdet med `${{ matrix.variabelnamn }}`

Variabeln ersätts med aktuellt värde för varje jobb-instans.

### 3. GitHub skapar ett jobb per kombination

Om du har 3 värden får du 3 parallella jobb.

## Flera dimensioner

Du kan kombinera flera variabler. GitHub skapar då jobb för **alla kombinationer**:

```yaml
strategy:
  matrix:
    os: [ubuntu-latest, windows-latest]
    node: [18, 20]
```

Detta skapar **4 jobb** (2 OS × 2 Node-versioner):
- ubuntu-latest + Node 18
- ubuntu-latest + Node 20
- windows-latest + Node 18
- windows-latest + Node 20

## Viktiga inställningar

### `fail-fast`

```yaml
strategy:
  fail-fast: false  # default är true
  matrix:
    node: [18, 20, 22]
```

| Värde | Beteende |
|-------|----------|
| `true` (default) | Avbryt alla jobb om ett misslyckas |
| `false` | Låt alla jobb slutföra oavsett resultat |

**Tips:** Använd `fail-fast: false` för tester där du vill se vilka konfigurationer som fungerar.

### `max-parallel`

Begränsa antal samtidiga jobb:

```yaml
strategy:
  max-parallel: 2
  matrix:
    browser: [chromium, firefox, webkit, edge]
```

Kör max 2 jobb samtidigt istället för alla 4. Användbart för att:
- Spara på GitHub Actions-minuter
- Undvika att överbelasta externa tjänster

## Inkludera och exkludera

### `include` - Lägg till specifika kombinationer

Lägg till extra konfigurationer eller variabler för specifika fall:

```yaml
strategy:
  matrix:
    os: [ubuntu-latest, windows-latest]
    node: [18, 20]
    include:
      - os: ubuntu-latest
        node: 22
        experimental: true
```

### `exclude` - Ta bort specifika kombinationer

Hoppa över kombinationer som inte är relevanta:

```yaml
strategy:
  matrix:
    os: [ubuntu-latest, windows-latest, macos-latest]
    browser: [chromium, firefox, webkit]
    exclude:
      - os: windows-latest
        browser: webkit  # WebKit stöds inte bra på Windows
```

## Dynamiska jobbnamn

Använd matrix-variabler i jobbnamnet för tydlighet:

```yaml
jobs:
  test:
    name: Test (${{ matrix.os }}, Node ${{ matrix.node }})
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest]
        node: [18, 20]
```

Resulterar i:
- "Test (ubuntu-latest, Node 18)"
- "Test (ubuntu-latest, Node 20)"
- "Test (windows-latest, Node 18)"
- "Test (windows-latest, Node 20)"

## Praktiska användningsområden

### Testa flera språkversioner

```yaml
matrix:
  python-version: ['3.9', '3.10', '3.11', '3.12']
```

### Cross-platform testning

```yaml
matrix:
  os: [ubuntu-latest, windows-latest, macos-latest]
```

### Webbläsartestning

```yaml
matrix:
  browser: [chromium, firefox, webkit]
```

### Databaskompabilitet

```yaml
matrix:
  database: [postgres, mysql, sqlite]
```

### Kombinerad testmatris

```yaml
matrix:
  os: [ubuntu-latest, macos-latest]
  node: [18, 20]
  database: [postgres, sqlite]
# Skapar 2 × 2 × 2 = 8 jobb
```

## Använda matrix med andra steg

Matrix-variabler kan användas överallt i jobbet:

```yaml
jobs:
  build:
    strategy:
      matrix:
        config: [debug, release]
    steps:
      - name: Build ${{ matrix.config }}
        run: npm run build:${{ matrix.config }}

      - name: Upload artifact
        uses: actions/upload-artifact@v4
        with:
          name: build-${{ matrix.config }}
          path: dist/
```

## Villkorlig körning med matrix

Kör steg endast för specifika matrix-värden:

```yaml
steps:
  - name: Extra steg endast för Node 22
    if: matrix.node == 22
    run: npm run experimental-tests
```

## Avancerat: Flerdimensionella matriser

Du kan kombinera hur många dimensioner som helst. GitHub skapar automatiskt **alla möjliga kombinationer**.

### Exempel: Node-versioner × Webbläsare

```yaml
jobs:
  e2e-test:
    name: E2E (${{ matrix.browser }}, Node ${{ matrix.node }})
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        node: [18, 20, 22]
        browser: [chromium, firefox, webkit]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
      - run: npm ci
      - run: npx playwright install --with-deps ${{ matrix.browser }}
      - run: npx playwright test --project=${{ matrix.browser }}
```

Detta skapar **9 jobb** (3 Node × 3 webbläsare):

| Node | Browser |
|------|---------|
| 18 | chromium |
| 18 | firefox |
| 18 | webkit |
| 20 | chromium |
| 20 | firefox |
| 20 | webkit |
| 22 | chromium |
| 22 | firefox |
| 22 | webkit |

### Exempel: OS × Node × Databas

```yaml
strategy:
  matrix:
    os: [ubuntu-latest, windows-latest]
    node: [18, 20]
    database: [postgres, mysql]
```

Skapar **8 jobb** (2 × 2 × 2 = 8 kombinationer).

### Begränsa kombinationer med `exclude`

Ibland fungerar inte alla kombinationer. Använd `exclude` för att ta bort specifika:

```yaml
strategy:
  matrix:
    os: [ubuntu-latest, windows-latest, macos-latest]
    node: [18, 20, 22]
    browser: [chromium, firefox, webkit]
    exclude:
      # WebKit på Windows fungerar dåligt
      - os: windows-latest
        browser: webkit
      # Node 22 är experimentellt, testa bara i Chromium
      - node: 22
        browser: firefox
      - node: 22
        browser: webkit
```

### Lägg till unika värden med `include`

Använd `include` för att lägga till extra variabler för specifika kombinationer:

```yaml
strategy:
  matrix:
    node: [18, 20]
    browser: [chromium, firefox]
    include:
      # Lägg till experimental-flagga för senaste kombinationen
      - node: 20
        browser: firefox
        experimental: true
        extra-flags: "--debug"
```

Nu kan du använda `${{ matrix.experimental }}` och `${{ matrix.extra-flags }}` i stegen.

### Komplett avancerat exempel

```yaml
jobs:
  test:
    name: Test (Node ${{ matrix.node }}, ${{ matrix.browser }}, ${{ matrix.os }})
    runs-on: ${{ matrix.os }}
    strategy:
      fail-fast: false
      max-parallel: 6
      matrix:
        os: [ubuntu-latest, windows-latest]
        node: [18, 20]
        browser: [chromium, firefox, webkit]
        exclude:
          - os: windows-latest
            browser: webkit
        include:
          - os: ubuntu-latest
            node: 22
            browser: chromium
            experimental: true
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}

      - run: npm ci

      - name: Install browser
        run: npx playwright install --with-deps ${{ matrix.browser }}

      - name: Run tests
        run: npx playwright test --project=${{ matrix.browser }}
        continue-on-error: ${{ matrix.experimental == true }}

      - name: Upload report
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: report-${{ matrix.os }}-node${{ matrix.node }}-${{ matrix.browser }}
          path: playwright-report/
```

**Vad händer här:**
- 2 OS × 2 Node × 3 webbläsare = 12 kombinationer
- Minus 2 exkluderade (Windows + WebKit) = 10 jobb
- Plus 1 inkluderad (Ubuntu + Node 22 + Chromium) = **11 jobb totalt**
- `max-parallel: 6` begränsar till 6 samtidiga
- `continue-on-error` låter experimentella jobb misslyckas utan att faila hela workflowen

### Beräkna antal jobb

```
Totalt = (dim1 × dim2 × dim3...) - exclude + include
```

**Varning:** Det är lätt att skapa väldigt många jobb:
- 3 × 3 × 3 = 27 jobb
- 4 × 4 × 4 = 64 jobb
- 5 × 5 × 5 = 125 jobb

Varje jobb kostar GitHub Actions-minuter och tar tid!

## Begränsningar

- Max **256 jobb** per workflow-körning
- Varje jobb förbrukar GitHub Actions-minuter
- Stora matriser kan bli dyra och långsamma

## Sammanfattning

| Koncept | Beskrivning |
|---------|-------------|
| `matrix` | Definierar variabler och värden |
| `${{ matrix.x }}` | Refererar till aktuellt värde |
| `fail-fast` | Styr om jobb avbryts vid fel |
| `max-parallel` | Begränsar samtidiga jobb |
| `include` | Lägger till extra kombinationer |
| `exclude` | Tar bort specifika kombinationer |

Matrix-strategier är ett kraftfullt verktyg för att testa kod i flera miljöer utan att duplicera workflow-kod.
