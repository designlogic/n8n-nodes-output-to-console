export class OutputUtilities {
    public formatOutput(obj: any, name?: string): string {

			name = this.toSentenceCase(name || "");

        if (this.isJsonObject(obj)) {
            return ((name) ? `${name}: \n\n` : "") + this.friendlyJsonStringify(obj).trimEnd();
        } else if (typeof obj === 'string') {
            const parsedObj = this.tryParseJson(obj);
            if (parsedObj !== null) {
                return ((name) ? `${name}: \n\n` : "") + this.friendlyJsonStringify(parsedObj).trimEnd();
            }
        }

        return ((name) ? `${name}: ` : "") + String(obj);
    }

		public hasValue(value: any): boolean {
			return value !== null && value !== undefined && value.toString().trim().length > 0
		}

		public singleItemTemplate(content: string) : string{
			return `


=================================================

${content}

=================================================


`}

		public multiItemTemplate(content: string, index: number) : string{
			return `


=================== Item ${index} ======================

${content}

=================================================


`}

		public messages: string[] = [];

		public clear() {
			this.messages = [];
		}

		public appendLine(stringToAppend?: string) {
			this.append((stringToAppend || "") + '\n');
		}

		public append(stringToAppend?: string){
			this.messages.push((stringToAppend || ""));
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
                result += `${this.friendlyJsonStringify(item, indent + 1)}`;
            });
            return result;
        }

        for (const [key, value] of Object.entries(obj)) {
            // Convert key to sentence case
            const sentenceCaseKey = this.toSentenceCase(key);
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

		private toSentenceCase(str: string = ""): string {
			return str
				.replace(/[_-]/g, " ") // Replace underscores or hyphens with spaces
				.replace(/([a-z])([A-Z])/g, "$1 $2") // Add space before uppercase letters in camelCase/PascalCase
				.trim() // Remove leading/trailing spaces
				.replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
		}
}
