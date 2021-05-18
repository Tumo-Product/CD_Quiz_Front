const flow_data = {
    set_data    : {},
    index       : 0,
    score       : 0,
} 

const onPageLoad = async () => {

    let get_url =  document.location.href;
    var url = new URL(get_url);
    var _uid = url.searchParams.get("_uid");
    _uid = _uid.substr(1, _uid.length - 2);
    let data = await parser.dataFetch(_uid);
    console.log(data.data.data);
    flow_data.set_data = data.data.data;
    view.drawStartingScreen(flow_data.set_data.name);
    view.toggleLoadingScreen();
}

const nextQuestion = () => {
    document.getElementById("questions").innerHTML = "";
    if (flow_data.index + 1 != flow_data.set_data.questions.length) {
        implementQuestion(flow_data.set_data.questions[++flow_data.index]);
    } else {
        view.drawEndingScreen(flow_data.set_data.answer, flow_data.score);
    }
}

const implementQuestion = (question) => {
    view.setQuestionName(question.text);
    view.setButtons(question.answers);
}

const onButtonClick = (id) => {
    view.changeColor(id, "grey");
    flow_data.score += flow_data.set_data.questions[flow_data.index].answers[id].points;
    nextQuestion();
}

const onPlay = () => {
    view.hideElement("name");
    view.hideElement("play");
    implementQuestion(flow_data.set_data.questions[0]);
}

$(onPageLoad())
