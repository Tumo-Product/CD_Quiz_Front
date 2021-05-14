const flow_data = {
    set_data    : {},
    index       : 0,
    score       : 0,
} 

const onPageLoad = async () => {
    let data = await parser.dataFetch();
    flow_data.set_data = data.data.data[0];
    view.drawStartingScreen(flow_data.set_data.name);
    view.toggleLoadingScreen();
}

const nextQuestion = () => {
    document.getElementById("questions").innerHTML = "";
    if (flow_data.index + 1 != flow_data.set_data.questions.length) {
        implementQuestion(flow_data.set_data.questions[++flow_data.index]);
    } else {
        view.drawEndingScreen("Ajvapnvaiv advnapvdapv opvjadovjapovjadoj vaodvj aopv a %{scr} nkapngpanfpanbpafnsbpkfsn bpsfknbapsnfbaspfnbsapbfnsfpknspbnsfbo %{scr} sfbsbffsbfsbsfbfs", flow_data.score);
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
