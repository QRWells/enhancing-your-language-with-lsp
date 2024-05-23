# トークン

## トークンの種類

まず、必要なトークンの種類を明確にしなければなりません。
シンタックス定義から、トークンは大体以下の分類になります。

- キーワード (`let` など)
- 識別子
- リテラル (`"Hello"`、`1.5` など)
- 演算子 (`+`、`!=` など)
- 区切り文字 (`;`、`,` など)
- コメント

## トークンの定義

LSP では、ハイライトや補完などの機能を提供するために、トークンの位置情報を提供する必要があります。
そのため、トークンは以下の情報を持つ必要があります。

- トークンの種類
- トークンの開始位置
- トークンの終了位置

そして、トークン列からソースを再構築するために、トークン前後の空白やコメントも保持する必要があります。
ここでは、前方だけを考慮して、トークンの前方の空白やコメントを取得するメソッドを提供します。

```ts
class Token {
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
