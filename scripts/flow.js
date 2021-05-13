const onPageLoad = async () => {
    let data = await parser.dataFetch();
    let html = "";
    let name = data.name;
    console.log(data);
    view.setName(name);
    let questions = data.questions;
    view.setButtons(questions);
    view.switchLoad();
}

const drawQuestionList = (data) => {
    
}
$(onPageLoad())
