const view = {
    loaderOpen: true,
    setButtons: (list) => {
        let html = "";
        let id = 0;
        for (let question of list) {
            html += view.createButton(question.text, id);
            id++;
        }

        $(function() {
            $("#questions").append(html);
        })
    },
    toggleLoadingScreen: () => {
        if (view.loaderOpen) {
            $("#loadingScreen").hide();
            view.loaderOpen = false;
        } else {
            $("#loadingScreen").show();
            view.loaderOpen = true;
        }
    },
    createButton: (val, id) => {
        return `<div><button onclick="onButtonClick(${id})" id ="${id}">` + val + "</button></div>";
    },
    changeColor: (id, color) => {
        document.getElementById(id).style.backgroundColor = color;
    },
    setQuestionName: (qname) => {
        $("#questionName").html(qname);
    },
    drawStartingScreen: (name) => {
        $("#name").html(name);
        $("#name").after('<img id="play" onclick="onPlay()" src="graphics/play-fill.svg" alt="My Happy SVG"/>');
    },
    drawEndingScreen: (score) => {
        view.hideElement("questionName");
        $("#score").html(`Score ${score}`);
    },
    hideElement: (id) => {
        $(function() {
            $("#" + id).hide();
        });
    },
    showElement: (id) => {
        $(function() {
            $("#" + id).show();
        });
    }
}
