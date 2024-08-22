export class Document {
    public text: string;
    public lineStarts: number[];

    constructor(text: string) {
        this.text = text;
        this.lineStarts = this.computeLineStarts(text);
    }

    private computeLineStarts(text: string): number[] {
        const lineStarts: number[] = [0];
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            if (char === "\n") {
                lineStarts.push(i + 1);
            }
        }
        return lineStarts;
    }

    public charCodeAt(index: number): number {
        return this.text.charCodeAt(index);
    }

    public getLineAndCharacterOfPosition(position: number): { line: number, character: number } {
        let line = 0;
        while (line + 1 < this.lineStarts.length && this.lineStarts[line + 1] <= position) {
            line++;
        }
        return { line, character: position - this.lineStarts[line] };
    }

    public slice(start: number, end: number): string {
        return this.text.slice(start, end);
    }
}