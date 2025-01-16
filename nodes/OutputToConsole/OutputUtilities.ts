export class OutputUtilities {
    public formatOutput(obj: any): string {
        if (this.isJsonObject(obj)) {
            return this.friendlyJsonStringify(obj).trimEnd();
        } else if (typeof obj === 'string') {
            const parsedObj = this.tryParseJson(obj);
            if (parsedObj !== null) {
                return this.friendlyJsonStringify(parsedObj).trimEnd();
            }
        }
        return String(obj);
    }

    private friendlyJsonStringify(obj: any, indent: number = 0): string {
        let result = "";
        const padding = ' '.repeat(indent); // Indentation based on current depth

        if (typeof obj !== 'object' || obj === null) {
            // Base case for primitive types
            result += `${padding}${obj}\n`;
            return result;
        }

        if (Array.isArray(obj)) {
            // Handle arrays
            obj.forEach((item, index) => {
                result += `${padding} - `;
                result += this.friendlyJsonStringify(item, 0);
            });
            return result;
        }

        for (const [key, value] of Object.entries(obj)) {
            // Convert key to sentence case
            const sentenceCaseKey = key.charAt(0).toUpperCase() + key.slice(1);
            if (typeof value === 'object' && value !== null) {
                result += `${padding}${sentenceCaseKey}:\n`;
                result += this.friendlyJsonStringify(value, indent + 2); // Recursively format nested object
            } else {
                result += `${padding}${sentenceCaseKey}: ${value}\n`;
            }
        }

        return result;
    }

    private isJsonObject(obj: any): boolean {
        return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
    }

    private tryParseJson(str: string): any {
        try {
            const parsed = JSON.parse(str);
            if (typeof parsed === 'object' && parsed !== null) {
                return parsed;
            }
        } catch (e) {
            // If parsing fails, return null
            return null;
        }
        return null;
    }
}
