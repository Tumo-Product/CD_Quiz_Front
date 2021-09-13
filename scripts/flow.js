const flow_data = {
	set_data: {},
	index: 0,
	score: 0,
	answer_image: "",
}

let oldScore = -1;
let selected = 0;
let progWidth = 317-30;
let step = 0;

const timeout = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const onPageLoad = async () =>
{
	let get_url = document.location.href;
	let url = new URL(get_url);
	let _uid = url.searchParams.get("_uid");

	if (_uid)
	{
		_uid = _uid.substr(1, _uid.length - 2);
		let data = await parser.dataFetch(_uid);
		flow_data.set_data = data.data.data;
		// flow_data.set_data.multipleChoice = true; // test
		// flow_data.set_data.maxAnswers = 5;
		flow_data.answer_image = flow_data.set_data.answer_image;

		view.drawStartingScreen(flow_data.set_data.description);

		for (let i = 0; i < flow_data.set_data.questions.length; i++)
		{
			generateCards(flow_data.set_data.questions[i], i, true, i > 1, flow_data.set_data.questions[i].image);
		}

		view.drawEndingScreen(flow_data.set_data.questions.length);

		await timeout(1500);
		view.fitText(".questionName h2", 190);
		
		view.toggleLoadingScreen();
	}
	else
		alert("_uid not found");
}

const nextQuestion = async () =>
{
	await timeout(view.swipeDelay);
	if (flow_data.index + 1 <= flow_data.set_data.questions.length)
	{
		let l = flow_data.set_data.questions.length;
		let i = ++flow_data.index;

		if (i > 0) {
			view.showUndo();
		}

		if (i != l) changeCard(i);
		updateProgress(false);
		
		if (i == l - 2) view.setupEnd(l, flow_data.answer_image);
		if (i == l) {
			view.updateScore(flow_data.set_data.answer, Number(flow_data.score.toFixed(6)), flow_data.set_data.questions.length);
			await timeout(600);
			changeCard(i);
			view.collectCards(flow_data.set_data.questions.length);
		}
	}
}

const generateCards = (question, i, rotate, invisible, image) =>
{
	view.createContainer("_" + i, invisible, image);
	view.setQuestionName(question.text, i, rotate);
	view.setButtons(question.answers, i);
}

const changeCard = (i) =>
{
	view.swipe(i);
}

const onButtonClick = (id) =>
{
	if (flow_data.set_data.multipleChoice !== true) {
		oldScore = flow_data.score;
		flow_data.score += parseFloat(flow_data.set_data.questions[flow_data.index].answers[id].points);
		nextQuestion();
	}
}

const onPlay = () =>
{
	if (flow_data.set_data.maxAnswers !== undefined) {
		$(".statusBar").css("opacity", 1);
		$(".statusBar span").eq(2).text(flow_data.set_data.maxAnswers);
	}

	view.onPlay(flow_data.set_data.questions.length);
	if (flow_data.set_data.multipleChoice === true)
		view.showContinue();
}

const onUndo = () => {
	flow_data.score = oldScore;
	changeCard(--flow_data.index);

	if (flow_data.index < 1) {
		view.hideUndo();
	}

	updateProgress(true);
}

const toggleButton = (i) => {
	let parent = $(`#_${flow_data.index}`);
	let answer = flow_data.set_data.questions[flow_data.index].answers[i];
	if (answer.selected === undefined) answer.selected = false;

	if (selected + 1 > flow_data.set_data.maxAnswers && (answer.selected == false))
		return;
	
	answer.selected = !answer.selected;

	if (answer.selected === true) {
		view.enableClick(parent, i);

		
		selected++;
	}
	else {
		view.disableClick(parent, i);
		selected--;
	}

	$(".statusBar span").eq(0).text(selected);
}

const onContinue = () => {
	let answers = flow_data.set_data.questions[flow_data.index].answers;
	let score = 0;
	for (let i = 0; i < answers.length; i++) {
		if (answers[i].selected === true) {
			score += parseFloat(answers[i].points);
		}
	}

	if (score == 0) return;

	oldScore = flow_data.score;
	flow_data.score += parseFloat(score);
	nextQuestion();
}

const updateProgress = (undo) => {
	step = progWidth / flow_data.set_data.questions.length;

	view.updateProgressBar(undo ? -step : step);
}

$(onPageLoad())