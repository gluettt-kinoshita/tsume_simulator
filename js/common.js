/**
 * トップに戻る
 * @returns 
 */
function toTop() {
    $('body,html').animate({
        scrollTop: 0
    }, 500);
    return false;
}