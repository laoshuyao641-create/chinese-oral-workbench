(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const icons = {
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 17v5"/><path d="M9 10.8V5.6L7.8 4.2h8.4L15 5.6v5.2l1.6 1.4H7.4L9 10.8Z"/><path d="M5.5 17h13"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><path d="m4.5 12.5 5 5 10-11"/></svg>',
    reset: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>',
    eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12Z"/><circle cx="12" cy="12" r="2.6"/></svg>',
    eyeOff: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m3 3 18 18"/><path d="M10.6 5.2A9.8 9.8 0 0 1 12 5c6.4 0 10 7 10 7a17.5 17.5 0 0 1-3.1 3.8"/><path d="M6.2 6.8A17.6 17.6 0 0 0 2 12s3.6 7 10 7a9.4 9.4 0 0 0 4.4-1"/><path d="M9.9 9.9a2.7 2.7 0 0 0 3.8 3.8"/></svg>',
    correct: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m8 12 2.7 2.7L16.5 9"/></svg>',
    chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/></svg>',
    headphone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 14v-2a9 9 0 0 1 18 0v2"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>',
    clipboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="m9 12 2 2 4-4"/></svg>',
    calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M8 2v4M16 2v4M3 10h18"/><path d="M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"/></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M4 17v4h16v-4"/></svg>'
  };

  const svg = (name) => icons[name] || '';

  const meta = (item) => `
    <p class="zh">${item.zh}</p>
    ${item.py ? `<p class="py">${item.py}</p>` : ''}
    ${item.ja ? `<p class="ja">${item.ja}</p>` : ''}
  `;

  const dateKey = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  };

  const store = {
    get(key, fallback) {
      try {
        const raw = localStorage.getItem(key);
        return raw === null ? fallback : JSON.parse(raw);
      } catch (err) {
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (err) {
        // storage unavailable; keep the page usable
      }
    }
  };

  const goals = [
    { zh: '会用“在、有、是”说位置和存在', ja: '「在・有・是」で場所と存在を言う' },
    { zh: '会说“动词（短语）+ 的 + 名词”', ja: '「動詞（句）＋的＋名詞」を使う' },
    { zh: '能问路、介绍学校里的地方', ja: '道を尋ね、学校の中を紹介する' }
  ];

  const standardSentences = [
    { zh: '前面就是咱们学校最大的教学楼。', py: 'Qiánmiàn jiù shì zánmen xuéxiào zuì dà de jiàoxuélóu.', ja: '前方が私たちの学校で一番大きな校舎です。' },
    { zh: '国际学生办公室在教学楼三层。', py: 'Guójì xuéshēng bàngōngshì zài jiàoxuélóu sān céng.', ja: '留学生事務室は校舎の3階にあります。' },
    { zh: '左边是食堂，右边是网球场。', py: 'Zuǒbiān shì shítáng, yòubiān shì wǎngqiúchǎng.', ja: '左は食堂、右はテニスコートです。' },
    { zh: '请问图书馆在哪儿？', py: 'Qǐngwèn túshūguǎn zài nǎr?', ja: 'すみません、図書館はどこですか。' },
    { zh: '图书馆在食堂对面。', py: 'Túshūguǎn zài shítáng duìmiàn.', ja: '図書館は食堂の向かい側にあります。' },
    { zh: '足球场右边就是图书馆。', py: 'Zúqiúchǎng yòubiān jiù shì túshūguǎn.', ja: 'サッカー場の右側が図書館です。' },
    { zh: '学校东边就有一个大超市。', py: 'Xuéxiào dōngbiān jiù yǒu yí ge dà chāoshì.', ja: '学校の東側に大きなスーパーがあります。' },
    { zh: '学校东门附近有一家新开的咖啡厅。', py: 'Xuéxiào dōngmén fùjìn yǒu yì jiā xīn kāi de kāfēitīng.', ja: '学校の東門の近くに新しくできたカフェがあります。' },
    { zh: '改天吧，我得去自习。', py: 'Gǎitiān ba, wǒ děi qù zìxí.', ja: 'また今度にしよう、自習に行かなくちゃ。' },
    { zh: '你知道309教室在哪儿吗？', py: 'Nǐ zhīdào sān líng jiǔ jiàoshì zài nǎr ma?', ja: '309教室がどこにあるか知っていますか。' },
    { zh: '明天下午那里有个关于新生选课的讲座！', py: 'Míngtiān xiàwǔ nàlǐ yǒu ge guānyú xīnshēng xuǎnkè de jiǎngzuò!', ja: '明日の午後、あそこに新入生の授業選びの講演があります。' },
    { zh: '咱们可以顺便去看看那位最帅的老师！', py: 'Zánmen kěyǐ shùnbiàn qù kànkan nà wèi zuì shuài de lǎoshī!', ja: 'ついでに一番かっこいい先生に会いに行こう！' }
  ];

  const vocab1 = [
    { zh: '前面', py: 'qiánmiàn', ja: '前・前方' },
    { zh: '后面', py: 'hòumiàn', ja: '後ろ・後方' },
    { zh: '教学楼', py: 'jiàoxuélóu', ja: '校舎' },
    { zh: '国际', py: 'guójì', ja: '国際的な' },
    { zh: '办公室', py: 'bàngōngshì', ja: '事務室' },
    { zh: '里', py: 'lǐ', ja: '中・内' },
    { zh: '向', py: 'xiàng', ja: '～の方へ' },
    { zh: '左边', py: 'zuǒbiān', ja: '左側' },
    { zh: '右边', py: 'yòubiān', ja: '右側' },
    { zh: '食堂', py: 'shítáng', ja: '食堂' },
    { zh: '网球场', py: 'wǎngqiúchǎng', ja: 'テニスコート' },
    { zh: '图书馆', py: 'túshūguǎn', ja: '図書館' },
    { zh: '对面', py: 'duìmiàn', ja: '向かい側' },
    { zh: '足球场', py: 'zúqiúchǎng', ja: 'サッカー場' },
    { zh: '附近', py: 'fùjìn', ja: '近く' },
    { zh: '东边', py: 'dōngbiān', ja: '東側' },
    { zh: '东西', py: 'dōngxi', ja: '物・もの' },
    { zh: '方便', py: 'fāngbiàn', ja: '便利だ' }
  ];

  const vocab2 = [
    { zh: '开', py: 'kāi', ja: '開く・営業する' },
    { zh: '咖啡厅', py: 'kāfēitīng', ja: 'カフェ' },
    { zh: '尝', py: 'cháng', ja: '味わう' },
    { zh: '自习', py: 'zìxí', ja: '自習する' },
    { zh: '一会儿', py: 'yíhuìr', ja: '少しの間' },
    { zh: '放松', py: 'fàngsōng', ja: 'リラックスする' },
    { zh: '教室', py: 'jiàoshì', ja: '教室' },
    { zh: '中间', py: 'zhōngjiān', ja: '中央・中間' },
    { zh: '旁边', py: 'pángbiān', ja: 'そば・隣' },
    { zh: '那里', py: 'nàlǐ', ja: 'あそこ' },
    { zh: '关于', py: 'guānyú', ja: '～について' },
    { zh: '选课', py: 'xuǎnkè', ja: '授業を選ぶ' },
    { zh: '讲座', py: 'jiǎngzuò', ja: '講演・講座' },
    { zh: '顺便', py: 'shùnbiàn', ja: 'ついでに' }
  ];

  const places = [
    { zh: '大使馆', py: 'dàshǐguǎn', ja: '大使館' },
    { zh: '公园', py: 'gōngyuán', ja: '公園' },
    { zh: '加油站', py: 'jiāyóuzhàn', ja: 'ガソリンスタンド' },
    { zh: '自动取款机', py: 'zìdòng qǔkuǎnjī', ja: 'ATM' },
    { zh: '车站', py: 'chēzhàn', ja: '駅・停留所' },
    { zh: '停车场', py: 'tíngchēchǎng', ja: '駐車場' },
    { zh: '商场', py: 'shāngchǎng', ja: 'ショッピングモール' },
    { zh: '超市', py: 'chāoshì', ja: 'スーパー' }
  ];

  const directions = [
    { zh: '前边', py: 'qiánbian', ja: '前の方' },
    { zh: '后边', py: 'hòubian', ja: '後ろの方' },
    { zh: '上边', py: 'shàngbian', ja: '上' },
    { zh: '下边', py: 'xiàbian', ja: '下' },
    { zh: '左边', py: 'zuǒbian', ja: '左' },
    { zh: '右边', py: 'yòubian', ja: '右' },
    { zh: '中间', py: 'zhōngjiān', ja: '真ん中' },
    { zh: '东边', py: 'dōngbian', ja: '東' },
    { zh: '西边', py: 'xībian', ja: '西' },
    { zh: '南边', py: 'nánbian', ja: '南' },
    { zh: '北边', py: 'běibian', ja: '北' }
  ];

  const dialog1 = {
    stage: {
      zh: '学长带着新生参观校园。',
      py: 'Xuézhǎng dài zhe xīnshēng cānguān xiàoyuán.',
      ja: '先輩が新入生にキャンパスを案内しています。'
    },
    lines: [
      { who: '谢冬', pyWho: 'Xiè Dōng', zh: '前面就是咱们学校最大的教学楼。', py: 'Qiánmiàn jiù shì zánmen xuéxiào zuì dà de jiàoxuélóu.', ja: '前方が私たちの学校で一番大きな校舎です。' },
      { who: '爱华', pyWho: 'Ài Huá', zh: '国际学生办公室就在楼里，是吗？', py: 'Guójì xuéshēng bàngōngshì jiù zài lóu lǐ, shì ma?', ja: '留学生事務室はあの校舎の中にあるんですね。' },
      { who: '谢冬', pyWho: 'Xiè Dōng', zh: '是的。国际学生办公室在教学楼三层。', py: 'Shì de. Guójì xuéshēng bàngōngshì zài jiàoxuélóu sān céng.', ja: 'はい。留学生事務室は校舎の3階にあります。' },
      { who: '克丽丝', pyWho: 'Kèlìsī', note: '小声', zh: '听说办公室里有一位特别帅的老师。', py: 'Tīngshuō bàngōngshì lǐ yǒu yí wèi tèbié shuài de lǎoshī.', ja: '事務室にとてもかっこいい先生がいるそうです。' },
      { who: '谢冬', pyWho: 'Xiè Dōng', zh: '请向前走。左边是食堂，右边是网球场。', py: 'Qǐng xiàng qián zǒu. Zuǒbiān shì shítáng, yòubiān shì wǎngqiúchǎng.', ja: '前へ進んでください。左は食堂、右はテニスコートです。' },
      { who: '爱华', pyWho: 'Ài Huá', zh: '请问图书馆在哪儿？', py: 'Qǐngwèn túshūguǎn zài nǎr?', ja: 'すみません、図書館はどこですか。' },
      { who: '谢冬', pyWho: 'Xiè Dōng', zh: '图书馆在食堂对面。看，足球场右边就是图书馆。', py: 'Túshūguǎn zài shítáng duìmiàn. Kàn, zúqiúchǎng yòubiān jiù shì túshūguǎn.', ja: '図書館は食堂の向かいです。見てください、サッカー場の右側が図書館です。' },
      { who: '克丽丝', pyWho: 'Kèlìsī', zh: '学校附近有超市吗？', py: 'Xuéxiào fùjìn yǒu chāoshì ma?', ja: '学校の近くにスーパーはありますか。' },
      { who: '谢冬', pyWho: 'Xiè Dōng', zh: '有，学校东边就有一个大超市，买东西很方便。', py: 'Yǒu, xuéxiào dōngbiān jiù yǒu yí ge dà chāoshì, mǎi dōngxi hěn fāngbiàn.', ja: 'あります。学校の東側に大きなスーパーがあって、買い物にとても便利です。' }
    ]
  };

  const dialog2 = {
    stage: {
      zh: '下课后，爱华和克丽丝走在校园里。',
      py: 'Xiàkè hòu, Ài Huá hé Kèlìsī zǒu zài xiàoyuán lǐ.',
      ja: '放課後、愛華とクリスはキャンパスを歩いています。'
    },
    lines: [
      { who: '爱华', pyWho: 'Ài Huá', zh: '学校东门附近有一家新开的咖啡厅。听说那儿的咖啡不错，咱们去尝尝？', py: 'Xuéxiào dōngmén fùjìn yǒu yì jiā xīn kāi de kāfēitīng. Tīngshuō nàr de kāfēi búcuò, zánmen qù chángchang?', ja: '学校の東門の近くに新しくできたカフェがあります。そこのコーヒーは美味しいらしいから、行ってみませんか。' },
      { who: '克丽丝', pyWho: 'Kèlìsī', zh: '改天吧，我得去自习。', py: 'Gǎitiān ba, wǒ děi qù zìxí.', ja: 'また今度にしよう、自習に行かなくちゃ。' },
      { who: '爱华', pyWho: 'Ài Huá', zh: '咱们就休息一会儿，放松放松！', py: 'Zánmen jiù xiūxi yíhuìr, fàngsōng fàngsōng!', ja: 'ちょっと休んで、リラックスしよう！' },
      { who: '爱华', pyWho: 'Ài Huá', zh: '你知道309教室在哪儿吗？', py: 'Nǐ zhīdào sān líng jiǔ jiàoshì zài nǎr ma?', ja: '309教室がどこにあるか知っていますか。' },
      { who: '克丽丝', pyWho: 'Kèlìsī', zh: '就是三层中间那个大教室。', py: 'Jiù shì sān céng zhōngjiān nà ge dà jiàoshì.', ja: '3階の真ん中にある大きな教室だよ。' },
      { who: '爱华', pyWho: 'Ài Huá', zh: '就在国际学生办公室旁边吗？', py: 'Jiù zài guójì xuéshēng bàngōngshì pángbiān ma?', ja: '留学生事務室の隣ですか。' },
      { who: '克丽丝', pyWho: 'Kèlìsī', zh: '对。', py: 'Duì.', ja: 'そう。' },
      { who: '爱华', pyWho: 'Ài Huá', zh: '明天下午那里有个关于新生选课的讲座！', py: 'Míngtiān xiàwǔ nàlǐ yǒu ge guānyú xīnshēng xuǎnkè de jiǎngzuò!', ja: '明日の午後、あそこに新入生の授業選びの講演があるよ！' },
      { who: '克丽丝', pyWho: 'Kèlìsī', zh: '咱们可以顺便去看看那位最帅的老师！', py: 'Zánmen kěyǐ shùnbiàn qù kànkan nà wèi zuì shuài de lǎoshī!', ja: 'ついでに一番かっこいい先生に会いに行こう！' }
    ]
  };

  const phonetics = [
    { zh: '姑姑去年带女儿去苏州旅游了。', py: "Gūgu qùnián dài nǚ'ér qù Sūzhōu lǚyóu le.", ja: 'おばさんは去年、娘を連れて蘇州へ旅行に行きました。' },
    { zh: '下午没下雨，我们去附近的足球场踢足球了。', py: 'Xiàwǔ méi xià yǔ, wǒmen qù fùjìn de zúqiúchǎng tī zúqiú le.', ja: '午後は雨が降らなかったので、近くのサッカー場でサッカーをしました。' },
    { zh: '五月的天气很舒服，可以打羽毛球。', py: 'Wǔyuè de tiānqì hěn shūfu, kěyǐ dǎ yǔmáoqiú.', ja: '5月の天気はとても快適で、バドミントンができます。' }
  ];

  function vocabHtml(title, subtitle, items) {
    return `
      <div class="lesson-block">
        <div class="block-head">
          <h3>${title}<span class="zh-sub">${subtitle}</span></h3>
        </div>
        <div class="vocab-grid">
          ${items.map((item) => `
            <div class="vocab-item">
              <span class="zh">${item.zh}</span>
              <span class="py">${item.py}</span>
              <span class="ja">${item.ja}</span>
            </div>`).join('')}
        </div>
      </div>`;
  }

  function renderTextbook() {
    const root = $('#textbookContent');
    if (!root) return;

    root.innerHTML = `
      <section class="lesson-block">
        <div class="block-head">
          <h3>学习目标 / 学習の目標<span class="zh-sub">这课会说什么</span></h3>
        </div>
        <ul class="goal-grid">
          ${goals.map((goal) => `
            <li class="goal-item">
              <strong>${goal.zh}</strong>
              <span>${goal.ja}</span>
            </li>`).join('')}
        </ul>
      </section>

      <section class="lesson-block">
        <div class="block-head">
          <h3>标准句 Standard sentences<span class="zh-sub">教材 P2-P3</span></h3>
          <span class="block-meta">一共12句</span>
        </div>
        <ol class="std-list">
          ${standardSentences.map((item, index) => `
            <li class="std-item">
              <span class="num">${String(index + 1).padStart(2, '0')}</span>
              <div>${meta(item)}</div>
            </li>`).join('')}
        </ol>
      </section>

      <section class="lesson-block">
        <div class="block-head">
          <h3>会话一 Conversation 1<span class="zh-sub">问路与介绍学校</span></h3>
          <span class="block-meta">音频 1-2</span>
        </div>
        ${dialogueHtml(dialog1)}
      </section>

      ${vocabHtml('会话一生词 Words 1', '常用词和方位词', vocab1)}

      <section class="lesson-block">
        <div class="block-head">
          <h3>会话二 Conversation 2<span class="zh-sub">新开的咖啡厅</span></h3>
          <span class="block-meta">音频 1-4</span>
        </div>
        ${dialogueHtml(dialog2)}
      </section>

      ${vocabHtml('会话二生词 Words 2', '休息、教室与讲座', vocab2)}
      ${vocabHtml('词语扩展 Vocabulary development', '常见地点与方位', [...places, ...directions])}

      <section class="lesson-block">
        <div class="block-head">
          <h3>语言点 Grammar<span class="zh-sub">在、有、是 + 动词的+名词</span></h3>
        </div>
        <div class="formula-stack">
          <div class="formula">
            <div><b>在</b><p class="pattern">人 / 物 + 在 + 地点</p></div>
            <div class="eg">
              ${meta({ zh: '图书馆在食堂对面。', py: 'Túshūguǎn zài shítáng duìmiàn.', ja: '図書館は食堂の向かいにある。' })}
              ${meta({ zh: '国际学生办公室在教学楼三层。', py: 'Guójì xuéshēng bàngōngshì zài jiàoxuélóu sān céng.', ja: '留学生事務室は校舎の3階にある。' })}
            </div>
          </div>
          <div class="formula">
            <div><b>有</b><p class="pattern">地点 + 有 + 人 / 物</p></div>
            <div class="eg">
              ${meta({ zh: '学校东边有一个大超市。', py: 'Xuéxiào dōngbiān yǒu yí ge dà chāoshì.', ja: '学校の東側に大きなスーパーがある。' })}
              ${meta({ zh: '教室里有很多桌子。', py: 'Jiàoshì lǐ yǒu hěn duō zhuōzi.', ja: '教室の中に机がたくさんある。' })}
            </div>
          </div>
          <div class="formula">
            <div><b>是</b><p class="pattern">地点 + 是 + 具体的人 / 物</p></div>
            <div class="eg">
              ${meta({ zh: '左边是食堂。', py: 'Zuǒbiān shì shítáng.', ja: '左が食堂だ。' })}
              ${meta({ zh: '爱华的旁边是克丽丝。', py: 'Ài Huá de pángbiān shì Kèlìsī.', ja: '愛華の隣がクリスだ。' })}
            </div>
          </div>
        </div>
        <p class="grammar-note">
          用“有”只说“那里有什么”；用“是”时，听的人已经知道那里有东西，再说“那是什么”。例如：图书馆左边有食堂、学校里有食堂。
          <span class="ja">「有」は「そこに何がある」だけを伝え、「是」は聞き手が既に知っている場所について「それが何か」を説明します。</span>
        </p>
        <div class="formula-stack" style="margin-top:16px">
          <div class="formula">
            <div><b>的</b><p class="pattern">动词（短语）+ 的 + 名词</p></div>
            <div class="eg">
              ${meta({ zh: '新开的咖啡厅', py: 'xīn kāi de kāfēitīng', ja: '新しくできたカフェ' })}
              ${meta({ zh: '关于新生选课的讲座', py: 'guānyú xīnshēng xuǎnkè de jiǎngzuò', ja: '新入生の授業選びについての講演' })}
              ${meta({ zh: '最帅的老师', py: 'zuì shuài de lǎoshī', ja: '一番かっこいい先生' })}
            </div>
          </div>
        </div>
      </section>

      <section class="lesson-block">
        <div class="block-head">
          <h3>文化一点 Culture<span class="zh-sub">北京人怎么说方向</span></h3>
        </div>
        <div class="culture-note">
          <p>北京的道路常常是正南、正北、正东、正西，所以北京人常用“东、西、南、北”表示位置：北京东站、北京西站、北京南站、北京北站；还有东单、西单、东直门、西直门。</p>
          <p class="py">Běijīng de dàolù chángcháng shì zhèng nán, zhèng běi, zhèng dōng, zhèng xī.</p>
          <p class="ja">北京の道路は多くが真南・真北・真東・真西です。そのため北京の人々は「東・西・南・北」で場所を表し、北京東駅・北京西駅・北京南駅・北京北駅などにもその名前が残っています。</p>
        </div>
      </section>
    `;
  }

  function dialogueHtml(dialog) {
    const lines = dialog.lines.map((line) => `
      <div class="dialog-line">
        <div class="speaker">${line.who}${line.pyWho ? `<small>${line.pyWho}</small>` : ''}</div>
        <div class="turn-copy">
          ${line.note ? `<span class="turn-note">（${line.note}）</span>` : ''}
          ${meta(line)}
        </div>
      </div>`).join('');
    return `
      <div class="dialogue">
        <div class="dialog-stage">${dialog.stage.zh}<span class="ja">${dialog.stage.ja}</span></div>
        ${lines}
      </div>`;
  }

  function dialogueScript(dialog) {
    return dialog.lines.map((line) => ({ zh: line.zh, py: line.py, ja: line.ja }));
  }

  const audioTracks = [
    {
      id: '1-1',
      title: '标准句',
      titleJa: '基本文の音声',
      src: 'audio/1-1.mp3',
      mode: 'sentence',
      tip: 'Standard sentences',
      lines: standardSentences,
      quizzes: []
    },
    {
      id: '1-2',
      title: '会话一',
      titleJa: '会話1',
      src: 'audio/1-2.mp3',
      mode: 'sentence',
      tip: 'Conversation 1',
      lines: dialogueScript(dialog1),
      quizzes: [
        { q: '国际学生办公室在教学楼几层？', options: ['二层', '三层', '一层'], answer: 1 },
        { q: '图书馆在哪儿？', options: ['网球场对面', '足球场旁边', '食堂对面'], answer: 2 },
        { q: '学校附近有超市吗？', options: ['有，学校东边', '没有', '有，学校北边'], answer: 0 }
      ]
    },
    {
      id: '1-3',
      title: '会话一生词',
      titleJa: '会話1の単語',
      src: 'audio/1-3.mp3',
      mode: 'words',
      tip: 'Words 1',
      lines: vocab1,
      quizzes: []
    },
    {
      id: '1-4',
      title: '会话二',
      titleJa: '会話2',
      src: 'audio/1-4.mp3',
      mode: 'sentence',
      tip: 'Conversation 2',
      lines: dialogueScript(dialog2),
      quizzes: [
        { q: '309教室在哪儿？', options: ['三层中间的大教室', '二层的小教室', '国际办公室里面'], answer: 0 },
        { q: '明天下午那里有什么？', options: ['一场足球比赛', '一个关于新生选课的讲座', '一个新开的超市'], answer: 1 }
      ]
    },
    {
      id: '1-5',
      title: '会话二生词',
      titleJa: '会話2の単語',
      src: 'audio/1-5.mp3',
      mode: 'words',
      tip: 'Words 2',
      lines: vocab2,
      quizzes: []
    },
    {
      id: '1-6',
      title: '词语扩展',
      titleJa: '語彙の拡張',
      src: 'audio/1-6.mp3',
      mode: 'words',
      tip: 'Vocabulary development',
      lines: [...places, ...directions],
      quizzes: []
    },
    {
      id: '1-7',
      title: '语音练习 u / ü',
      titleJa: '発音練習 u / ü',
      src: 'audio/1-7.mp3',
      mode: 'sentence',
      tip: 'Phonetics',
      lines: phonetics,
      quizzes: []
    }
  ];

  function trackScriptHtml(track) {
    const lines = track.mode === 'words'
      ? track.lines.map((word) => `
          <li class="word-line">
            <b>${word.zh}</b>
            <span class="py">${word.py}</span>
            <span class="ja">${word.ja}</span>
          </li>`).join('')
      : track.lines.map((line) => `<li class="script-line">${meta(line)}</li>`).join('');
    return `<ol class="script-lines">${lines}</ol>`;
  }

  function trackQuizzesHtml(quizzes) {
    return quizzes.map((quiz, quizIndex) => `
      <div class="quiz">
        <p class="q">${quizIndex + 1}. ${quiz.q}</p>
        <div class="quiz-options">
          ${quiz.options.map((option, optionIndex) => `
            <button type="button" data-option="${optionIndex}" data-correct="${quiz.answer === optionIndex ? '1' : '0'}">${option}</button>`).join('')}
        </div>
        <p class="quiz-feedback" aria-live="polite"></p>
      </div>`).join('');
  }

  function renderListening() {
    const root = $('#listeningContent');
    if (!root) return;
    root.innerHTML = `
      <div class="track-list">
        ${audioTracks.map((track) => `
          <article class="track-card" data-audio-id="${track.id}">
            <div class="track-top">
              <div class="track-id"><b>音频 ${track.id}</b></div>
              <div class="track-title">
                <strong>${track.title}</strong>
                <span>${track.titleJa} · ${track.tip}</span>
              </div>
              <div class="track-tools">
                <button class="tool-btn speed-btn" type="button" data-speed aria-label="播放速度">1.0x</button>
              </div>
            </div>
            <div class="track-player">
              <audio controls preload="metadata" src="${track.src}"></audio>
              ${track.quizzes.length ? `<div class="quiz-list">${trackQuizzesHtml(track.quizzes)}</div>` : ''}
            </div>
            <div class="quick-tools">
              <a class="reveal-btn" href="${track.src}" download="audio-${track.id}.mp3" aria-label="下载音频 ${track.id}">
                ${svg('download')}<span>下载</span>
              </a>
              <button class="reveal-btn" type="button" data-reveal aria-expanded="false">
                ${svg('eye')}<span>文本</span>
              </button>
            </div>
            <div class="track-script" hidden>
              <p class="script-title">录音文本 / Transcript</p>
              ${trackScriptHtml(track)}
            </div>
          </article>`).join('')}
      </div>`;
  }

  const blankItems = [
    { zh: '图书馆（___）食堂对面。', py: 'Túshūguǎn （___） shítáng duìmiàn.', ja: '図書館は食堂の向かいにある。', answer: '在' },
    { zh: '学校东边（___）一个大超市。', py: 'Xuéxiào dōngbiān （___） yí ge dà chāoshì.', ja: '学校の東側に大きなスーパーがある。', answer: '有' },
    { zh: '左边（___）食堂。', py: 'Zuǒbiān （___） shítáng.', ja: '左が食堂だ。', answer: '是' },
    { zh: '爱华的旁边（___）克丽丝。', py: 'Ài Huá de pángbiān （___） Kèlìsī.', ja: '愛華の隣がクリスだ。', answer: '是' },
    { zh: '我的桌子上（___）一本书。', py: 'Wǒ de zhuōzi shàng （___） yì běn shū.', ja: '私の机の上に本が一冊ある。', answer: '有' },
    { zh: '国际学生办公室（___）教学楼三层。', py: 'Guójì xuéshēng bàngōngshì （___） jiàoxuélóu sān céng.', ja: '留学生事務室は校舎の3階にある。', answer: '在' },
    { zh: '教室的前边（___）一块白板。', py: 'Jiàoshì de qiánbiān （___） yí kuài báibǎn.', ja: '教室の前の方にホワイトボードがある。', answer: '有' }
  ];

  const speakTasks = [
    {
      tag: '在',
      zh: '请问，图书馆在哪儿？',
      py: 'Qǐngwèn, túshūguǎn zài nǎr?',
      ja: 'すみません、図書館はどこですか。',
      sampleZh: '图书馆在食堂对面。',
      sampleJa: '図書館は食堂の向かいです。'
    },
    {
      tag: '有',
      zh: '学校附近有超市吗？',
      py: 'Xuéxiào fùjìn yǒu chāoshì ma?',
      ja: '学校の近くにスーパーはありますか。',
      sampleZh: '有，学校东边就有一个大超市。',
      sampleJa: 'あります。学校の東側に大きなスーパーがあります。'
    },
    {
      tag: '是',
      zh: '你的宿舍里有什么？它在哪儿？',
      py: 'Nǐ de sùshè lǐ yǒu shénme? Tā zài nǎr?',
      ja: '寮には何がありますか。それはどこにありますか。',
      sampleZh: '我的宿舍里有一张桌子，它在窗户旁边。',
      sampleJa: '私の寮には机があります。窓のそばにあります。'
    }
  ];

  const homeworkItems = [
    { zh: '背记本课标准句，录下语音发给老师。', ja: '基本文を覚え、音声を録音して先生に送る。' },
    { zh: '说一说你的宿舍里有什么，这些东西的位置在哪里；拍一张照片，用语音描述。', ja: '寮にあるものとその場所を話し、写真を撮って音声で説明する。' },
    { zh: '阅读本课“文化”部分。', ja: 'この課の「文化」の部分を読む。' },
    { zh: '预习第2课词语。', ja: '第2課の単語を予習する。' },
    { zh: '选做：到你的学校或家附近走一圈，用“在、是、有”说看到的地方。', ja: '学校や家の近くを歩き、「在・是・有」で場所を言ってみる。' }
  ];

  function renderPractice() {
    const root = $('#practiceContent');
    if (!root) return;
    root.innerHTML = `
      <div class="practice-grid">
        <section class="panel-block">
          <div class="panel-head">
            <h3>选词填空：在 / 有 / 是</h3>
            <span>6+1句</span>
          </div>
          <div class="blank-list">
            ${blankItems.map((item, index) => `
              <div class="blank-item" data-answer="${item.answer}">
                <p>${index + 1}. ${item.zh.replace('（___）', '<select class="blank-select" aria-label="选择答案"><option value="">-</option><option>在</option><option>有</option><option>是</option></select>')}</p>
                <p class="py">${item.py}</p>
                <p class="ja">${item.ja}</p>
                <p class="state" aria-live="polite"></p>
              </div>`).join('')}
          </div>
          <button class="answer-btn" type="button" data-check-blanks>${svg('check')}检查答案</button>
        </section>

        <section class="panel-block">
          <div class="panel-head">
            <h3>口头任务 Speak</h3>
            <span>先自己回答，再看示例</span>
          </div>
          <div class="speak-grid">
            ${speakTasks.map((task, index) => `
              <div class="speak-card">
                <span class="mode-tag">任务 ${index + 1} · ${task.tag}</span>
                <p>${meta(task)}</p>
                <div class="block-meta">示例</div>
                <p class="zh">${task.sampleZh}</p>
                <p class="ja">${task.sampleJa}</p>
              </div>`).join('')}
          </div>
        </section>

        <section class="panel-block">
          <div class="panel-head">
            <h3>课后任务 Homework</h3>
            <span>完成一项打一项</span>
          </div>
          <ul class="homework-list">
            ${homeworkItems.map((item, index) => `
              <li class="homework-item">
                <span class="homework-num">${String(index + 1).padStart(2, '0')}</span>
                <div>
                  <p class="zh">${item.zh}</p>
                  <p class="ja">${item.ja}</p>
                </div>
              </li>`).join('')}
          </ul>
        </section>
      </div>`;
  }

  function renderDaily() {
    const panel = $('#dailyPanel');
    if (!panel) return;

    const zhDate = new Intl.DateTimeFormat('zh-CN', { month: 'long', day: 'numeric', weekday: 'short' }).format(new Date());
    const jaDate = new Intl.DateTimeFormat('ja-JP', { month: 'long', day: 'numeric', weekday: 'short' }).format(new Date());
    const key = `daily-${dateKey()}`;
    const state = store.get(key, { checked: [], custom: [] });
    const open = store.get('daily-open', true);
    const tasks = [
      { zh: '跟读标准句，声带和录音一起动。', ja: '基本文を声に出してシャドーイングする。' },
      { zh: '用“在、有、是”介绍你的学校或房间。', ja: '在・有・是で学校か部屋を紹介する。' },
      { zh: '造两个“动词 + 的 + 名词”短语。', ja: '「動詞＋的＋名詞」のフレーズを2つ作る。' },
      { zh: '问一次路，再回答一次。', ja: '道の尋ね方と答え方を1回ずつ言う。' },
      { zh: '录一分钟语音发给老师。', ja: '1分間の音声を録音して先生に送る。' }
    ].concat(state.custom.map((text, index) => ({ zh: text, custom: true, index })));

    const checkedSet = new Set(state.checked);
    const doneCount = tasks.filter((task, index) => checkedSet.has(index)).length;
    const homeProgress = $('#homeProgress');
    if (homeProgress) {
      homeProgress.textContent = `${doneCount} / ${tasks.length}`;
    }
    panel.classList.toggle('collapsed', !open);

    panel.innerHTML = `
      <div class="daily-inner">
        <div class="daily-top">
          <div class="daily-heading">
            <span class="pin-mark">${svg('pin')}</span>
            <div class="daily-title">
              <h3>每日口语小练习</h3>
              <p>${zhDate} ／ ${jaDate}</p>
            </div>
          </div>
          <div class="daily-actions">
            <div class="daily-meter">
              <strong><span data-done-count>${doneCount}</span> / ${tasks.length}</strong>
              <div class="progress-track" role="progressbar" aria-valuenow="${doneCount}" aria-valuemax="${tasks.length}">
                <div class="progress-fill" data-progress style="width:${tasks.length ? Math.round(doneCount * 100 / tasks.length) : 0}%"></div>
              </div>
            </div>
            <button class="daily-toggle" type="button" data-daily-toggle aria-expanded="${open}">
              ${svg('chevron')}<span>${open ? '收起' : '展开'}</span>
            </button>
          </div>
        </div>
        <div class="daily-body" ${open ? '' : 'hidden'}>
          <ul class="daily-list">
            ${tasks.map((task, index) => `
              <li class="daily-item ${checkedSet.has(index) ? 'done' : ''}">
                <input type="checkbox" id="daily-task-${index}" ${checkedSet.has(index) ? 'checked' : ''} data-daily-index="${index}">
                <label for="daily-task-${index}">
                  <span class="check-box">${svg('check')}</span>
                  <span>${task.zh}${task.ja ? `<span class="task-ja">${task.ja}</span>` : ''}</span>
                </label>
              </li>`).join('')}
          </ul>
          <form class="daily-custom" data-add-task>
            <input type="text" maxlength="60" placeholder="给自己加一句今日练习" aria-label="新增今日练习">
            <button class="daily-reset" type="submit">加一句</button>
          </form>
          <button class="daily-reset" type="button" data-reset-daily data-reset-label>
            ${svg('reset')}<span>重开今日</span>
          </button>
        </div>
      </div>`;

    const toggle = panel.querySelector('[data-daily-toggle]');
    if (toggle) {
      toggle.addEventListener('click', () => {
        store.set('daily-open', !open);
        renderDaily();
      });
    }

    const form = panel.querySelector('[data-add-task]');
    if (form) {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const input = form.querySelector('input');
        const text = input.value.trim();
        if (!text) return;
        state.custom.push(text);
        store.set(key, state);
        renderDaily();
      });
    }

    const resetButton = panel.querySelector('[data-reset-daily]');
    if (resetButton) {
      resetButton.addEventListener('click', () => {
        store.set(key, { checked: [], custom: [] });
        renderDaily();
      });
    }
  }

  function renderDailyMini() {
    renderDaily();
  }

  function setupDailyChange() {
    document.addEventListener('change', (event) => {
      const input = event.target.closest('[data-daily-index]');
      if (!input) return;
      const key = `daily-${dateKey()}`;
      const state = store.get(key, { checked: [], custom: [] });
      const index = Number(input.dataset.dailyIndex);
      const next = new Set(state.checked);
      if (input.checked) {
        next.add(index);
      } else {
        next.delete(index);
      }
      state.checked = Array.from(next);
      store.set(key, state);
      renderDaily();
    });
  }

  function setupTextToggles() {
    const section = $('#textbookContent');
    const pyToggle = $('#showPy');
    const jaToggle = $('#showJa');
    if (!section || !pyToggle || !jaToggle) return;
    const sync = () => {
      section.classList.toggle('hide-py', !pyToggle.checked);
      section.classList.toggle('hide-ja', !jaToggle.checked);
    };
    pyToggle.addEventListener('change', sync);
    jaToggle.addEventListener('change', sync);
    sync();
  }

  function injectHiveIcons() {
    $$('[data-icon]').forEach((el) => {
      el.innerHTML = svg(el.dataset.icon);
    });
  }

  const viewIds = ['home', 'textbook', 'listening', 'practice'];

  function showView(name) {
    if (name === 'daily') {
      store.set('daily-open', true);
      renderDaily();
      const panel = $('#dailyPanel');
      if (panel) panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      activateNav('daily');
      return;
    }

    if (name !== 'home') {
      store.set('daily-open', false);
      renderDaily();
    }

    viewIds.forEach((viewId) => {
      const section = document.getElementById(viewId === 'home' ? 'homeView' : viewId);
      if (section) section.hidden = viewId !== name;
    });

    activateNav(name);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function activateNav(name) {
    $$('.topnav [data-view]').forEach((link) => {
      const active = link.dataset.view === name || (link.dataset.view === 'home' && name === 'home');
      link.classList.toggle('is-active', active);
    });
  }

  function setupRouter() {
    document.addEventListener('click', (event) => {
      const trigger = event.target.closest('[data-view]');
      if (!trigger) return;
      event.preventDefault();
      showView(trigger.dataset.view);
    });
  }

  function setupOfflineCache() {
    if (!('serviceWorker' in navigator)) return;
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(() => {
        // offline caching is optional
      });
    });
  }

  function setupListeningEvents() {
    document.addEventListener('click', (event) => {
      const reveal = event.target.closest('[data-reveal]');
      if (reveal) {
        const card = reveal.closest('.track-card');
        const script = card && card.querySelector('.track-script');
        if (!script) return;
        const isOpen = script.classList.toggle('open');
        script.hidden = !isOpen;
        reveal.classList.toggle('on', isOpen);
        reveal.setAttribute('aria-expanded', String(isOpen));
        reveal.querySelector('svg').outerHTML = svg(isOpen ? 'eyeOff' : 'eye');
        reveal.querySelector('span').textContent = isOpen ? '隐藏文本' : '文本';
        return;
      }

      const option = event.target.closest('[data-option]');
      if (option) {
        const quiz = option.closest('.quiz');
        if (!quiz || quiz.classList.contains('answered')) return;
        const feedback = quiz.querySelector('.quiz-feedback');
        const allButtons = $$('[data-option]', quiz);
        allButtons.forEach((button) => {
          button.classList.remove('correct', 'wrong');
          button.disabled = false;
        });
        if (option.dataset.correct === '1') {
          option.classList.add('correct');
          feedback.className = 'quiz-feedback good';
          feedback.textContent = '答对了。';
          quiz.classList.add('answered');
        } else {
          option.classList.add('wrong');
          feedback.className = 'quiz-feedback try';
          feedback.textContent = '再听一遍。';
        }
        return;
      }

      const speed = event.target.closest('[data-speed]');
      if (speed) {
        const audio = speed.closest('.track-card').querySelector('audio');
        const rates = [1, 0.8, 0.6];
        const current = audio.playbackRate || 1;
        const next = rates[(rates.indexOf(current) + 1) % rates.length];
        audio.playbackRate = next;
        speed.textContent = `${next.toFixed(1)}x`;
      }
    });
  }

  function setupPracticeEvents() {
    document.addEventListener('click', (event) => {
      const checkButton = event.target.closest('[data-check-blanks]');
      if (!checkButton) return;
      let correct = 0;
      const blanks = $$('.blank-item');
      blanks.forEach((blank) => {
        const select = blank.querySelector('.blank-select');
        const state = blank.querySelector('.state');
        const chosen = select ? select.value : '';
        const isOk = chosen === blank.dataset.answer;
        blank.classList.remove('ok', 'bad');
        blank.classList.add(isOk ? 'ok' : 'bad');
        state.textContent = isOk ? '正确' : `答案：${blank.dataset.answer}`;
        if (isOk) correct += 1;
      });
      checkButton.textContent = `${svg('check')}重新检查`;
      checkButton.innerHTML = `${svg('check')}重新检查`;
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderTextbook();
    renderListening();
    renderPractice();
    renderDailyMini();
    setupTextToggles();
    setupDailyChange();
    setupListeningEvents();
    setupPracticeEvents();
    setupRouter();
    setupOfflineCache();
    injectHiveIcons();
    const hash = window.location.hash.replace('#', '');
    const target = viewIds.includes(hash) || hash === 'daily' ? hash : 'home';
    if (target === 'daily') {
      showView('home');
      showView('daily');
    } else {
      showView(target);
    }
  });
})();
