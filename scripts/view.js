const view = {
	loaderOpen: true,
	rotations: [3, -3],
	play:
		`<div id="play" onclick="onPlay()">
			<div id="hollow"></div>
			<div id="bar"></div>
			<div class="circle">
				<div></div>
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#9194E3" class="bi bi-play-fill" viewBox="0 0 16 16">
					<path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
				</svg>
			</div>
		</div>`
	,
	name: '<div id="name"><h1></h1></div>',
	questions: `<div class="questionsOverlay"></div><div id="questions">`,
	progress: 0,
	swipeDelay: 150,
	endSetup: false,

	createContainer: (i, invisible, image) => {
		let container =
			`<div id="${i}" class="container">
				<div class="questionName">
					<div class="circle"><div></div></div>
					<div class="circle"><div></div></div>
					<div class="circle"><div></div></div>
					<div class="circle"><div></div></div>
					<img src="${image}" alt="My Happy SVG"/>
					<h2></h2>
				</div>
				<div id="score">
					<h2></h2>
				</div>
				</div>
			</div>`;

		$(".parent").eq(1).prepend(container);
		if (image === undefined) {
			$(`#${i} img`).hide();
		}

		if (invisible) {
			$(`#${i}`).css("visibility", "hidden");
		}
	},

	setButtons: (list, i) => {
		let html = "";
		let id = 0;

		for (let question of list) {
			html += view.createButton(question.text, id);
			id++;
		}

		$(function () {
			$(`#_${i}`).append(view.questions);
			$(`#_${i} #questions`).append(html);

			if ($(`#_${i} .item`).length > 4) {
				$(`#_${i} #questions`).css("justify-content", "flex-start");
			}
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
	onPlay: (length) => {
		$("#play").addClass("straighten");
		$("#start").addClass("straighten");
		$("#bar").attr("style", "width: 0px !important");

		$(`#_1`).addClass("straighten");

		$("#play").addClass("widen");
		$("#hollow").addClass("widenHollow");

		$("#play .circle").addClass("goLeft");

		$("#start").addClass("left");
		$(`#_1`).addClass("right");

		$("#bar").addClass("smooth");

		for (let i = 0; i < length; i++) {
			if (i > 1) {
				$(`#_${i}`).addClass("offscreenRight");
				$(`#_${i}`).show();
			}

			$(`#_${i}`).attr("style", "transform: rotate(0deg) !important");
		}

		$(`#_${length}`).attr("style", "z-index: 15 !important");

		$("#play").attr("onclick", "").unbind("click");
		$("#play").attr("style", "cursor: initial !important");

		if (flow_data.set_data.multipleChoice !== true) {
			$("button").mousedown(function () {
				$(this).append(`<div class="click"></div>`);
				$(this).find(".click").css("opacity", 1);
			});
			$("button").mouseup(async function () {
				await timeout(view.swipeDelay);
				$(this).find(".click").remove();
			});
			$("button").mouseleave(function () {
				$(this).find(".click").remove();
			});
		}

		$("#undo").mousedown(function () {
			$(this).find("div").hide();
		});
		$("#undo").mouseup(async function () {
			$(this).find("div").show();
		});
		$("#undo").mouseleave(async function () {
			$(this).find("div").show();
		});
	},
	createButton: (val, id) => {
		if (flow_data.set_data.multipleChoice !== true) {
			return `<div class="item"><button onclick="onButtonClick(${id})" id="${id}">${val}</button></div>`;
		} else {
			return `<div class="item"><button onclick="toggleButton(${id})" id="${id}">${val}<div class="click"></div></button></div>`;
		}
	},
	enableClick: (parent, i) => {
		parent.find(`#${i}`).addClass("btnClicked");
	},
	disableClick: (parent, i) => {
		parent.find(`#${i}`).removeClass("btnClicked");
	},
	changeColor: (id, color) => {
		document.getElementById(id).style.backgroundColor = color;
	},
	setQuestionName: (qname, i, rotate) => {
		if (qname == "" || qname === undefined) {
			$(`#_${i} .questionName img`).css("display", "flex");
			$(`#_${i} .questionName`).css("justify-content", "center");
		}
		
		$(`#_${i} .questionName h2`).html(qname);

		if (rotate) {
			$(`#_${i}`).css("transform", `rotate(${view.rotations[i]}deg)`);
		}
	},

	drawStartingScreen: (name) => {
		view.createContainer("start");

		$(`#start`).append(view.name);

		$(`#start #name h1`).html(name);
		$("body").append(view.play);
		$("#start .questionName").hide();
	},

	drawEndingScreen: (i) => {
		view.createContainer("_" + i);

		$(`#_${i}`).addClass("offscreenRight");
	},
	updateScore: (text, score, i) => {
		view.hideUndo();
		
		let currScore = 0;
		if (text.includes("%{popImp}")) {
			currScore = score * 2100000;
		} else {
			currScore = score;
		}

		$(`#_${i}`).prepend(`<h1 id="scoreNum"></h1>`)
		text = parser.finalScoreString(text, score);
		if (text.includes(" : ")) {
			let header = text.split(" : ")[0];
			text = text.substring(text.indexOf(" : ") + 3);
			currScore = header;
			$(`#_${i} #scoreNum`).css("font-size", "30px");
		}

		$(`#_${i} #scoreNum`).html(currScore);
		$(`#_${i} #score h2`).html(text);
		view.fitText("#score h2", 219, true);

		$("#play svg").remove();
		$("#play").removeClass("widen");
		$("#hollow").removeClass("widenHollow");
		view.updateProgressBar(0, true);
	},
	setupEnd: (i, image) => {
		if (!view.endSetup) {
			$(`#_${i} .questionName`).hide();
			$(`#_${i}`).addClass("endingScreen");
			$(`#_${i}`).prepend(`<img id="outcome" src="${image}">`);
		}

		view.endSetup = true;
	},
	swipe: (i) => {
		$("#_" + (i - 1)).removeClass("right left center offscreenRight offscreen");
		$("#_" + (i + 1)).removeClass("right left center offscreenRight offscreen");
		$("#_" + (i)).removeClass("right left center offscreenRight offscreen");

		if (i == 1) {
			$("#start").addClass("offscreen");
		} else {
			$("#_" + (i - 2)).addClass("offscreen");
			$("#_" + (i + 2)).addClass("offscreenRight");
		}

		$(`#_${i + 1}`).addClass("right");
		$("#_" + i).addClass("center");
		// $(`#_${i} .click`).css("opacity", 0);
		$("#_" + (i - 1)).addClass("left");
	},
	updateProgressBar: async (step, reset) => {
		view.progress += step;

		$("#play .circle").attr("style", `left: ${view.progress}px !important`);
		$("#bar").attr("style", `width: ${view.progress + 25}px !important`);

		if (reset) {
			$("#play").addClass("endTransition");

			$("#play .circle").attr("style", `left: 0px !important`);
			$("#bar").attr("style", `width: 0px !important`);
			$("#play").attr("style", `width: 25px !important; left: 420px !important`);
			$("#hollow").attr("style", `width: 0px !important`);

			await timeout(500);
			$("#play").addClass("end");
		}
	},
	fitText: (name, height, changeLineHeight) => {
		let desiredHeight = height;

		$(name).each(function (i) {
			let size;

			if ($(this).prop("scrollHeight") <= desiredHeight && $(this).prop('scrollWidth') <= $(this).width()) {
				return true;
			}

			while ($(this).prop("scrollHeight") > desiredHeight || $(this).prop('scrollWidth') > $(this).width()) {
				fontSize   = parseFloat($(this).css("font-size"));
				$(this).css("font-size", fontSize - 0.5);

				if (changeLineHeight) {
					lineHeight = parseFloat($(this).css("line-height"), 10);
					$(this).css("line-height", `${lineHeight - 0.5}px`);
				}
			}
		});
	},
	showUndo: () => {
		$("#undo").css("display", "flex");
	},
	hideUndo: () => {
		$("#undo").hide();
	},
	showContinue: () => {
		$("#continue").css("display", "flex");
	},
	hideContinue: () => {
		$("#continue").hide();
	},
	collectCards: (lastIndex) => {
		for (let i = 1; i < 3; i++) {
			$(`#_${lastIndex - i}`).removeClass("right left center offscreenRight offscreen");
			$(`#_${lastIndex - i}`).addClass("center");
			$(`#_${lastIndex - i}`).css("transform", `rotate(${view.rotations[i - 1]}deg)`);
		}

		$(".statusBar").hide();
		$("#continue").hide();
	}
}
