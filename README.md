# Cron Expression Parser

A command line application which parses a cron string and expands each field to show the times at which it will run.

## Description

This utility parses a standard cron string and outputs a table with the expanded times for each field. It handles the standard 5 time fields:
- minute
- hour
- day of month
- month
- day of week

It supports standard cron features including:
- Wildcards (`*`)
- Ranges (`1-5`)
# Cron Expression Parser

A small command-line utility that parses a standard cron string (5 fields) and expands each field to show the times at which it will run.

**Features**
- Expands the five standard cron fields: `minute`, `hour`, `day of month`, `month`, `day of week`.
- Supports wildcards (`*`), ranges (`1-5`), steps (`*/15`, `1-5/2`) and lists (`1,15`).
- Prints the output in a simple aligned table with the field name in the first 14 columns.

**Note:** This project intentionally avoids using third-party cron parsing libraries (assignment requirement).

**Prerequisites**
- Node.js (recommended: `>=18`).

**Quick install**
1. Clone the repository:

```bash
git clone <repo-url>
cd cron-parser
```

2. (Optional) Install dependencies (there are none required for runtime, but this is safe):

```bash
npm install
```

3. (Optional) Make the script executable and/or install it locally as a CLI:

```bash
chmod +x cron-parser.js
npm link      # installs `cron-parser` command globally for testing
```

**Usage**

Run with `node`:

```bash
node cron-parser.js "*/15 0 1,15 * 1-5 /usr/bin/find"
```

Or (after `npm link`) as a CLI:

```bash
cron-parser "*/15 0 1,15 * 1-5 /usr/bin/find"
```

Shell quoting tip: wrap the whole cron expression and command in single or double quotes so the shell doesn't interpret special characters. Example with single quotes:

```bash
cron-parser '*/15 0 1,15 * 1-5 /usr/bin/find'
```

**Examples**

Input:

```text
*/15 0 1,15 * 1-5 /usr/bin/find
```

Output:

```text
minute         0 15 30 45
hour           0
day of month   1 15
month          1 2 3 4 5 6 7 8 9 10 11 12
day of week    1 2 3 4 5
command        /usr/bin/find
```

**Limitations / Scope**
- Only the standard five cron fields are supported (no `@yearly` / `@daily` special strings).
- Named months/days (e.g., `JAN`, `MON`) are not supported.
- Day-of-week currently uses `0-6` where `0` is Sunday; `7` is not normalized to `0` (could be added later).
- Input validation is basic — malformed numbers may produce errors or be ignored; improved validation would provide clearer errors.

If you plan to extend behavior (e.g., accept `7` for Sunday, named values, or timezone-aware parsing), add tests in `test.js` and implement the changes in `cron-parser.js`.

**Running tests**

This repository includes a small test harness. Run the tests with:

```bash
npm test
# or
node test.js
```

**Developer notes**
- Main implementation: `cron-parser.js`.
- Tests: `test.js` (simple assertions exercising example and edge cases).
- CI: you can add a GitHub Actions workflow to run `npm test` on push/PR.

**Contributing**
- Open an issue or submit a PR for bug fixes or features. Keep changes small and add tests.

**License**
- This project uses the `ISC` license. See `LICENSE` for details.
