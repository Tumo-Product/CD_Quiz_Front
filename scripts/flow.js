const flow_data = {
    set_data    : {},
    index       : 0,
    score       : 0,
} 

const onPageLoad = async () => {
    let data = await parser.dataFetch();
    flow_data.set_data = data;
    view.drawStartingScreen(flow_data.set_data.name);
    view.toggleLoadingScreen();
}

const nextQuestion = () => {
    if (flow_data.index + 1 != flow_data.set_data.questions.length) {
        implementQuestion(flow_data.set_data.questions[++flow_data.index]);
    }
}

const implementQuestion = (question) => {
    document.getElementById("questions").innerHTML = "";
    view.setQuestionName(question.text);
    view.setButtons(question.answers);
}

const onButtonClick = (id) => {
    view.changeColor(id, "grey");
    flow_data.score += flow_data.set_data.questions[flow_data.index].answers[id].points;
    nextQuestion();
}

const onPlay = () => {
    $("#name").hide();
    $("#play").hide();
    implementQuestion(flow_data.set_data.questions[0]);
}

$(onPageLoad())
