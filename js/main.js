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
    revenue(250000, 325000);
    workinghours(176, 100);
}