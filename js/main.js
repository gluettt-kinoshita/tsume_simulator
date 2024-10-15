
/**
 * 入力画面からシミュレーション結果画面に遷移
 */
function toResult() {
    const uriage = $("#in_uriage").val();
    const tanka = $("#in_tanka").val();
    const kyuryo = $("#in_kyuryo").val();
    const zikan = $("#in_zikan").val();

    // 入力チェック
    let error = !Validator.required("#in_uriage");
    error |= !Validator.required("#in_tanka");
    error |= !Validator.required("#in_kyuryo");
    error |= !Validator.required("#in_zikan");

    if (error) {
        return;
    }

    location.href = `result.html?u=${uriage}&t=${tanka}&k=${kyuryo}&z=${zikan}`;
}

const Validator = {
    // 必須チェック
    required(selector) {
        const inputVal = $(selector).val();

        if (!inputVal) {
            $(`${selector}_err`).text("入力してください。");
            return false;
        } else {
            $(`${selector}_err`).text("");
        }
        return true;
    },

}

