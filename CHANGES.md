# Implementera Matrix-strategi för E2E-tester i GitHub Actions

Den här guiden visar hur vi omstrukturerade vår GitHub Actions workflow för att köra E2E-tester parallellt i flera webbläsare med hjälp av en **matrix-strategi**.

## Bakgrund

Vår ursprungliga workflow körde alla tester i ett enda jobb:
- Unit-tester (Vitest)
- E2E-tester (Playwright) - endast i Chromium
- API-tester (Newman)

**Problemet:** Vi ville testa i flera webbläsare (Chromium, Firefox, WebKit) utan att påverka de andra testerna.

## Lösning: Separata jobb med matrix

### Steg 1: Dela upp i separata jobb

Istället för ett stort jobb skapade vi tre separata:

```yaml
jobs:
  unit-tests:
    name: Unit Tests
    # ...

  e2e-tests:
    name: E2E Tests (${{ matrix.browser }})
    # ...

  api-tests:
    name: API Tests
    # ...
```

**Fördelar:**
- Jobben körs parallellt (snabbare total körtid)
- Tydlig separation av ansvarsområden
- Om ett jobb misslyckas fortsätter de andra

### Steg 2: Lägg till matrix-strategi för E2E

Matrix-strategin skapar automatiskt flera parallella jobb baserat på en lista av värden:

```yaml
e2e-tests:
  name: E2E Tests (${{ matrix.browser }})
  runs-on: ubuntu-latest
  strategy:
    fail-fast: false
    matrix:
      browser: [chromium, firefox, webkit]
```

**Viktiga inställningar:**
- `fail-fast: false` - Om en webbläsare misslyckas fortsätter de andra
- `matrix.browser` - Variabeln som innehåller aktuell webbläsare

### Steg 3: Använd matrix-variabeln

Matrix-variabeln `${{ matrix.browser }}` används på flera ställen:

**Cache-nyckel (unik per webbläsare):**
```yaml
key: playwright-${{ matrix.browser }}-${{ runner.os }}-${{ hashFiles('package-lock.json') }}
```

**Installation av rätt webbläsare:**
```yaml
run: npx playwright install --with-deps ${{ matrix.browser }}
```

**Köra tester för specifik webbläsare:**
```yaml
run: npx playwright test --project=${{ matrix.browser }}
```

**Unika artifact-namn vid fel:**
```yaml
name: playwright-report-${{ matrix.browser }}
```

### Steg 4: Uppdatera Playwright-konfigurationen

För att `--project=firefox` och `--project=webkit` ska fungera måste dessa projekt finnas i `playwright.config.ts`:

```typescript
projects: [
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'] },
  },
  {
    name: 'firefox',
    use: { ...devices['Desktop Firefox'] },
  },
  {
    name: 'webkit',
    use: { ...devices['Desktop Safari'] },
  },
],
```

**Viktigt:** Projektnamnen i config måste matcha värdena i matrix-arrayen exakt.

## Resultat

Efter ändringarna ser workflow-körningen ut så här i GitHub Actions:

```
Tests
├── Unit Tests          ✓ (körs en gång)
├── E2E Tests (chromium) ✓ (körs parallellt)
├── E2E Tests (firefox)  ✓ (körs parallellt)
├── E2E Tests (webkit)   ✓ (körs parallellt)
└── API Tests           ✓ (körs en gång)
```

## Sammanfattning

| Före | Efter |
|------|-------|
| 1 jobb med alla tester | 3 separata jobb |
| E2E endast i Chromium | E2E i 3 webbläsare parallellt |
| Sekventiell körning | Parallell körning |
| ~1 artifact vid fel | 1 artifact per webbläsare |

## Tips för vidareutveckling

- Lägg till fler webbläsare genom att utöka matrix-arrayen
- Kombinera med OS-matrix: `os: [ubuntu-latest, windows-latest]`
- Använd `needs:` för att skapa beroenden mellan jobb
- Överväg `continue-on-error: true` för experimentella tester
