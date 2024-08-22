import {
  CharCode,
  isDecimalDigit,
  isHexDigit,
  isNewLine,
  isWhiteSpace,
} from "./charCodes";
import type { Document } from "./document";
import { Token } from "./token";
import { TokenKind } from "./tokenKind";
import { KEYWORDS, OPERATORS_AND_PUNCTUATORS, RESERVED_WORDS } from "./tokenStringMap";

export class Lexer {
  private pos = 0;
  private length: number;

  constructor(private doc: Document) {
    this.length = doc.text.length;
  }

  public getTokens(): Token[] {
    let token: Token;
    let result = [];

    do {
      token = this.scanNextToken();
      result.push(token);
    } while (token.kind !== TokenKind.EndOfFile);

    return result;
  }

  private scanNextToken(): Token {
    let fullStart = this.pos;

    while (true) {
      let start = this.pos;
      if (this.pos >= this.length) {
        return new Token(TokenKind.EndOfFile, fullStart, start, this.pos);
      }
      let singleQuoteString = true;

      switch (this.doc.charCodeAt(this.pos)) {
        case CharCode.Tab:
        case CharCode.LineFeed:
        case CharCode.CarriageReturn:
        case CharCode.Space: {
          this.pos++;
          continue;
        }

        case CharCode.Dot: {
          if (
            this.pos + 1 < this.length &&
            isDecimalDigit(this.doc.charCodeAt(this.pos + 1))
          ) {
            let kind = this.scanNumericLiteral();
            return new Token(kind, fullStart, start, this.pos);
          } else {
            this.pos++;
            return new Token(TokenKind.DotToken, fullStart, start, this.pos);
          }
        }
        // fall through

        // Potential 3-character tokens
        case CharCode.LessThan: // <<<, <<, <=, <
        case CharCode.GreaterThan: // >>>, >>, >=, >
        case CharCode.Asterisk: // **=, **, *=, *

        // Potential 2-character tokens
        case CharCode.Equals: // ==, =
        case CharCode.Plus: // +, ++, +=
        case CharCode.Minus: // -, --, -=
        case CharCode.Percent: // %, %=
        case CharCode.Caret: // ^, ^=
        case CharCode.Bar: // |, ||, |=
        case CharCode.Exclamation: // !=, !
        case CharCode.Ampersand: // &&, &

        // Non-compound tokens
        case CharCode.Colon:
        case CharCode.Comma:
        case CharCode.OpenParen:
        case CharCode.CloseParen:
        case CharCode.OpenBracket:
        case CharCode.CloseBracket:
        case CharCode.OpenBrace:
        case CharCode.CloseBrace:
        case CharCode.Semicolon:
        case CharCode.Tilde: {
          for (let end = 4; end >= 0; end--) {
            if (this.pos + end > this.length) {
              continue;
            }

            let text = this.doc.text.substring(this.pos, this.pos + end + 1);
            let kind = OPERATORS_AND_PUNCTUATORS.get(text);
            if (kind !== undefined) {
              this.pos += end + 1;
              return new Token(
                kind,
                fullStart,
                start,
                this.pos
              );
            }
          }

          throw new Error(`Unexpected character: ${this.doc.text[this.pos]}`);
        }

        case CharCode.Slash: {
          if (this.isSingleLineComment()) {
            this.scanSingleLineComment();
            continue;
          } else if (this.isMultiLineComment()) {
            this.scanMultiLineComment();
            continue;
          } else if (this.charCodeAtIs(1, CharCode.Equals)) {
            this.pos += 2;
            return new Token(TokenKind.SlashEqualsToken, fullStart, start, this.pos);
          }
          this.pos++;
          return new Token(TokenKind.SlashToken, fullStart, start, this.pos);
        }

        case CharCode.DoubleQuote:
          singleQuoteString = false;
        case CharCode.SingleQuote: {
          this.pos++;
          if (this.scanStringLiteral(singleQuoteString)) {
            return new Token(TokenKind.StringLiteralToken, fullStart, start, this.pos);
          }
          return new Token(TokenKind.UnterminatedStringLiteralToken, fullStart, start, this.pos);
        }

        default: {
          if (this.isIdentifierStart()) {
            this.scanIdentifier();
            let token = new Token(TokenKind.Identifier, fullStart, start, this.pos);
            let tokenText = token.getText(this.doc);
            if (this.isKeywordOrReservedWordStart(tokenText)) {
              token.kind = KEYWORDS.get(tokenText) || RESERVED_WORDS.get(tokenText)!!;
            }
            return token;
          } else if (isDecimalDigit(this.doc.charCodeAt(this.pos))) {
            let kind = this.scanNumericLiteral();
            return new Token(kind, fullStart, start, this.pos);
          }
          this.pos++;
          return new Token(TokenKind.Unknown, fullStart, start, this.pos);
        }
      }
    }
  }

