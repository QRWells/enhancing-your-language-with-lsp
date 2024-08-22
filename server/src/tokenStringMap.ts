import { TokenKind } from "./tokenKind";

export const KEYWORDS = new Map<string, TokenKind>([
    ["struct", TokenKind.StructKeyword],
    ["func", TokenKind.FuncKeyword],
    ["let", TokenKind.LetKeyword],
    ["if", TokenKind.IfKeyword],
    ["else", TokenKind.ElseKeyword],
    ["return", TokenKind.ReturnKeyword],
    ["while", TokenKind.WhileKeyword],
]);

export const RESERVED_WORDS = new Map<string, TokenKind>([
    ["int", TokenKind.IntReservedWord],
    ["float", TokenKind.FloatReservedWord],
    ["bool", TokenKind.BoolReservedWord],
    ["string", TokenKind.StringReservedWord],
    ["unit", TokenKind.UnitReservedWord],
    ["never", TokenKind.NeverReservedWord],
    ["true", TokenKind.TrueReservedWord],
    ["false", TokenKind.FalseReservedWord],
]);

export const OPERATORS_AND_PUNCTUATORS = new Map<string, TokenKind>([
    ["(", TokenKind.OpenParenToken,],
    [")", TokenKind.CloseParenToken,],
    ["[", TokenKind.OpenBracketToken,],
    ["]", TokenKind.CloseBracketToken,],
    ["{", TokenKind.OpenBraceToken,],
    ["}", TokenKind.CloseBraceToken,],

    [",", TokenKind.CommaToken,],
    [":", TokenKind.ColonToken,],
    [";", TokenKind.SemicolonToken,],
    [".", TokenKind.DotToken,],

    ["+", TokenKind.PlusToken,],
    ["++", TokenKind.PlusPlusToken,],
    ["+=", TokenKind.PlusEqualsToken,],
    ["-", TokenKind.MinusToken,],
    ["--", TokenKind.MinusMinusToken,],
    ["-=", TokenKind.MinusEqualsToken,],
    ["*", TokenKind.AsteriskToken,],
    ["**", TokenKind.AsteriskAsteriskToken,],
    ["*=", TokenKind.AsteriskEqualsToken,],
    ["/", TokenKind.SlashToken,],
    ["/=", TokenKind.SlashEqualsToken,],
    ["%", TokenKind.PercentToken,],
    ["%=", TokenKind.PercentEqualsToken,],
    ["=", TokenKind.EqualsToken,],
    ["==", TokenKind.EqualsEqualsToken,],
    ["!", TokenKind.ExclamationToken,],
    ["!=", TokenKind.ExclamationEqualsToken,],
    ["<", TokenKind.LessThanToken,],
    ["<=", TokenKind.LessEqualsToken,],
    [">", TokenKind.GreaterThanToken,],
    [">=", TokenKind.GreaterEqualsToken,],

    ["&&", TokenKind.LogicalAndToken,],
    ["||", TokenKind.LogicalOrToken,],

    ["&", TokenKind.BitwiseAndToken,],
    ["&=", TokenKind.BitwiseAndEqualsToken,],
    ["|", TokenKind.BitwiseOrToken,],
    ["|=", TokenKind.BitwiseOrEqualsToken,],
    ["^", TokenKind.BitwiseXorToken,],
    ["^=", TokenKind.BitwiseXorEqualsToken,],
    ["~", TokenKind.BitwiseNotToken,],

    ["<<", TokenKind.LeftArithmeticShiftToken,],
    ["<<=", TokenKind.LeftArithmeticShiftEqualsToken,],
    [">>", TokenKind.RightArithmeticShiftToken,],
    [">>=", TokenKind.RightArithmeticShiftEqualsToken,],
    ["<<<", TokenKind.LeftLogicalShiftToken,],
    [">>>", TokenKind.RightLogicalShiftToken,],
]);
