// Machine-assisted translation — needs native-speaker review.
import type { Dictionary } from "../dictionary";

export const ja: Dictionary = {
  nav: {
    howItWorks: "使い方",
    feedback: "フィードバック",
    faq: "FAQ",
  },
  hero: {
    badge: "50+か国の2K+ユーザーが利用しています",
    titleLine1: "Google Mapsのルートを",
    titleLine2: "GPXファイルに変換",
    subtitle:
      "Google MapsのルートURLを、GPSデバイス用のGPXファイルに変換します — 車、自転車、徒歩に対応。",
    subtitleBold: "登録不要。メール不要。貼り付けるだけ。",
  },
  announcement: {
    badge: "修正済み",
    text:
      "Google Mapsでドラッグして変更したルートも、GPXにそのまま保持されるようになりました。「高速道路/有料道路/フェリーを避ける」設定も同様です。フィードバックをありがとうございました!",
  },
  trustBadges: {
    gpxStandard: "GPX 1.1 標準規格",
    exactRoute: "Google Mapsの正確なルート",
    allModes: "すべての移動手段に対応",
    noSignup: "登録不要",
  },
  features: {
    heading: "MapsToGPXが選ばれる理由",
    subheading:
      "Google MapsのルートをGPXファイルに変換するために必要なすべてが揃っています。",
    items: [
      {
        title: "アカウント登録不要",
        description:
          "他のツールとは違い、メールアドレスの入力やアカウント作成は不要です。URLを貼り付けるだけで、すぐにGPXをダウンロードできます。",
      },
      {
        title: "Google Mapsそのままの正確なルート",
        description:
          "ルートはGoogle Mapsの表示と完全に一致します — 車、自転車、徒歩。道路、経路、ターンもすべて同じです。",
      },
      {
        title: "すべての移動手段に対応",
        description:
          "車、自転車、徒歩、乗り換え案内のルートに対応。移動手段はURLから自動的に検出されます。",
      },
      {
        title: "幅広い互換性",
        description:
          "標準のGPX 1.1形式は、Garmin、Bryton、Wahoo、その他GPXに対応するすべてのデバイスで使用できます。",
      },
      {
        title: "多くのユーザーに利用されています",
        description:
          "全世界で2,000+人のユーザーに利用されています。登録不要、隠れたコストもなく、GPXファイルだけをお届けします。",
      },
      {
        title: "すべてのURL形式に対応",
        description:
          "長いURL、短縮リンク(goo.gl)、住所、座標、複数経由地のルートに対応しています。",
      },
    ],
  },
  howItWorks: {
    heading: "使い方",
    subheading: "Google MapsからGPXへ、3つの簡単なステップです。",
    steps: [
      {
        step: "1",
        title: "ルートを計画する",
        description:
          "Google Mapsでルート検索を行い、ブラウザのアドレスバーからURLをコピーします。",
      },
      {
        step: "2",
        title: "GPXに変換する",
        description:
          "上のボックスにURLを貼り付けて「変換」をクリックしてください。Google Mapsと完全に同じルートのGPXファイルを生成します。",
      },
      {
        step: "3",
        title: "出発しましょう!",
        description:
          "GPXファイルをダウンロードして、Garmin Connect、Bryton Active、Wahooアプリ、または対応するデバイスに取り込みます。",
      },
    ],
  },
  feedbackSection: {
    heading: "フィードバックをお寄せください",
    subheading: "不具合を見つけた、またはアイデアがありますか?ぜひお知らせください。",
  },
  donate: {
    heading: "MapsToGPXはいかがですか?コーヒーをご馳走してください!",
    description: "MapsToGPXは無料です。寄付はGoogle MapsAPIの費用に充てられます。",
  },
  donateLinks: { venmo: "Venmo", paypal: "PayPal" },
  footer: {
    builtBy: "作成者",
    faqLink: "FAQ",
    privacyLink: "プライバシーポリシー",
    tagline: "永久に無料。世界中のユーザーに利用されています。",
  },
  converterForm: {
    placeholder: "ここにGoogle MapsのルートURLを貼り付けてください...",
    convertButton: "GPXに変換",
    convertingButton: "変換中...",
    stepLabels: {
      idle: "",
      resolving: "短縮URLを解決中...",
      routing: "ルートを変換中です — 数秒かかる場合があります...",
      done: "完了しました!",
      error: "エラー",
    },
    invalidUrlError: "有効なGoogle MapsのURLを入力してください",
    networkError: "ネットワークエラーが発生しました。もう一度お試しください。",
    nonJsonError: "変換に失敗しました。もう一度お試しください。",
    conversionFailedFallback: "変換に失敗しました",
    successBanner: "ルートの変換が完了しました!",
    distanceLabel: "距離",
    waypointsLabel: "経由地点",
    downloadButton: "GPXをダウンロード",
    newButton: "新規",
  },
  feedbackForm: {
    ratingQuestion: "ご利用の感想はいかがですか?",
    optionalHint: "(任意)",
    ratingLabels: ["不満", "普通", "良い", "とても良い", "最高"],
    starAriaLabelOne: "{n}つ星",
    starAriaLabelMany: "{n}つ星",
    messageLabel: "改善できる点はありますか?",
    messageHint: "(不具合、変換できなかったルート、機能の提案など)",
    messagePlaceholder: "ご意見をお聞かせください...",
    emailLabel: "メールアドレス",
    emailHint: "(任意、返信が必要な場合のみ)",
    emailPlaceholder: "you@example.com",
    sendButton: "フィードバックを送信",
    sendingButton: "送信中...",
    sendMoreButton: "さらにフィードバックを送る",
    thanksHeading: "フィードバックをありがとうございました!",
    thanksSubtext: "いただいたメッセージはすべて確認し、MapsToGPXの改善に活用しています。",
    errorFallback: "フィードバックを送信できませんでした",
  },
  homeMeta: {
    title: "Google Mapsルート→GPX変換ツール",
    description:
      "Google MapsのルートURLをGPXファイルに変換します。車、自転車、徒歩のルートに対応。無料、登録不要です。",
  },
  faqMeta: {
    title: "よくある質問",
    description:
      "Google MapsのルートをGPXファイルに変換する際のよくある質問への回答です: 対応するURL形式、移動手段、GPXの内容、デバイスの互換性、制限、プライバシーについて説明します。",
  },
  faqPage: {
    heading: "よくある質問",
    introPrefix: "お探しの答えが見つかりませんか?",
    sendFeedbackLink: "フィードバックを送る",
    introSuffix: "。",
    privacyNotePrefix: "処理されるデータの詳細については、",
    privacyLinkText: "プライバシーポリシー",
    privacyNoteSuffix: "をご覧ください。",
    backButton: "← コンバーターに戻る",
    entries: [
      {
        question: "MapsToGPXが対応するGoogle MapsのURL形式は何ですか?",
        answer:
          "アドレスバーからコピーした長いルートURL、短縮リンク(goo.glおよびmaps.app.goo.gl — 自動的に展開されます)、住所や地名から作成されたURL、緯度・経度の座標を含むURL、複数の経由地を持つマルチストップルートに対応しています。",
      },
      {
        question: "移動手段(車、自転車、徒歩)はどのように判別されますか?",
        answer:
          "Google MapsがすでにURLに埋め込んだ移動手段を読み取ります — travelmodeパラメータ、またはMapsで車、自転車、徒歩、乗り換え案内を選択した際に埋め込まれるモードのいずれかです。どちらもない場合は、デフォルトで車になります。",
      },
      {
        question: "ダウンロードしたGPXファイルには何が含まれていますか?",
        answer:
          "Google Directionsが返す正確な経路をステップ単位で詳細にデコードした、トラックポイントで構成される単一のGPX 1.1トラックです(Googleの簡略化されたoverview lineではありません)。これはトラックであり、ルートやウェイポイントのリストではなく、高度データは含まれていません。",
      },
      {
        question: "どのデバイスやアプリでGPXファイルを使用できますか?",
        answer:
          "標準のGPX 1.1トラックをインポートできるアプリやGPSデバイスであれば利用可能です — Garmin、Wahoo、Bryton、Hammerhead Karoo、COROSのデバイスなどが含まれます。ダウンロードした.gpxファイルを、他のGPXトラックと同じようにインポートまたはコピーするだけです。",
      },
      {
        question: "MapsToGPXは無料ですか?アカウント作成は必要ですか?",
        answer:
          "はい、完全に無料で、アカウント・登録・ログインは一切不要です。URLを貼り付けてGPXファイルをダウンロードするだけです。",
      },
      {
        question: "マルチストップルートや、ドラッグで変更したルートにも対応していますか?",
        answer:
          "はい。URLに含まれる中間の経由地は順番どおりに通過します — 個別のウェイポイントマーカーとして追加されるのではなく、トラックがそれらを通過します。また、Google Maps上でルートにドラッグした点は、個別の経由地として追加されることなく経路を形作るvia pointとして保持されます。Mapsで設定した「高速道路/有料道路/フェリーを避ける」オプションも引き継がれます。",
      },
      {
        question: "変換後のルートがGoogle Mapsの表示と少し異なるのはなぜですか?",
        answer:
          "ルートはGoogle Directions API — Google Maps自体が使用しているのと同じルーティングエンジン — によって、入力された経由地点から再計算されます。そのため、リンクをコピーした後に道路データやルーティングが変更された場合、または中間の経由地と一緒にはリクエストできない代替ルートがURLに記録されていた場合、Googleが返す経路が少し異なることがあります。URLが特定の代替ルートを指していて、かつ経由地がある場合、Google Directions APIはそのケースで代替ルートを返せないため、代わりにメインルートが使用され、警告が表示されます。",
      },
      {
        question: "ルートのサイズや変換頻度に制限はありますか?",
        answer:
          "Google Directions APIは中間経由地を最大25件まで許可しており、それを超えるルートは変換できません。経由地が少なくてもドラッグによるvia pointが多い場合、実際の経由地はすべて保持したまま、via pointは制限に収まるよう均等に間引かれます。また、サービスをすべての利用者に提供し続けるため、変換と短縮リンクの解決はIPアドレスごとに1分あたり10リクエストまでに制限されています。",
      },
      {
        question: "変換に失敗しました。何が問題ですか?",
        answer:
          "よくある原因は次のとおりです: 貼り付けたリンクがGoogle MapsのルートURLでない、ルート内の住所がジオコーディングできない、Google Directions APIが指定された地点間のルートを見つけられない、1分あたりのレート制限に達した、または一時的なネットワークの問題です。Google Mapsからリンクを再度コピーする、ルートを簡略化する、1分待ってから再試行することをお試しください。",
      },
      {
        question: "バグの報告や機能の提案はどうすればいいですか?",
        answer:
          "ホームページのフィードバックフォームをご利用ください — 星による評価、メッセージ、またはその両方を送信でき、返信が必要な場合は任意でメールアドレスを入力できます。",
      },
      {
        question: "MapsToGPXはルートや個人データを保存しますか?",
        answer:
          "いいえ — ルート、URL、住所はデータベースに保存されません。重複した検索を避けるために、短期間のキャッシュのみが使用されます。収集される情報と収集されない情報の詳細は、プライバシーポリシーをご覧ください。",
      },
    ],
  },
  languageSwitcherLabel: "言語",
};
