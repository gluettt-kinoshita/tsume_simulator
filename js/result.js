// 客一人当たりの施術時間
const TREATMENT_TIME = 2; // 時間

// { name: プラン名, tsukigaku: 月額（万円）, hpb: HPB掲載料（万円）, percent: 売上（％） }
const PLAN_STANDARD = { name: "スタンダードプラン", tsukigaku: 5, hpb: 3, percent: 15 };
const PLAN_LIGHT = { name: "ライトプラン", tsukigaku: 2, hpb: 3, percent: 25 };

function createGraph(asis, tobe, canvasId, revenue) {
    const ctx = document.getElementById(canvasId);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: revenue ? ['現在の給与', '想定収入'] : ['現在の勤務時間', '想定勤務時間'],
            datasets: [{
                //label: '# of Votes',
                labe: null,
                data: [asis, tobe],
                backgroundColor: [
                    'rgba(200, 200, 200, 1)',
                    asis > tobe ? 'rgb(118, 149, 255)' : 'rgb(255, 152, 116)',
                ],
                borderColor: [
                    'rgba(200, 200, 200, 1)',
                    asis > tobe ? 'rgb(118, 149, 255)' : 'rgb(255, 152, 116)',
                ],
                borderWidth: 1,
                maxBarThickness: 100,
            }]
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
    console.log(`指名売上：${uriage}`);
    console.log(`平均客単価：${tanka}`);
    console.log(`現在の給料：${kyuryo}`);
    console.log(`現在の勤務時間：${zikan}`);

    // 収益計算
    calcAndDisplayRevenue(uriage, kyuryo)

    // 勤務時間計算
    calcAndDisplayWorkinghours(uriage, tanka, zikan);

}

function calcAndDisplayRevenue(uriage, kyuryoBefore) {

    const standardIncome = calcRevenue(uriage, PLAN_STANDARD);
    const lightIncome = calcRevenue(uriage, PLAN_LIGHT);

    const maximumIncome = Math.max(standardIncome, lightIncome);

    setText("#r_income_before", kyuryoBefore.toLocaleString());
    setText("#r_income_after", maximumIncome.toLocaleString());

    // スタンダードプラン
    setText("#r_plan1_name1", PLAN_STANDARD.name);
    setText("#r_plan1_name2", PLAN_STANDARD.name);
    setText("#r_plan1_tsukigaku1", PLAN_STANDARD.tsukigaku);
    setText("#r_plan1_tsukigaku2", (PLAN_STANDARD.tsukigaku * 10000).toLocaleString());
    setText("#r_plan1_income", standardIncome.toLocaleString());
    setText("#r_plan1_uriage_ratio", PLAN_STANDARD.percent);
    setText("#r_plan1_hpb", (PLAN_STANDARD.hpb * 10000).toLocaleString());
    setText("#r_plan1_uriage_ratio2", PLAN_STANDARD.percent);
    setText("#r_plan1_uriage_price", (uriage * PLAN_STANDARD.percent / 100).toLocaleString());

    // ライトプラン
    setText("#r_plan2_name1", PLAN_LIGHT.name);
    setText("#r_plan2_name2", PLAN_LIGHT.name);
    setText("#r_plan2_tsukigaku1", PLAN_LIGHT.tsukigaku);
    setText("#r_plan2_tsukigaku2", (PLAN_LIGHT.tsukigaku * 10000).toLocaleString());
    setText("#r_plan2_income", lightIncome.toLocaleString());
    setText("#r_plan2_uriage_ratio", PLAN_LIGHT.percent);
    setText("#r_plan2_hpb", (PLAN_LIGHT.hpb * 10000).toLocaleString());
    setText("#r_plan2_uriage_ratio2", PLAN_LIGHT.percent);
    setText("#r_plan2_uriage_price", (uriage * PLAN_LIGHT.percent / 100).toLocaleString());

    // グラフに反映
    revenue(kyuryoBefore, maximumIncome);
}

/**
 *  想定売上からプランに応じた収益を計算
 */
function calcRevenue(uriage, plan) {
    // { name: プラン名, tsukigaku: 月額（万円）, hpb: HPB掲載料（万円）, percent: 売上（％） }
    return uriage - (plan.tsukigaku * 10000) - (plan.hpb * 10000) - (uriage * plan.percent / 100);
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
    setText("#wh_uriage_before", uriage);
    setText("#wh_tanka", tanka);
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