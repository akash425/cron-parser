#!/usr/bin/env node

const FIELD_RANGES = {
    "minute": [0, 59],
    "hour": [0, 23],
    "day of month": [1, 31],
    "month": [1, 12],
    "day of week": [0, 6]
}

const FIELD_NAMES = [
    "minute",
    "hour",
    "day of month",
    "month",
    "day of week"
]

function padRight(str, length) {
    return str.padEnd(length, ' ');
}

function parseField(field, range) {
    const min = range[0];
    const max = range[1];
    const values = new Set();
    const parts = field.split(",");

    for (const part of parts) {
        let start = min;
        let end = max;
        let step = 1;

        if (part.includes("/")) {
            const [rangePart, stepPart] = part.split("/");
            step = parseInt(stepPart);
            if (rangePart === "*") {
                // start and end remain min and max
            } else if (rangePart.includes("-")) {
                const [s, e] = rangePart.split("-").map(v => parseInt(v));
                start = s;
                end = e;
            } else {
                start = parseInt(rangePart);
                end = max;
            }
        } else if (part.includes("-")) {
            const [s, e] = part.split("-").map(v => parseInt(v));
            start = s;
            end = e;
        } else if (part === "*") {
            // start and end remain min and max
        } else {
            start = parseInt(part);
            end = start;
        }

        for (let i = start; i <= end; i += step) {
            if (i >= min && i <= max) {
                values.add(i);
            }
        }
    }
    return Array.from(values).sort((a, b) => a - b);
}

function parseCron(cronString) {
    const parts = cronString.trim().split(/\s+/);

    if (parts.length < 6) {
        console.error("Error: Invalid cron expression format.");
        console.error("Usage: node cron-parser.js \"*/15 0 1,15 * 1-5 /usr/bin/find\"");
        process.exit(1);
    }

    const cronFields = parts.slice(0, 5);
    const command = parts.slice(5).join(' ');

    const output = []

    let fieldIndex = 0;
    for (const fieldName of FIELD_NAMES) {
        try {
            const field = cronFields[fieldIndex];
            const range = FIELD_RANGES[fieldName];

            const values = parseField(field, range);
            const line = `${padRight(fieldName, 14)} ${values.join(' ')}`;
            output.push(line);
        } catch (error) {
            console.error(`Error parsing field ${fieldName}: ${error.message}`);
            process.exit(1);
        }
        fieldIndex++;
    }

    output.push(`${padRight('command', 14)} ${command}`);
    console.log(output.join('\n'));
}

if (require.main === module) {
    const cronString = process.argv[2];
    if (!cronString) {
        console.error("Error: Please provide a cron expression as a single argument.");
        console.error("Usage: node cron-parser.js \"*/15 0 1,15 * 1-5 /usr/bin/find\"");
        process.exit(1);
    }
    parseCron(cronString);
}