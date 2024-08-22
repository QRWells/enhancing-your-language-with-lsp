export enum TokenKind {
  Unknown,
  EndOfFile,

  Identifier,
  StringLiteralToken,
  UnterminatedStringLiteralToken,
  DecimalLiteralToken,
  InvalidDecimalLiteralToken,
  HexadecimalLiteralToken,
  InvalidHexadecimalLiteralToken,
  BinaryLiteralToken,
  InvalidBinaryLiteralToken,
  FloatLiteralToken,
  BooleanLiteralToken,

  StructKeyword,
  FuncKeyword,
  LetKeyword,
  IfKeyword,
  ElseKeyword,
  ReturnKeyword,
  WhileKeyword,

  IntReservedWord,
  FloatReservedWord,
  BoolReservedWord,
  StringReservedWord,
  UnitReservedWord,
  NeverReservedWord,

  TrueReservedWord,
  FalseReservedWord,

  OpenParenToken, // (
  CloseParenToken, // )
  OpenBracketToken, // [
  CloseBracketToken, // ]
  OpenBraceToken, // {
  CloseBraceToken, // }

  CommaToken, // ,
  ColonToken, // :
  SemicolonToken, // ;
  DotToken, // .

  PlusToken, // +
  PlusPlusToken, // ++
  PlusEqualsToken, // +=
  MinusToken, // -
  MinusMinusToken, // --
  MinusEqualsToken, // -=
  AsteriskToken, // *
  AsteriskAsteriskToken, // **
  AsteriskEqualsToken, // *=
  SlashToken, // /
  SlashEqualsToken, // /=
  PercentToken, // %
  PercentEqualsToken, // %=
  EqualsToken, // =
  EqualsEqualsToken, // ==
  ExclamationToken, // !
  ExclamationEqualsToken, // !=
  LessThanToken, // <
  LessEqualsToken, // <=
  GreaterThanToken, // >
  GreaterEqualsToken, // >=

  LogicalAndToken, // &&
  LogicalOrToken, // ||

  BitwiseAndToken, // &
  BitwiseAndEqualsToken, // &=
  BitwiseOrToken, // |
  BitwiseOrEqualsToken, // |=
  BitwiseXorToken, // ^
  BitwiseXorEqualsToken, // ^=
  BitwiseNotToken, // ~

  LeftArithmeticShiftToken, // <<
  LeftArithmeticShiftEqualsToken, // <<=
  RightArithmeticShiftToken, // >>
  RightArithmeticShiftEqualsToken, // >>=
  LeftLogicalShiftToken, // <<<
  RightLogicalShiftToken, // >>>

  CommentToken,
}
