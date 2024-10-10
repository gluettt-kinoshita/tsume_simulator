
/**
 * 入力画面からシミュレーション結果画面に遷移
 */
function toResult() {
    const uriage = $("#in_uriage").val();
    const tanka = $("#in_tanka").val();
    const kyuryo = $("#in_kyuryo").val();
    const zikan = $("#in_zikan").val();

    // TODO:入力チェック

    location.href = `result.html?u=${uriage}&t=${tanka}&k=${kyuryo}&z=${zikan}`;
}

