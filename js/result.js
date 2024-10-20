// 客一人当たりの施術時間
const TREATMENT_TIME = 2; // 時間

// { name: プラン名, tsukigaku: 月額（万円）, hpb: HPB掲載料（万円）, percent: 売上（％）, description: 説明 }
const PLAN_STANDARD = { name: "スタンダードプラン", tsukigaku: 5, hpb: 3, percent: 15, description: "365日終日利用可" };
const PLAN_LIGHT = { name: "ライトプラン", tsukigaku: 2, hpb: 3, percent: 25, description: "365日終日利用可" };
const PLAN_LATE = { name: "レイトプラン", tsukigaku: 1.5, hpb: 1.5, percent: 25, description: "365日17時以降利用可" };

function createGraph(asis, tobe, canvasId, revenue) {
    const ctx = document.getElementById(canvasId);

    new Chart(ctx, {
        data: {
            labels: revenue ? ['現在の給与', '想定収入'] : ['現在の勤務時間', '想定勤務時間'],
            datasets: [
                {
                    type: 'line',
                    labe: null,
                    data: [asis, tobe],
                    borderColor: [
                        asis > tobe ? 'rgba(88, 111, 223, 0.7)' : 'rgba(192, 92, 167, 0.44)',
                    ],
                    borderWidth: 5,
                    borderDash: [5, 5], // 点線
                    pointRadius: 0,
                },
                {
                    type: 'bar',
                    //label: '# of Votes',
                    labe: null,
                    data: [asis, tobe],
                    backgroundColor: [
                        'rgba(220, 220, 220, 1)',
                        asis > tobe ? 'rgba(88, 111, 223, 0.7)' : 'rgba(192, 92, 167, 0.44)',
                    ],
                    borderWidth: 1,
                    maxBarThickness: 80,
                },

            ]
        },
        options: {
            scales: {
                y: {
                    display: false,
                    beginAtZero: true,

                },
                x: {
                    grid: {
                        display: true,  // X軸のグリッド線を表示
                        drawOnChartArea: false, // X軸のグリッド線をチャートエリアに描画しない
                        drawTicks: false // X軸の目盛り線も非表示
                    }
                }

            },
            plugins: {
                legend: {
                    display: false,
                    // labelString: {
                    //     font: {
                    //         size: 20
                    //     }
                    // }
                }
            }
        }
    });
}

function revenue(asis, tobe) {
    createGraph(asis, tobe, 'revenue_canvas', true);
}
function workinghours(asis, tobe) {
    createGraph(asis, tobe, 'workinghours_canvas', false);
}



function loaded() {
    const urlParams = new URLSearchParams(window.location.search);

    const uriage = parseInt(urlParams.get('u')); // 指名売上
    const tanka = parseInt(urlParams.get('t')); // 平均客単価
    const kyuryo = parseInt(urlParams.get('k')); // 現在の給料
    const zikan = parseInt(urlParams.get('z')); // 現在の勤務時間
    const plan = urlParams.get('p'); // プラン
    const containLatePlan = plan && plan.indexOf("late") != -1;

    console.log(`指名売上：${uriage}`);
    console.log(`平均客単価：${tanka}`);
    console.log(`現在の給料：${kyuryo}`);
    console.log(`現在の勤務時間：${zikan}`);
    console.log(`プラン：レイト${containLatePlan ? "含む" : "含まない"}`);

    // 収益計算
    calcAndDisplayRevenue(uriage, kyuryo, containLatePlan)

    // 勤務時間計算
    calcAndDisplayWorkinghours(uriage, tanka, zikan);

}

