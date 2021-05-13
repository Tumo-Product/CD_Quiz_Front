const view = {
  loaderOpen  : true,
  setButtons  : (list) => {
    let html = "";
    for (let question of list) {
      html += view.createButton(question.text);
    }
    $(".questions").append(html);
  },
  setName     : (val) => {
    $("#name").html(val);
  },
  switchLoad  : () => {
    if (view.loaderOpen) {
        $("#loadingScreen").hide();
        view.loaderOpen = false;
    } else {
        $("#loadingScreen").show();
        view.loaderOpen = true;
    }
  },
  createButton : (val) => {
    return "<div><button>" + val + "</button></div>";
  }
}
