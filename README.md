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
- Steps (`*/15`, `1-5/2`)
- Lists (`1,15`)

## Prerequisites

- Node.js installed on your system.

## Installation

1. Clone the repository or download the source code.
2. Navigate to the project directory.
3. Make the script executable (optional, for Linux/macOS):
   ```bash
   chmod +x cron-parser.js
   ```

## Usage

You can run the parser using `node`:

```bash
node cron-parser.js "*/15 0 1,15 * 1-5 /usr/bin/find"
```

Or if you made it executable:

```bash
./cron-parser.js "*/15 0 1,15 * 1-5 /usr/bin/find"
```

## Output Format

The output is formatted as a table with the field name taking the first 14 columns and the times as a space-separated list following it.

Example output:
```
minute         0 15 30 45
hour           0
day of month   1 15
month          1 2 3 4 5 6 7 8 9 10 11 12
day of week    1 2 3 4 5
command        /usr/bin/find
```

## Running Tests

To run the included test suite:

```bash
node test.js
```