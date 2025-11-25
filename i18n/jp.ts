export const jp = {
	app: {
		title: 'DistroChess',
		subtitle: 'ゲーム',
	},
	games: {
		title: 'DistroChess — ゲーム',
		loading: '読み込み中...',
		create: '作成',
		whitePlaceholder: '白',
		blackPlaceholder: '黒',
		vs: 'vs',
	},
	welcome: 'DistroChessへようこそ',
	signup: '新規登録',
	signin: 'ログイン',
	signout: 'ログアウト',
	forgotPassword: 'パスワードをお忘れですか？',
	resetPassword: 'パスワードリセット',
	name: 'ユーザー名',
	email: 'メールアドレス',
	password: 'パスワード',
	confirmPassword: 'パスワード確認',
	enterName: 'お名前を入力してください（公開されます）',
	enterEmail: 'メールアドレスを入力してください',
	enterPassword: 'パスワードを入力してください（6文字以上）',
	enterNewPassword: '新しいパスワードを入力してください（6文字以上）',
	enterPasswordAgain: 'パスワードを再入力してください',
	passwordsMustMatch: 'パスワードが一致しません。',
	pleaseWait: 'お待ちください...',
	noAccount: 'アカウントをお持ちではありませんか？',
	haveAccount: 'すでにアカウントをお持ちですか？',
	distroChess: 'DistroChess',
	gamePlaceholder: 'ゲームビューは近日公開！',
	gameComingSoon: 'チェスゲームがここに表示されます。',
	yourTurn: 'あなたの手番です...',
	youAre: 'あなたは',
	landing: {
		eyebrow: '人間とアヒルのための分散型チェス',
		headline: '毎ターン新しいゲーム',
		description: `<p>Distrochessは分散型チェスです。つまり、一人の相手と一つのゲームをプレイするのではありません。代わりに、多くの他のユーザーと多くのゲームをプレイします。これは同時対局に似ていますが、多くの人が一人の相手と対戦するのではなく、テーブルの両側に複数のプレイヤーがいます。</p>
		<p>手を指した後、そのゲームは他のユーザーが応答する機会を得るためにキューに戻されます。その間、あなたはキューからランダムなゲームを与えられます。プレイヤーが自分自身と対戦することを避けるため、各プレイヤーは常に特定のゲームの同じ側でプレイします。</p>
		<p>このプロジェクトは古いアイデアの復活です。元々は2008年頃にDiscochessという名前で、2019年に再開され、そして今また2025年に復活しました。</p>`,
		featureTitle1: 'ゲームキュー',
		featureCopy1:
			'DistroChessは次に利用可能なゲームと自動的にマッチングします。',
		featureTitle2: '素早いターン',
		featureCopy2:
			'ボードを支える分散エンジンのおかげで、すべての手は1秒以内に世界中に複製されます。',
		featureTitle3: 'チームチャット',
		featureCopy3:
			'組み込みのチームチャット機能を使用して、同じ側のチームメイトと話しましょう。戦略を議論したり、ヒントを共有したり、または単にお互いを応援したりできます。',
		communityTag: 'アヒルが作りました',
		ctaHint: '今すぐプレイを開始！',
		languageLabel: '言語',
	},
	leaderboard: {
		linkLabel: 'リーダーボード',
		title: 'リーダーボード',
		subtitle: 'スコア別トッププレイヤー',
		rank: 'ランク',
		player: 'プレイヤー',
		score: 'スコア',
		wins: '勝利',
		losses: '敗北',
		draws: '引き分け',
		memberSince: '登録日',
		you: 'あなた',
		loading: 'リーダーボードを読み込み中...',
		noPlayers: 'まだプレイヤーがいません',
		backToGame: 'ゲームに戻る',
		backToHome: 'ホームに戻る',
		timeAgo: {
			today: '今日',
			day: '{count}日',
			days: '{count}日',
			month: '{count}ヶ月',
			months: '{count}ヶ月',
			year: '{count}年',
			years: '{count}年',
		},
	},
	faq: {
		linkLabel: 'よくある質問',
		ctaPrompt: 'さらに詳しく知りたいですか？',
		ctaLabel: 'よくある質問を読む',
		pageTitle: 'よくある質問',
		intro:
			'DistroChessとは何ですか？どのように機能しますか？<br/>混乱していて、今すぐ答えが欲しいですね。正しい場所に来ました。',
		lastUpdated: '最終更新：2025年11月',
		contactPrompt: `まだ混乱していますか？<a href="mailto:support@distrochess.com">support@distrochess.com</a>にメールしてください。人生のすべての謎に答えます。アヒルは除きます。それについては助けられません。`,
		backToGame: 'あなたのゲームに戻る',
		backToLanding: 'ホームに戻る',
		items: [
			{
				question: 'ゲームのマッチングはどのように行われますか？',
				answer: `次のいずれかのゲームが提示されます：
					<ul style="margin: 1rem 0; padding-left: 1.5rem;">
						<li>まだプレイしていないゲーム、または</li>
						<li>現在の側でプレイしているゲーム</li>
					</ul>
					 そのようなゲームが存在しない場合、対戦相手の一人が手を指すまで、利用可能になるのを待ちます。時々、代わりに真新しいゲームを得ることがあります。`,
			},
			{
				question: '手を指し終えたら何が起こりますか？',
				answer:
					'手を指した後、次の利用可能なゲームが自動的に提示されるので、遅延なくプレイを続けることができます。現在利用可能なゲームがない場合、対戦相手の一人が手を指すまで待ちます。',
			},
			{
				question: 'スコアはどのように計算されますか？',
				answer: `<p>各プレイヤーは1000のスコアから始まります。ゲームが完了すると、すべての参加プレイヤーのスコアは次のように調整されます：</p>
				<ul style="margin: 1rem 0; padding-left: 1.5rem;">
					<li>引き分けの場合、何も変わりません。</li>
					<li>勝利の場合、各勝者はゲームへの参加率に比例した数のポイントを獲得します。同様に、各敗者は参加率に基づいて比例した数のポイントが差し引かれます。</li>
				</ul>
				<p>ご心配なく、スコアがゼロ以下になることはありません。</p>`,
			},
			{
				question:
					'たとえば局面が絶望的な場合など、誰も手を指したくない場合はどうなりますか？投了する方法は？',
				answer: `ゲームで48時間の非アクティブ後、システムはまず手番側のすべてのプレイヤーに通知します。さらに24時間後もまだ誰も手を指していない場合、ゲームは自動投了され、それに応じてポイントが割り当てられます。`,
			},
			{
				question: 'なぜ...？',
				answer:
					'退屈だったんです、わかりますか？<br/>これはこのアイデアの3番目の反復です。前回は2019年で、当時は数百人のプレイヤーが登録するのを見ました。このアヒルが2025年にまだ飛べるか見てみましょう。',
			},
			{
				question: 'アヒルはプレイできますか？アヒルとチェスができますか？',
				answer:
					'DistroChessは、あまり迷惑をかけない限り、すべての鳥類種を歓迎します。',
			},
		],
	},
	authPage: {
		signinTitle: 'プレイを続けるにはログインしてください。',
		signinSubtitle: '分散マッチをすぐに再開できます。',
		signupTitle: 'DistroChessアカウントを作成します。',
		signupSubtitle: '名前、メール、パスワードが必要です。',
		backHome: 'ホームに戻る',
		forgotPasswordTitle: 'パスワードをリセットする必要がありますか？',
		forgotPasswordSubtitle:
			'アカウントに関連付けられたメールを入力すると、安全なリンクを送信します。',
		forgotPasswordCta: 'リセットリンクを送信',
		forgotPasswordSuccessTitle: '受信トレイを確認してください',
		forgotPasswordSuccessBody:
			'そのメールが登録されている場合、まもなくパスワードリセットリンクが届きます。',
		resetPasswordTitle: '新しいパスワードを作成',
		resetPasswordSubtitle:
			'DistroChessアカウントへのアクセスを回復するために、新しいパスワードを選択してください。',
		resetPasswordCta: 'パスワードを更新',
		resetPasswordSuccessTitle: 'パスワードが更新されました',
		resetPasswordSuccessBody:
			'すべて完了しました。新しいパスワードでログインしてボードに戻ってください。',
		resetPasswordExpired:
			'そのリセットリンクは無効であるか期限切れです。以下で新しいリンクをリクエストしてください。',
		backToSignin: 'ログインに戻る',
	},

	close: '閉じる',
	errors: {
		ERR_EMAIL_REQUIRED: 'メールアドレスは必須です',
		ERR_NAME_REQUIRED: '名前は必須です',
		ERR_PASSWORD_TOO_SHORT: 'パスワードは6文字以上である必要があります。',
		ERR_EMAIL_REGISTERED: 'そのメールアドレスはすでに登録されています。',
		ERR_ACCOUNT_CREATION_FAILED:
			'アカウント作成に失敗しました — もう一度お試しください。',
		ERR_JWT_SECRET_MISSING: 'サーバーエラー（設定が不足しています）',
		ERR_PASSWORD_REQUIRED: 'パスワードは必須です。',
		ERR_INVALID_CREDENTIALS: 'メールアドレスまたはパスワードが無効です。',
		ERR_SIGNIN_FAILED: 'ログインに失敗しました — もう一度お試しください。',
		ERR_UNAUTHORIZED_NO_TOKEN: '未認証：認証トークンが提供されていません',
		ERR_INVALID_AUTH_TOKEN: '無効な認証トークン',
		ERR_FORGOT_PASSWORD_FAILED:
			'リクエストを処理できませんでした。しばらくしてからもう一度お試しください。',
		ERR_RESET_TOKEN_INVALID:
			'そのリセットリンクは無効であるか期限切れです。新しいものをリクエストしてください。',
		ERR_RESET_PASSWORD_FAILED:
			'パスワードをリセットできませんでした。もう一度お試しください。',
		ERR_GENERIC: 'エラーが発生しました。もう一度お試しください。',
	},
	winCongrats: 'おめでとうございます！ゲームに勝ちました。',
	winScoreChange:
		'このゲームへの参加により、あなたのスコアは{prevScore}から{newScore}に増加しました。',
	gameDrawn: 'ゲームが引き分けになりました！',
	waitingForOpponent: '対戦相手が手を指すまでお待ちください...',
	timeRemaining: '残り時間',
	pass: 'パス',
	offerDraw: '引き分けを提案',
	drawOffer: {
		title: '引き分けを提案しますか？',
		message:
			'本当に引き分けを提案しますか？<br/>ゲームはすでにプレイした対戦相手にのみ提案されます。次の対戦相手が受け入れた場合、このゲームは引き分けとなり、どちらの側にもポイントは割り当てられません。',
		confirm: 'はい、引き分けを提案します',
		cancel: 'やめておきます',
	},
	drawOffered: {
		title: '引き分けが提案されました！',
		message: '対戦相手が引き分けを提案しました。',
		accept: '引き分けを受け入れる',
		decline: '拒否してプレイを続ける',
	},
	loadingGame: 'ゲームを読み込み中...',
	noGameAvailable: '利用可能なゲームはありません',
	gameId: 'ゲームID',
	gameHistory: 'ゲーム履歴',
	exitHistory: '履歴を閉じる',
	requestedGameNotFound:
		'そのゲームが見つかりませんでした。代わりに次の利用可能なゲームを読み込んでいます。',
	requestedGameNotAvailable:
		'そのゲームはあなたには利用できません。代わりに次の利用可能なゲームを読み込んでいます。',
	unknownPlayer: '不明',
	moveBy: '手を指したプレイヤー：',
	lastMoveBy: '最後に手を指したプレイヤー：',
	score: 'スコア',
	teamChat: {
		button: 'チームチャット',
		title: 'チームチャット',
		subtitle:
			'あなたの側のチームメイトだけがこれらのメッセージを読むことができます。',
		placeholder: 'で、作戦は？',
		send: '送信',
		sending: '送信中...',
		loading: 'メッセージを読み込み中...',
		empty: 'まだメッセージがありません。挨拶しましょう！',
		you: 'あなた',
		disabledHint:
			'チームチャットのロックを解除するには、この側で手を指してください。',
		emojiToggle: '絵文字ピッカーを切り替え',
		loadError: 'チャットを読み込めませんでした。もう一度お試しください。',
		sendError: 'メッセージを送信できませんでした。もう一度お試しください。',
		moveNumberLabel: '{move}手目',
	},
	moveErrors: {
		notYourTurnTitle: 'あなたの手番ではありません',
		notYourTurnMessage:
			'他のプレイヤーが今手を指しました。次のゲームを読み込んでいます...',
	},
	settings: {
		title: 'ユーザー設定',
		subtitle: 'プロフィールと設定を更新します。',
		button: '設定',
		save: '変更を保存',
		language: '言語',
		signupDate: '登録日',
		readOnly: '読み取り専用',
		updateSuccess: '設定が正常に更新されました。',
		backToGames: 'ゲームに戻る',
		duckQuestion: 'アヒルについてどう思いますか？',
		duckFavor: '賛成',
		duckOpposed: '反対',
		changePassword: 'パスワード変更',
		changePasswordTitle: 'パスワードを変更',
		currentPassword: '現在のパスワード',
		newPassword: '新しいパスワード',
		setNewPassword: '新しいパスワードを設定',
		cancel: 'キャンセル',
		incorrectPassword: 'パスワードが正しくありません',
		passwordChanged: 'パスワードが正常に変更されました。',
	},
	subscriptionPages: {
		common: {
			returnHome: 'DistroChessに戻る',
			genericError: '後でもう一度お試しください。',
			missingUser: 'ユーザー情報が不足しています。',
			updateFailed: 'メール設定を更新できませんでした。',
		},
		unsubscribe: {
			title: '通知設定が更新されました',
			pending: '少々お待ちください、設定を更新しています…',
			success:
				'自動投了リマインダーの購読を解除しました。いつでも以下から再購読できます。',
			linkText: 'リマインダーを再購読',
		},
		resubscribe: {
			title: '再度購読しました',
			pending: '購読を復元しています…',
			success: '自動投了リマインダーを再び受け取り始めます。',
			linkText: '再度購読を解除',
		},
	},
	emails: {
		welcome: {
			greeting: 'こんにちは、{name}さん',
			intro:
				'DistroChessへようこそ — オンラインで分散型ゲームをプレイする最速の方法です。',
			description:
				'マッチを開始し、友達を招待し、任意のデバイスからライブレーティングを確認してください。',
			ctaText: 'DistroChess.comに戻る',
			footer: 'ボードでお会いしましょう！',
		},
		passwordReset: {
			subject: 'DistroChessのパスワードをリセット',
			greeting: 'こんにちは、{name}さん',
			body: '以下の安全なリンクを使用して新しいパスワードを選択してください。',
			warning:
				'このリンクは60分で期限切れになります。リセットをリクエストしていない場合は、このメールを無視してください。',
			ctaText: 'パスワードをリセット',
			footer: 'ご質問がありますか？このメールに返信してください。',
		},
	},
	languages: {
		en: '英語 (English)',
		fr: 'フランス語 (Français)',
		de: 'ドイツ語 (Deutsch)',
		es: 'スペイン語 (Español)',
		jp: '日本語',
	},
	privacy: {
		linkLabel: 'プライバシーポリシー',
		pageTitle: 'プライバシーポリシー',
		lastUpdated: '最終更新：2025年11月',
		contactPrompt: `プライバシーに関するご質問がありますか？<a href="mailto:support@distrochess.com">support@distrochess.com</a>にメールしてください。`,
		backToGame: 'あなたのゲームに戻る',
		backToLanding: 'ホームに戻る',
		sections: [
			{
				title: '収集する情報',
				content: `アカウントを作成する際に提供される情報（名前とメールアドレスを含む）を収集します。また、指した手、参加したゲーム、スコアなどのゲームデータも収集します。`,
			},
			{
				title: '情報の使用方法',
				content: `ゲームに関する通知の送信を含め、サービスの提供と改善のためにあなたの情報を使用します。あなたの名前は他のプレイヤーに公開されます。`,
			},
			{
				title: 'データの保存とセキュリティ',
				content: `業界標準の慣行を使用してデータを安全に保存します。パスワードは暗号化されており、プレーンテキストで保存することはありません。アカウントがアクティブである限り、データを保持します。`,
			},
			{
				title: '情報の共有',
				content: `<b>第三者にあなたの個人情報を販売または共有することはありません。</b>あなたの名前はゲーム内の他のプレイヤーに表示されますが、メールアドレスは非公開のままです。`,
			},
			{
				title: 'あなたの権利',
				content: `設定ページからいつでもアカウント情報を更新できます。メール通知の購読を解除することもできます。アカウントを削除したい場合は、<a href="mailto:support@distrochess.com">support@distrochess.com</a>までお問い合わせください。`,
			},
			{
				title: 'Cookieと追跡',
				content: `セッションを維持し、ログイン状態を保つために必須のCookieを使用します。追跡Cookieやサードパーティのアナリティクスは使用しません。`,
			},
			{
				title: 'このポリシーの変更',
				content: `このプライバシーポリシーは時々更新される場合があります。重要な変更については、メールまたはウェブサイト上の通知を通じてお知らせします。`,
			},
		],
	},
};

export type Translations = typeof jp;
