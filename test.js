const assert = require('assert');
const { exec } = require('child_process');
const path = require('path');

const SCRIPT_PATH = path.join(__dirname, 'cron-parser.js');

function runParser(args, callback) {
    exec(`node "${SCRIPT_PATH}" "${args}"`, (error, stdout, stderr) => {
        callback(error, stdout, stderr);
    });
}

console.log('Running tests...');

// Test Case 1: Example from requirements
const input1 = "*/15 0 1,15 * 1-5 /usr/bin/find";
runParser(input1, (error, stdout, stderr) => {
    assert.ifError(error);

    const lines = stdout.trim().split('\n');
    assert.strictEqual(lines[0].trim(), "minute         0 15 30 45");
    assert.strictEqual(lines[1].trim(), "hour           0");
    assert.strictEqual(lines[2].trim(), "day of month   1 15");
    assert.strictEqual(lines[3].trim(), "month          1 2 3 4 5 6 7 8 9 10 11 12");
    assert.strictEqual(lines[4].trim(), "day of week    1 2 3 4 5");
    assert.strictEqual(lines[5].trim(), "command        /usr/bin/find");

    console.log('Test Case 1 passed!');
});

// Test Case 2: Simple exact values
const input2 = "0 12 1 1 1 /bin/true";
runParser(input2, (error, stdout, stderr) => {
    assert.ifError(error);

    const lines = stdout.trim().split('\n');
    assert.ok(lines[0].includes("minute         0"));
    assert.ok(lines[1].includes("hour           12"));
    assert.ok(lines[2].includes("day of month   1"));
    assert.ok(lines[3].includes("month          1"));
    assert.ok(lines[4].includes("day of week    1"));
    assert.ok(lines[5].includes("command        /bin/true"));

    console.log('Test Case 2 passed!');
});

// Test Case 3: Ranges
const input3 = "0-5 0 1 1 1 /bin/true";
runParser(input3, (error, stdout, stderr) => {
    assert.ifError(error);
    const lines = stdout.trim().split('\n');
    assert.ok(lines[0].includes("minute         0 1 2 3 4 5"));
    console.log('Test Case 3 passed!');
});

// Test Case 4: Steps
const input4 = "*/20 * * * * /bin/true";
runParser(input4, (error, stdout, stderr) => {
    assert.ifError(error);
    const lines = stdout.trim().split('\n');
    assert.ok(lines[0].includes("minute         0 20 40"));
    console.log('Test Case 4 passed!');
});

// Test Case 5: Invalid Input (Too few arguments)
runParser("invalid", (error, stdout, stderr) => {
    assert.ok(error); // Should exit with error code
    assert.ok(stderr.includes("Error: Invalid cron expression format"));
    console.log('Test Case 5 passed!');
});

// Test Case 6: Invalid Input (Empty)
runParser("", (error, stdout, stderr) => {
    assert.ok(error);
    assert.ok(stderr.includes("Error: Please provide a cron expression"));
    console.log('Test Case 6 passed!');
});