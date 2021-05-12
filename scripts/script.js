let loaderHidden = true;

$(function () {
    if (loaderHidden) {
        $("#loadingScreen").hide();
    } else {
        $("#loadingScreen").show();
    }
});

async function getData() {
    const response = await fetch("../test.json");
    const json = await response.json();
    return json;
}

getData().then(data => {
    let sets = data.sets;

    for (let section of sets) {
        let name = section.name;
        $("#name").html(name);

        for (let question of section.questions) {
            if (!Array.isArray(question)) {
                if (typeof(question) !== "object") {
                    $(".questions").append("<div><button>" + question + "</button></div>");
                }
            }
        }

        break;
    }
});