let loaderHidden = false;

$(function() {
    if (loaderHidden) {     
        $("#loadingScreen").hide();
    } else {
        $("#loadingScreen").show();
    }
});