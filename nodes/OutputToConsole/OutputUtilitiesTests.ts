import { OutputUtilities } from './OutputUtilities';
import * as assert from 'assert';

const outputUtilities = new OutputUtilities();

// Test cases
const testCases = [
    { input: { key: 'value' }, description: 'JSON object', expected: 'Key: value' },
    { input: '[1, 2, 3]', description: 'Stringified JSON array', expected: ' - 1\n - 2\n - 3' },
    { input: 'Just a string', description: 'Plain string', expected: 'Just a string' },
    { input: '{"nested": {"key": "value"}}', description: 'Stringified nested JSON object', expected: 'Nested:\n  Key: value' },
    { input: 123, description: 'Number', expected: '123' },
    { input: true, description: 'Boolean', expected: 'true' },
    { input: null, description: 'Null', expected: 'null' },
];

testCases.forEach((testCase) => {
    const result = outputUtilities.formatOutput(testCase.input);
    try {
        assert.strictEqual(result, testCase.expected);
        console.log(`Test case: ${testCase.description} - Passed`);
    } catch (error) {
        console.log(`Test case: ${testCase.description} - Failed`);
        console.log(`  Expected: ${testCase.expected}`);
        console.log(`  Got: \n${result}`);
    }
    console.log('-------------------------');
});
