# シンタックス定義

### 構造体の定義

構造体は以下のように定義します。

```c++
struct Point {
    x: int;
    y: int;
}
```

## 変数の定義

変数の定義は以下のように行います。
型は自動で推論されるので、省略することができます。
再定義はできません。

```ts
let x: string = "hello" + 1;
let y = 2.0;
```

## 式

### リテラル

- int: `1`, `2`, `3`
- float: `1.0`, `2.0`, `3.0`
- string: `"hello"`, `"world"`
- bool: `true`, `false`

### 二項演算子

- `+`, `-`, `*`, `/`, `%`
- `==`, `!=`, `<`, `>`, `<=`, `>=`

## 制御構文

### if

```ts
if (a == b) {
  print("a is equal to b");
} else {
  print("a is not equal to b");
}
```

### while

```ts
while (a < 10) {
  a = a + 1;
}
```

## 関数

```cpp
func add(a: int, b: int): int {
    return a + b;
}
```
