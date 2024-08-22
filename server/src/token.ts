import type { Document } from "./document";
import { TokenKind } from "./tokenKind";

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

  /**
   * Get the leading comments and whitespace text before the token.
   * @param document The document text.
   * @returns The leading comments and whitespace text.
   */
  public getLeadingCommentsAndWhitespaceText(document: Document): string {
    return document.slice(this.fullStart, this.start);
  }

  /**
   * Get the text of the token.
   * @param document The document text.
   * @returns The text of the token.
   */
  public getText(document: Document): string {
    return document.slice(this.start, this.end);
  }

  public getFullText(document: Document): string {
    return document.slice(this.fullStart, this.end);
  }

  public getWidth(): number {
    return this.end - this.start;
  }

  public getFullWidth(): number {
    return this.end - this.fullStart;
  }

  public getDisplayFullText(doc: Document): string {
    return this.getFullText(doc).replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t").replace(" ", "⌴");
  }
}

export function printTokens(tokens: Iterable<Token>, doc: Document): string {
  let results: {
    kind: string;
    fullText: string;
    text: string;
    fullStart: number;
    start: number;
    end: number;
  }[] = [];
  for (let token of tokens) {
    results.push({ kind: TokenKind[token.kind], fullText: token.getDisplayFullText(doc), text: token.getText(doc), fullStart: token.fullStart, start: token.start, end: token.end });
  }
  let maxLengths = results.reduce((acc, val) => {
    return {
      kind: Math.max(acc.kind, val.kind.toString().length),
      fullText: Math.max(acc.fullText, val.fullText.length),
      text: Math.max(acc.text, val.text.length),
      fullStart: Math.max(acc.fullStart, val.fullStart.toString().length),
      start: Math.max(acc.start, val.start.toString().length),
      end: Math.max(acc.end, val.end.toString().length),
    };
  }, { kind: 4, fullText: 8, text: 4, fullStart: 9, start: 5, end: 3 });

  let topRule = `┌─${"─".repeat(maxLengths.kind)}─┬─${"─".repeat(maxLengths.fullText)}─┬─${"─".repeat(maxLengths.text)}─┬─${"─".repeat(maxLengths.fullStart)}─┬─${"─".repeat(maxLengths.start)}─┬─${"─".repeat(maxLengths.end)}─┐`;
  let header = `│ ${"Kind".padEnd(maxLengths.kind)} │ ${"FullText".padEnd(maxLengths.fullText)} │ ${"Text".padEnd(maxLengths.text)} │ ${"FullStart".padEnd(maxLengths.fullStart)} │ ${"Start".padEnd(maxLengths.start)} │ ${"End".padEnd(maxLengths.end)} │`;
  let divider = `├─${"─".repeat(maxLengths.kind)}─┼─${"─".repeat(maxLengths.fullText)}─┼─${"─".repeat(maxLengths.text)}─┼─${"─".repeat(maxLengths.fullStart)}─┼─${"─".repeat(maxLengths.start)}─┼─${"─".repeat(maxLengths.end)}─┤`;
  let body = results.map(result => `│ ${result.kind.padEnd(maxLengths.kind)} │ ${result.fullText.padEnd(maxLengths.fullText)} │ ${result.text.padEnd(maxLengths.text)} │ ${result.fullStart.toString().padStart(maxLengths.fullStart)} │ ${result.start.toString().padStart(maxLengths.start)} │ ${result.end.toString().padStart(maxLengths.end)} │`).join("\n");
  let bottomRule = `└─${"─".repeat(maxLengths.kind)}─┴─${"─".repeat(maxLengths.fullText)}─┴─${"─".repeat(maxLengths.text)}─┴─${"─".repeat(maxLengths.fullStart)}─┴─${"─".repeat(maxLengths.start)}─┴─${"─".repeat(maxLengths.end)}─┘`;
  return `${topRule}\n${header}\n${divider}\n${body}\n${bottomRule}`;
}

export class SkippedToken extends Token {
  constructor(token: Token) {
    super(token.kind, token.fullStart, token.start, token.end);
  }
}

export class MissingToken extends Token {
  constructor(kind: TokenKind, fullStart: number) {
    super(kind, fullStart, fullStart, fullStart);
  }
}
