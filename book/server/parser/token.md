# Token

```ts
export class Token {
  public kind: TokenKind;
  public fullStart: number;
  public start: number;
  public end: number;

  constructor(kind: TokenKind, fullStart: number, start: number, end: number) {
    this.kind = kind;
    this.fullStart = fullStart;
    this.start = start;
    this.end = end;
  }

  public getLeadingCommentsAndWhitespaceText(document: string): string {
    return document.slice(this.fullStart, this.start);
  }

  public getText(document: string | null): string | null {
    if (document === null) {
      return null;
    }
    return document.slice(this.start, this.end);
  }

  public getFullText(document: string): string {
    return document.slice(this.fullStart, this.end);
  }

  public getWidth(): number {
    return this.end - this.start;
  }

  public getFullWidth(): number {
    return this.end - this.fullStart;
  }
}
```