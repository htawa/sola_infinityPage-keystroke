// ==UserScript==
// @name         sola_チャレダンページキー操作スクリプト
// @version      0.2
// @author       ssz
// @match        http://lostartifact.xsrv.jp/SoLA/infinity.php
// @match        http://lostartifact.xsrv.jp/SoLA/battle.php
// @updateURL   https://github.com/htawa/sola_infinityPage-keystroke/raw/main/script/sola_infinityPage-keystroke.user.js
// @downloadURL https://github.com/htawa/sola_infinityPage-keystroke/raw/main/script/sola_infinityPage-keystroke.user.js
// ==/UserScript==

//  チャレダンのページ送りをキーボードで操作できるようにするスクリプトです。
//
//  使い方
//  - キャラクター選択ページ：何もしません。（たぶん）
//  - イベント選択ページ：1,2,3でイベント選択、Enterでイベントを選ぶ。イベントを選択せずにEnterを押しても無視されるので空送信されることはありません。
//  - 間のページ：Enterで進みます。
//  - 戦闘ログ：Enterでチャレダンページに進みます、敗北した場合は進みません。
//
//  当スクリプトの使用については自己責任でお願いします。

(function() {
    'use strict';
    // evAutoCheck (bool) - 自動でイベントを選択する場合はtrueに、しない場合はfalseに。
    // priority (array[string]) - 先にある方から優先的に選択します、ここに無い選択肢が現れた場合は自動選択されません。
    const config = {};
    config.evAutoCheck = true;
    config.priority = [
        "多くの気配を感じる……（次の戦闘時、敵に１～２体の増援。代わりに、この挑戦中ずっと、敵の強さをそこそこ弱体化）",
        "凄まじいプレッシャーを感じる……！（次の戦闘のみ敵を大きく強化。代わりに、この挑戦中ずっと、敵の強さをそこそこ弱体化）",
        "まばゆい光が見える！（この挑戦の間ずっと、敵の強さを少し弱体化）",
        "テレポーターだ！（１階層進む）",
        "落とし穴だ……！（１階層進むが、次の戦闘時、生存者全員にダメージ）",
        "光の壁だ！（次の戦闘時、障壁を付与）",
        "安全そうな部屋を見つけた！（次の戦闘時、味方のパッシブスキル発動率アップ）",
        "猫だ。（次の戦闘時、ランダムな良い効果）",
        "ラッキー！　エリクサーだ！（戦闘不能者全員のHPを1回復。次の戦闘時、全員にHP・SP回復効果）",
        "スシだ。（次の戦闘時、生存者全員にHP・SP回復＋連続行動率アップ）",
        "温泉だ！（次の戦闘時、生存者全員にHP回復＋治癒＋HPRが上がる）",
        "傷薬が落ちている！（次の戦闘時、生存者全員にHP回復効果）",
        "淡い輝く泉を発見した……（次の戦闘時、生存者全員にSP回復効果）",
        "どこかから風を感じる……（次の戦闘時、連続行動率＋100%でスタート）",
        "突如現れた辻プリースト！　一体何者なんだ……（次の戦闘時、生存者全員に祝福＋加護）",
        "美味しそうな湧き水を発見した！（全員の状態異常を治療）",
        "魔法陣が描かれている！（次の戦闘時、ATK・MATKが上がる）",
        "消耗品の魔導書が落ちている！（次の戦闘時、ランダムなスキルが発動）",
        "ギルドのメンバーが増援に駆けつけた！（次の戦闘時、味方ＮＰＣが追加）",
        "呪いのお札が落ちている……（次の戦闘時、敵全体にランダムな状態異常）",
        "火炎瓶が落ちている！（次の戦闘時、敵全体にダメージ＋火傷）",
        "忍者だ。（次の戦闘時、敵単体に猛烈なダメージ）",
        "杖が落ちている……（次の戦闘時、生存者全員に光撃）",
        "石像が立っている……（戦闘不能者全員のHPを1回復）",
        "特に何もない通路だ……",
        "敵の背後を取ることができた……（次の戦闘時、敵の隊列が逆転）",
        "空気が薄い……？（次の戦闘時、生存者全員の受けるHP減効果が増加）",
        "何故か美味しそうなおにぎりが落ちている……（次の戦闘時、ランダムな回復効果。たまに痛んでいる）",
        "キノコだ。（次の戦闘時、生存者全員にランダムな状態異常or障壁）",
        "見たことのない薬だ……（次の戦闘時、生存者全員のランダムなステータス1種が上がるor下がる）",
        "扉がある……？（次の戦闘時、ランダムな味方一人に小ダメージ）",
        "蜘蛛の巣だ……（次の戦闘時、生存者全員のSPDが下がる）",
        "辺り一面、深い霧に包まれている……（次の戦闘時、HIT・MHITが下がる）",
        "カビだらけの道だ……（次の戦闘時、生存者全員のHPRが下がる）",
        "強烈な電流が走っている……！（次の戦闘時、生存者全員にダメージ＋麻痺効果）",
        "一面の毒沼だ……（次の戦闘時、生存者全員にダメージ＋猛毒効果）",
        "どうやらガスが発生しているようだ……（次の戦闘時、生存者全員にダメージ＋衰弱効果）",
        "先へと進む通路が燃えている……！（次の戦闘時、生存者全員にダメージ＋火傷効果）",
        "思わず押したくなる、魅力的なスイッチだ！（次の戦闘時、敵・味方全員にダメージ＋猛毒＋衰弱）",
        "地獄の業火が通路を塞いでいる……！（次の戦闘時、生存者全員に肉体異常効果）",
        "謎の靄が発生している……（次の戦闘時、生存者全員に精神異常効果）",
        "エッチな本が落ちている……！（主導者に魅了＋狼狽）",
        "急な坂道だ……（次の戦闘時、味方のパッシブスキル発動率ダウン）",
        "……ここを通るのは危険だ！　直感が告げている！（次の戦闘時、生存者全員に強烈なダメージ）",
        "まずい！　背後を取られた！（次の戦闘時、味方の隊列が逆転）",
        "なんだか酷く寒い……（次の戦闘時、生存者全員に停止）",
        "粘性の液体がたっぷりと撒き散らされている……（次の戦闘時、生存者全員に遅延効果）",
        "テレポーターだ！（１階層戻る）",
        "何だか嫌な予感がする……（この挑戦の間ずっと、敵の強さを少し強化）",
    ];
    //
    const pageId = ["infinity", "battle"];
    const page = function() {
        const match = window.location.pathname.match(new RegExp(pageId.join("|"), "g"));
        return match === null ? null : match[0];
    };
    const pageName = page();
    if(pageName === null) return;
    // チャレダンページ
    page[pageId[0]] = function() {
        const inputs = document.getElementsByTagName("input");
        if(!inputs.giveup) return;
        inputs.giveup.remove();
        const id = ["choose", "challenge"].find(function(v) {return this[v];}, inputs);
        if(!id) return;
        const radios = id === "choose" ? Array.from(inputs).filter(input => input.type === "radio") : null;
        const func = {};
        func.lockEnter = false;
        func.Enter = function() {
            if(!!radios) {
                if(!radios.find(v => v.checked)) return;
            }
            this.lockEnter = true;
            inputs[id].click();
        };
        func.Num = function(num) {
            radios[num].checked = true;
        };
        if(!!radios　&& config.evAutoCheck) {
            (() => {
                const texts = radios.map(radio => radio.parentNode.nextSibling.textContent + radio.parentNode.nextSibling.nextSibling.textContent);
                console.log(radios, texts);
                const m = texts.map(text => config.priority.indexOf(text));
                let def = 0;
                for(let i = 0; i < m.length; i++) {
                    const v = m[i];
                    if(v < 0) return console.error(texts[i]);
                    if(v < m[def]) def = i;
                }
                radios[def].checked = true;
            })();
        }
        document.body.addEventListener("keydown", function(ev) {
            if(ev.key === "Enter" && !func.lockEnter) func.Enter();
            else if(/^[1|2|3]$/.test(ev.key) && !!radios) func.Num(parseInt(ev.key, 10) - 1);
        });
    };
    // 戦闘ログ
    page[pageId[1]] = function() {
        const func = {};
        func.lockEnter = false;
        func.Enter = function() {
            this.lockEnter = true;
            const a = (() => {
                const c = document.getElementsByTagName("a");
                for(let i = c.length - 1; i >= 0; i--) {
                    const a = c[i];
                    if(a.textContent === "チャレンジダンジョンメニューに戻る") return a;
                }
                return null;
            })();
            if(!a) return;
            const win = a.previousSibling.previousElementSibling.previousElementSibling.previousSibling.textContent;
            if(/バトルに勝利した！$/.test(win)) a.click();
        };
        document.body.addEventListener("keydown", function(ev) {
            if(ev.key === "Enter" && !func.lockEnter) func.Enter();
        });
    };
    //
    page[pageName]();
})();
