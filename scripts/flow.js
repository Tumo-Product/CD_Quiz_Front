const flow_data = {
	set_data: {},
	index: 0,
	score: 0,
}

let progWidth = 300 - 60;
let step = 0;

const onPageLoad = async () =>
{
	let def = "Id not found";
	let get_url = document.location.href;
	let url = new URL(get_url);
	let _uid = url.searchParams.get("_uid");

	if (_uid)
	{
		_uid = _uid.substr(1, _uid.length - 2);
		let data = await parser.dataFetch(_uid);
		flow_data.set_data = data.data.data;

		view.drawStartingScreen(flow_data.set_data.description, "start");
		$("#start #questionName").hide();

		for (let i = 0; i < flow_data.set_data.questions.length; i++)
		{
			generateCards(flow_data.set_data.questions[i], i, true);
		}

		view.drawEndingScreen(flow_data.set_data.questions.length);

		view.toggleLoadingScreen();
	}
	else
		alert("_uid not found");
}

const nextQuestion = () =>
{
	if (flow_data.index + 1 <= flow_data.set_data.questions.length)
	{
		let i = ++flow_data.index;

		changeCard(flow_data.set_data.questions[i], i, true);

		step = progWidth / flow_data.set_data.questions.length;
		view.updateProgressBar(step);
		
		if (i ==  flow_data.set_data.questions.length) {
			view.updateScore(flow_data.set_data.answer, flow_data.score, flow_data.set_data.questions.length);
		}
	}
}

const generateCards = (question, i, rotate, right) =>
{
	view.createContainer("_" + i);
	view.setQuestionName(question.text, i, rotate);
	view.setButtons(question.answers, i);
}

const changeCard = (question, i, right) =>
{
	view.swipe(i);

	if (right)
	{
		$(`#_${i + 1}`).addClass("right");
	}
}

const onButtonClick = (id) =>
{
	flow_data.score += flow_data.set_data.questions[flow_data.index].answers[id].points;
	nextQuestion();
}

const onPlay = () =>
{
	// implementQuestion(flow_data.set_data.questions[0]);
	view.onPLay(flow_data.set_data.questions.length);
}

$(onPageLoad())
