function createGraph(asis, tobe, canvasId) {
    const ctx = document.getElementById(canvasId);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['現在の給与', '想定収入'],
            datasets: [{
                //label: '# of Votes',
                labe: null,
                data: [asis, tobe],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                ],
                borderWidth: 1,
                maxBarThickness: 60,
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
    createGraph(asis, tobe, 'revenue_canvas');
}
function workinghours(asis, tobe) {
    createGraph(asis, tobe, 'workinghours_canvas');
}



function loaded() {
    const urlParams = new URLSearchParams(window.location.search);

    const uriage = urlParams.get('u'); // 指名売上
    const tanka = urlParams.get('t'); // 平均客単価
    const kyuryo = urlParams.get('k'); // 現在の給料
    const zikan = urlParams.get('z'); // 現在の勤務時間
    console.log(uriage);
    console.log(tanka);
    console.log(kyuryo);
    console.log(zikan);




    revenue(250000, 325000);
    workinghours(176, 100);
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