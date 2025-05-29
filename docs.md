# SPA での GA4 および GTM セットアップとカスタムディメンション計測ガイド

このドキュメントでは、アプリケーションにGA4とGTMをセットアップし、カスタムディメンションを使用してユーザー行動を詳細に計測する方法をまとめています。

## 目次

1. [GA4 と GTM の基本セットアップ](#ga4とgtmの基本セットアップ)
2. [SPA での GA4 の動作](#spaでのga4の動作)
3. [イベントトラッキングの実装](#イベントトラッキングの実装)
4. [カスタムディメンションの設定と実装](#カスタムディメンションの設定と実装)
5. [デバッグと検証](#デバッグと検証)
6. [参考リソース](#参考リソース)

## GA4 と GTM の基本セットアップ

### GA4 アカウント設定

1. GA4 アカウントとプロパティを作成する

   - GA の管理画面を開く
   - 左側のメニューから「管理」を選択
   - アカウントを作成していない場合は新規アカウントを作成
   - プロパティの作成を行う

2. データストリームを作成し、測定 ID を取得する（G-XXXXXXXX の形式）
   - 左側のメニューから「管理」>「データストリーム」を選択
   - 「ストリームを作成」をクリック
   - プラットフォームとして「ウェブ」を選択
   - ウェブサイトの URL とサイト名を入力
   - 「ストリームを作成」をクリック

### GTM アカウント設定

1. GTM アカウントとコンテナを作成する

   - GTM 公式サイト（https://tagmanager.google.com/）にアクセス
   - 「アカウントを作成」をクリック
   - アカウント名、コンテナ名を入力
   - ターゲットプラットフォームとして「Web」を選択
   - 「作成」をクリックし、利用規約に同意

2. HTML に以下の GTM コードを挿入する（head 内と body 開始直後）

```html
<!-- Google Tag Manager -->
<script>
  (function (w, d, s, l, i) {
    w[l] = w[l] || [];
    w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
    var f = d.getElementsByTagName(s)[0],
      j = d.createElement(s),
      dl = l != "dataLayer" ? "&l=" + l : "";
    j.async = true;
    j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
    f.parentNode.insertBefore(j, f);
  })(window, document, "script", "dataLayer", "GTM-XXXXXXXX");
</script>
<!-- End Google Tag Manager -->

<!-- HTML body開始直後に配置 -->
<noscript>
  <iframe
    src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXXX"
    height="0"
    width="0"
    style="display:none;visibility:hidden"
  >
  </iframe>
</noscript>
```

3. GTM で GA4 設定タグを作成
   - タグタイプ: Google アナリティクス: GA4 設定
   - 測定 ID: 先ほど取得した GA4 の測定 ID（G-XXXXXXXX）を入力
   - トリガー: All Pages を選択して保存

## SPA での GA4 の動作

### 自動ページビュー計測

#### GA4 の自動計測の仕組み

GA4 は以下のような方法で SPA のページ変更を検出します：

1. History API（pushState、replaceState）の使用を監視
2. URL やページタイトルの変更を検知
3. 自動的にページビューイベント（page_view）を送信

これは GTM を経由している場合も同様で、追加の設定なしで基本的なページビュー計測が可能です。

#### 自動計測の確認方法

自動計測が正しく機能しているかは、以下の方法で確認できます：

1. GA4 のリアルタイムレポートを開く
2. SPA アプリケーションでページ間を移動する
3. リアルタイムレポートでページビューが記録されていることを確認

> **注意**: 特殊なルーティング実装やカスタムのクライアントサイドルーターを使用している場合は、自動計測が機能しないことがあります。その場合は、カスタム実装が必要になることがあります。

## イベントトラッキングの実装

### dataLayer の基本的な使い方

GTM では dataLayer という JavaScript オブジェクトを通じてデータをやり取りします。このオブジェクトは、ウェブページから GTM にデータを渡すためのコンテナとして機能します。

#### dataLayer の初期化とデータ送信

アプリケーションの起動時に dataLayer を初期化し、基本データを送信します。

```javascript
// グローバルなdataLayerの初期化（main.js、App.jsなどのエントリーポイント）
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  // アプリケーション共通の情報
  userStatus: "anonymous",
  // 他のグローバルな値など...
});
```

### ユーザーアクション計測

```javascript
// ボタンクリックやフォーム送信など、計測したいアクションの発生時に実行
function sendEvent(eventName, eventParams) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    ...eventParams,
  });
}

// 使用例
sendEvent("button_click", {
  buttonName: "signup",
  buttonLocation: "header",
});

sendEvent("form_submit", {
  formType: "contact",
  formStepCompleted: "personal_info",
});
```

## カスタムディメンションの設定と実装

カスタムディメンションは、GA でデフォルトで収集されない独自の指標を計測するための機能です。ユーザーの属性や行動に関する追加情報を収集・分析するのに役立ちます。

### GA4 でのカスタムディメンション設定

1. GA4 管理画面で「カスタム定義」>「カスタムディメンション」を選択

   - 左側のメニューから「管理」>「データの表示」>「カスタム定義」>「カスタムディメンション」を選択
   - 「カスタムディメンションを作成」をクリック

2. 以下の情報を入力して設定:
   - ディメンション名：わかりやすい名前（例：「ユーザータイプ」、「流入元」など）
   - 範囲：このディメンションの適用レベルを選択
     - イベント：特定のイベントに関連する値
     - ユーザー：ユーザー全体に関連する値
   - イベントパラメータ / ユーザープロパティ：dataLayer から送信される変数名（例：userType）
   - 説明：ディメンションの目的や内容を説明（例：ユーザーの種類（新規/既存/ゲスト等）を保存）
   - 「保存」をクリック

### GTM でのデータレイヤー変数設定

1. GTM の管理画面を開く
2. 左側のメニューから「変数」を選択
3. 「新規作成」をクリック（ユーザー定義変数セクション）
4. 変数タイプとして「データレイヤー変数」を選択
5. 以下の設定を行う:
   - 変数名: dl_userType, dl_userId など
   - データレイヤー変数名: userType, userId など（dataLayer で使用する変数名）
6. 「保存」をクリック

### データレイヤーへの送信

```javascript
// ユーザー情報を取得したタイミング（ログイン後など）で実行
function setUserProperties(userId, userType, userPlan) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "set_user_properties",
    userId: userId, // ユーザーID（認証済みユーザーの場合）
    userType: userType, // ユーザータイプ（新規/既存/プレミアム等）
    userPlan: userPlan, // 契約プラン（無料/有料/トライアル等）
  });
}
```

### GTM での設定

1. データレイヤー変数の作成

   - 変数名: dl_userId, dl_userType, dl_userPlan
   - データレイヤー変数名: userId, userType, userPlan

2. トリガーの作成

   - イベント名: set_user_properties

3. GA4 ユーザープロパティタグの作成
   - タグタイプ: Google アナリティクス: GA4 構成
   - ユーザープロパティの設定:
     - user_id: {{dl_userId}}
     - user_type: {{dl_userType}}
     - user_plan: {{dl_userPlan}}
   - トリガー: set_user_properties

### イベント発生時のカスタムディメンション送信

```javascript
// イベント発生時にカスタムディメンションも一緒に送信する例
function trackProductView(productId, productName, productCategory) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "view_item",
    ecommerce: {
      items: [
        {
          item_id: productId,
          item_name: productName,
          item_category: productCategory,
        },
      ],
    },
    productBrand: "Example Brand", // カスタムディメンション
    productCollection: "Summer 2025", // カスタムディメンション
  });
}

// 使用例
trackProductView("prod123", "Premium Widget", "Electronics");
```

## デバッグと検証

### GTM プレビューモードでのテスト

1. GTM 管理画面の「プレビュー」ボタンをクリック
2. サイト URL を入力して接続
3. イベントが正しく発火しているか確認
4. 変数の値が正しく設定されているか確認

### GA4 DebugView での確認

1. GA4 管理画面の「デバッグビュー」を開く
2. GTM プレビューモードを有効にした状態でサイト操作
3. リアルタイムでのイベントとパラメータを確認

### カスタムディメンション値の確認

実装したカスタムディメンションが正しく計測できているか確認する方法:

1. GA4 のレポート画面で「絞り込み条件」を選択
2. 「カスタム」>「設定したカスタムディメンション名」を選択
3. データが正しく収集されているか確認

- Chrome 拡張機能の「Tag Assistant」などのデバッグツールを活用

## 実装例（サンプルコード）

```javascript
// グローバルなdataLayerの初期化（アプリケーション起動時）
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  appVersion: "1.0.0",
  appEnvironment: "production",
});

// ユーザーログイン/認証完了時の処理
function onUserAuthenticated(user) {
  // ユーザー属性の設定
  window.dataLayer.push({
    event: "set_user_properties",
    userId: user.id,
    userType: user.type,
    userPlan: user.subscription,
    userRegistrationDate: user.registeredAt,
  });

  // ログインイベントの送信（カスタムディメンション付き）
  window.dataLayer.push({
    event: "login",
    loginMethod: user.authMethod, // カスタムディメンション
    userType: user.type, // カスタムディメンション
  });
}

// 検索機能使用時のイベント
function onSearch(searchTerm, resultsCount, categoryFilter) {
  window.dataLayer.push({
    event: "search",
    searchTerm: searchTerm,
    searchResultsCount: resultsCount,
    searchCategory: categoryFilter, // カスタムディメンション
  });
}
```

## 参考リソース

- [Google Analytics 公式ドキュメント](https://support.google.com/analytics/)
- [Google Tag Manager 公式ドキュメント](https://support.google.com/tagmanager/)
- [GA4 カスタムディメンション活用ガイド](https://developers.google.com/analytics/devguides/collection/ga4/user-properties?hl=ja)