  private isIdentifierStart(): boolean {
    let charCode = this.doc.charCodeAt(this.pos);
    return (
      (charCode >= CharCode.A && charCode <= CharCode.Z) ||
      (charCode >= CharCode.a && charCode <= CharCode.z) ||
      charCode === CharCode.Underscore
    );
  }

  private scanIdentifier(): void {
    while (this.isIdentifierPart()) {
      this.pos++;
    }
  }

  private isIdentifierPart(): boolean {
    let charCode = this.doc.charCodeAt(this.pos);
    return (
      (charCode >= CharCode.A && charCode <= CharCode.Z) ||
      (charCode >= CharCode.a && charCode <= CharCode.z) ||
      (charCode >= CharCode._0 && charCode <= CharCode._9) ||
      charCode === CharCode.Underscore
    );
  }

  private isKeywordOrReservedWordStart(text: string): boolean {
    return KEYWORDS.has(text) || RESERVED_WORDS.has(text);
  }

  private isSingleLineComment(): boolean {
    return (
      this.pos + 1 < this.length &&
      this.charCodeAtIs(0, CharCode.Slash) &&
      this.charCodeAtIs(1, CharCode.Slash)
    );
  }

  private scanSingleLineComment() {
    while (
      this.pos < this.length &&
      !isNewLine(this.doc.charCodeAt(this.pos))
    ) {
      this.pos++;
    }
  }

  private isMultiLineComment(): boolean {
    return (
      this.pos + 1 < this.length &&
      this.charCodeAtIs(0, CharCode.Slash) &&
      this.charCodeAtIs(1, CharCode.Asterisk)
    );
  }

  private scanMultiLineComment() {
    while (
      this.pos < this.length &&
      !(
        this.charCodeAtIs(0, CharCode.Asterisk) &&
        this.charCodeAtIs(1, CharCode.Slash)
      )
    ) {
      this.pos++;
    }
    this.pos += 2;
  }

  private scanNumericLiteral(): TokenKind {
    if (this.isHexLiteralStart()) {
      // hex
      this.pos += 2;
      let prev = this.pos;
      let valid = this.scanHexLiteral();
      return prev === this.pos || !valid
        ? TokenKind.InvalidHexadecimalLiteralToken
        : TokenKind.HexadecimalLiteralToken;
    } else if (this.isBinaryLiteralStart()) {
      // binary
      this.pos += 2;
      let prev = this.pos;
      let valid = this.scanBinaryLiteral();
      return prev === this.pos || !valid
        ? TokenKind.InvalidBinaryLiteralToken
        : TokenKind.BinaryLiteralToken;
    } else if (isDecimalDigit(this.doc.charCodeAt(this.pos))) {
      // decimal
      let prev = this.pos;
      let isValidFloatLiteral = this.scanFloatingPointLiteral();

      if (isValidFloatLiteral) {
        return TokenKind.FloatLiteralToken;
      }

      this.pos = prev;

      this.scanDecimalLiteral();
      return TokenKind.DecimalLiteralToken;
    }

    return TokenKind.Unknown;
  }

