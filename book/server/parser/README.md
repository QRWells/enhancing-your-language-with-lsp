# Error-tolreant Parser

Language server には、Error-tolerant Parser が必要です。
Error-tolerant Parser は、エラーを検出してもパースを続行することで、
すべてのエラーを報告することができて、エラーの位置情報を正確に取得できます。

## Error-tolerant Parser を実装するには

パーサーが生成する構文木は、2 つの重要な属性を保証します：

1. すべてのソース情報が完全に忠実に保持されます。つまり、木にはソースに含まれるすべての情報、すべての文法構文、すべての字句トークン、そして空白やコメントを含むその他すべての情報が含まれています。また、プログラムが不完全または不正である場合に、構文木内のトークンのスキップや欠落を表現することで、ソースコードのエラーを表します。
2. パーサーから得られた構文木は、パースされたテキストに完全に対応することができます。どの構文ノードからでも、そのノードをルートとする部分木のテキスト表現を得ることができます。つまり、構文木はソースを構築・編集する方法として使用できます。

生成された構文木は文字通り木データ構造で、非終端構造要素が他の要素を親にします。各文法技術はノード（非終端要素）とトークン（終端要素）で構成されます。

さらに、各ノードとトークンには、位置情報、エラー、コメント＋空白のトリビアが関連付けられています。

すべての木は、不変量のセットを保証します。つまり、どのような入力であっても常に真を保つ木の特性です。
この不変量のセットは、木が "構造的に健全 "であることを保証し、理解を深めていく際に木について自信を持って推論することを容易にし、一貫した基盤を提供します。
例えば、元のテキスト（空白やコメントを含む）は常にノードから再現可能でなければなりません。完全なリストは「不変性」を参照してください。

### ノード

ノードは構文木の主要な構成要素です。ノードは、宣言、式、ステートメント、式などの構文を表します。各種類のノードは、`Node`から派生したクラスで表されます。

## トークン

構文トークンは言語文法の終端記号で、コードの最小構文フラグメントを表す。他のノードやトークンの親になることはありません。
構文トークンは、キーワード、識別子、リテラル、および句読点で構成されます。

効率のため、構文ノードとは異なり、`Token`クラスは一つしかありません。トークンの種類によって意味を持つプロパティが混在する可能性があります。

### 空白とコメント

空白とコメントトリビアは通常の言語構文の一部ではなく、2 つのトークンの間のどこにでも出現するため、構文木には子ノードとして含まれません。
しかし、これらはリファクタリングのような機能を実装するときや、ソースとの完全な忠実性を維持するために重要であるため、構文木の一部として存在します。

トークンの`LeadingWhitespaceAndComments`を検査することで、トリビアにアクセスできます。ソースが解析されると、トリビアのシーケンスがトークンに関連付けられます。

### 位置情報

各ノード、トークン、またはトリビアは、ソース内での位置と、それが構成する文字数を持っています。
テキストの位置は 32 ビットの整数で表され、これは文字列へのゼロベースのバイトインデックスであります。幅は文字数に対応し、整数で表されます。長さゼロは 2 文字の間の位置を指します。

効率化のため、位置はテキスト内の絶対位置を指し、行／列情報が必要な場合はヘルパー関数が利用できます。

### エラー処理

ソースに構文エラーがあっても、ソースに対して対応できる完全な構文木が生成されます。
パーサーは、定義された構文に準拠していないコードに遭遇しますと、2 つのテクニックのいずれかを使用して構文木を作成します。

1. パーサーが特定の種類のトークンを予期していたにもかかわらず、それが見つからなかった場合、そのトークンが予期されていた場所に`MissingToken`を構文木に挿入することがあります。`MissingToken`は、期待された実際のトークンを表すが、`Span`は空です。
2. パーサーは構文解析を続行できるトークンが見つかるまで、トークンをスキップすることがあります。この場合、スキップされたトークンは、構文木内の`SkippedToken`として付加されます。

パーサーは寛容な方法で構文木を生成し、すべての不正確な構文（例えば、メソッドパラメータのデフォルト値として非定数式を含む）に対してエラーを生成するわけではないことに注意してください。
その代わりに、パース後の構文木の walk でこれらのエラーをつけます。