function calcAndDisplayRevenue(uriage, kyuryoBefore, containLatePlan) {

    const standardIncome = calcRevenue(uriage, PLAN_STANDARD);
    const lightIncome = calcRevenue(uriage, PLAN_LIGHT);
    const lateIncome = calcRevenue(uriage, PLAN_LATE);

    let maximumIncome;
    if (containLatePlan) {
        // レイトプランも含めての最大を取得
        maximumIncome = Math.max(standardIncome, lightIncome, lateIncome);
        $("#result_detail_lateplan").show();
    } else {
        maximumIncome = Math.max(standardIncome, lightIncome);
        $("#result_detail_lateplan").hide();
    }

    setText("#r_income_before", kyuryoBefore.toLocaleString());
    setText("#r_income_after", maximumIncome.toLocaleString());

    // スタンダードプラン
    setText("#r_plan1_name1", PLAN_STANDARD.name);
    setText("#r_plan1_name2", PLAN_STANDARD.name);
    setText("#r_plan1_description", PLAN_STANDARD.description);
    setText("#r_plan1_tsukigaku1", PLAN_STANDARD.tsukigaku);
    setText("#r_plan1_tsukigaku2", (PLAN_STANDARD.tsukigaku * 10000).toLocaleString());
    setText("#r_plan1_income", standardIncome.toLocaleString());
    setText("#r_plan1_uriage_ratio", PLAN_STANDARD.percent);
    setText("#r_plan1_hpb1", PLAN_STANDARD.hpb);
    setText("#r_plan1_hpb2", (PLAN_STANDARD.hpb * 10000).toLocaleString());
    setText("#r_plan1_uriage_ratio2", PLAN_STANDARD.percent);
    setText("#r_plan1_uriage_price", Math.floor(uriage * PLAN_STANDARD.percent / 100).toLocaleString());

    // ライトプラン
    setText("#r_plan2_name1", PLAN_LIGHT.name);
    setText("#r_plan2_name2", PLAN_LIGHT.name);
    setText("#r_plan2_description", PLAN_LIGHT.description);
    setText("#r_plan2_tsukigaku1", PLAN_LIGHT.tsukigaku);
    setText("#r_plan2_tsukigaku2", (PLAN_LIGHT.tsukigaku * 10000).toLocaleString());
    setText("#r_plan2_income", lightIncome.toLocaleString());
    setText("#r_plan2_uriage_ratio", PLAN_LIGHT.percent);
    setText("#r_plan2_hpb1", PLAN_LIGHT.hpb);
    setText("#r_plan2_hpb2", (PLAN_LIGHT.hpb * 10000).toLocaleString());
    setText("#r_plan2_uriage_ratio2", PLAN_LIGHT.percent);
    setText("#r_plan2_uriage_price", Math.floor(uriage * PLAN_LIGHT.percent / 100).toLocaleString());

    // レイトプラン
    if (containLatePlan) {
        setText("#r_plan3_name1", PLAN_LATE.name);
        setText("#r_plan3_name2", PLAN_LATE.name);
        setText("#r_plan3_description", PLAN_LATE.description);
        setText("#r_plan3_tsukigaku1", PLAN_LATE.tsukigaku);
        setText("#r_plan3_tsukigaku2", (PLAN_LATE.tsukigaku * 10000).toLocaleString());
        setText("#r_plan3_income", lateIncome.toLocaleString());
        setText("#r_plan3_uriage_ratio", PLAN_LATE.percent);
        setText("#r_plan3_hpb1", PLAN_LATE.hpb);
        setText("#r_plan3_hpb2", (PLAN_LATE.hpb * 10000).toLocaleString());
        setText("#r_plan3_uriage_ratio2", PLAN_LATE.percent);
        setText("#r_plan3_uriage_price", Math.floor(uriage * PLAN_LATE.percent / 100).toLocaleString());
    }

    // グラフに反映
    revenue(kyuryoBefore, maximumIncome);
}

/**
 *  想定売上からプランに応じた収益を計算
 */
function calcRevenue(uriage, plan) {
    // { name: プラン名, tsukigaku: 月額（万円）, hpb: HPB掲載料（万円）, percent: 売上（％）, description: 説明 }
    const revenue = uriage - (plan.tsukigaku * 10000) - (plan.hpb * 10000) - (uriage * plan.percent / 100);
    return Math.floor(revenue);
}


/**
 * 勤務時間の計算と画面への表示
 * @param {*} uriage 
 * @param {*} tanka 
 * @param {*} zikan 
 */
function calcAndDisplayWorkinghours(uriage, tanka, zikan) {
    const ninzu = Math.floor(uriage / tanka);
    const zikanAfter = ninzu * TREATMENT_TIME;

    setText("#wh_zikan_before", zikan);
    setText("#wh_zikan_after", zikanAfter);
    setText("#wh_zikan_after2", zikanAfter);
    setText("#wh_uriage_before", uriage.toLocaleString());
    setText("#wh_tanka", tanka.toLocaleString());
    setText("#wh_ninzu1", ninzu);
    setText("#wh_ninzu2", ninzu);
    setText("#wh_sekkyaku_zikan1", TREATMENT_TIME);
    setText("#wh_sekkyaku_zikan2", TREATMENT_TIME);

    // グラフに反映
    workinghours(zikan, zikanAfter);
}


let revenueDisplay = false;
function clickRevenueResult() {
    if (revenueDisplay) {
        $('#revenue_result').fadeOut();
    } else {
        $('#revenue_result').fadeIn();
    }
    revenueDisplay = !revenueDisplay;
}


let workinghoursDisplay = false;
function clickWorkinghoursResult() {
    if (workinghoursDisplay) {
        $('#workinghours_result').fadeOut();
    } else {
        $('#workinghours_result').fadeIn();
    }
    workinghoursDisplay = !workinghoursDisplay;
}


function setText(selector, text) {
    $(selector).html(escapeHtml(text));
}
function escapeHtml(text) {
    return text.toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}