  private isHexLiteralStart(): boolean {
    return (
      this.charCodeAtIs(0, CharCode._0) &&
      (this.charCodeAtIs(1, CharCode.x) || this.charCodeAtIs(1, CharCode.X))
    );
  }

  private scanHexLiteral(): boolean {
    let vaild = true;
    while (this.pos < this.length) {
      let charCode = this.doc.charCodeAt(this.pos);
      if (isWhiteSpace(charCode)) {
        break;
      }
      if (!(isHexDigit(charCode) || charCode === CharCode.Underscore)) {
        vaild = false;
      }
      this.pos++;
    }
    return vaild;
  }

  private isBinaryLiteralStart(): boolean {
    return (
      this.charCodeAtIs(0, CharCode._0) &&
      (this.charCodeAtIs(1, CharCode.b) || this.charCodeAtIs(1, CharCode.B))
    );
  }

  private scanBinaryLiteral(): boolean {
    let valid = true;
    while (this.pos < this.length) {
      let charCode = this.doc.charCodeAt(this.pos);
      if (isWhiteSpace(charCode)) {
        break;
      }
      if (!(charCode === CharCode._0 || charCode === CharCode._1 || charCode === CharCode.Underscore)) {
        valid = false;
      }
      this.pos++;
    }
    return valid;
  }

  private scanDecimalLiteral(): void {
    while (this.pos < this.length) {
      let charCode = this.doc.charCodeAt(this.pos);
      if (isWhiteSpace(charCode)) {
        break;
      }
      if (!(isDecimalDigit(charCode) || charCode === CharCode.Underscore)) {
        break;
      }
      this.pos++;
    }
  }

  private scanFloatingPointLiteral(): boolean {
    let hasDot = false;
    let expStart = -1;
    let hasSign = false;
    while (this.pos < this.length) {
      let char = this.doc.charCodeAt(this.pos);

      if (isDecimalDigit(char)) {
        this.pos++;
        continue;
      } else if (char === CharCode.Dot) {
        if (hasDot || expStart !== -1) {
          // Dot not valid, done scanning
          break;
        }
        hasDot = true;
        this.pos++;
        continue;
      } else if (char === CharCode.E || char === CharCode.e) {
        if (expStart !== -1) {
          // exponential not valid here, done scanning
          break;
        }
        expStart = this.pos;
        this.pos++;
        continue;
      } else if (char === CharCode.Plus || char === CharCode.Minus) {
        if (expStart !== -1 && expStart === this.pos - 1) {
          hasSign = true;
          this.pos++;
          continue;
        }
        // sign not valid here, done scanning
        break;
      }
      // unexpected character, done scanning
      break;
    }

    if (expStart !== -1) {
      let expectedMinPos = expStart + (hasSign ? 3 : 2);
      if (this.pos >= expectedMinPos) {
        return true;
      }
      // exponential is invalid, reset position
      this.pos = expStart;
    }

    return hasDot;
  }

  private scanStringLiteral(singleQuote: boolean): boolean {
    let isTerminated = false;
    let terminator = singleQuote ? CharCode.SingleQuote : CharCode.DoubleQuote;
    while (this.pos < this.length) {
      if (this.isEscapeSequence(singleQuote)) {
        this.pos += 2;
        continue;
      } else if (this.charCodeAtIs(0, terminator)) {
        this.pos++;
        isTerminated = true;
        break;
      } else {
        this.pos++;
        continue;
      }
    }

    return isTerminated;
  }

  private isEscapeSequence(singleQuote: boolean): boolean {
    return (
      this.charCodeAtIs(0, CharCode.Backslash) &&
      (this.charCodeAtIs(1, singleQuote ? CharCode.SingleQuote : CharCode.DoubleQuote) ||
        this.charCodeAtIs(1, CharCode.Backslash))
    );
  }

  private charCodeAtIs(index: number, ch: number): boolean {
    return this.doc.charCodeAt(this.pos + index) === ch;
  }
}
