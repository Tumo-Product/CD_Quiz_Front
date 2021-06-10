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
	questions: `<div id="questions">`,
	progress: 0,
	swipeDelay: 150,

	createContainer: (i, invisible) => {
		let container =
			`<div id="${i}" class="container">
			<div class="questionName">
				<div class="circle"><div></div></div>
				<div class="circle"><div></div></div>
				<div class="circle"><div></div></div>
				<div class="circle"><div></div></div>
				<img src="graphics/play-fill.svg" alt="My Happy SVG"/>
				<h2></h2>
			</div>
			<div id="score">
				<h2></h2>
			</div>
			</div>
		</div>`;

		$(".parent").eq(1).prepend(container);

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

		$(".item").mousedown(function () {
			$(this).append(`<div class="click"></div>`);
		});
		$(".item").mouseup(async function () {
			await timeout(view.swipeDelay);
			$(this).find(".click").remove();
		});
		$(".item").mouseleave(function () {
			$(this).find(".click").remove();
		});
	},
	createButton: (val, id) => {
		return `<div class="item"><button onclick="onButtonClick(${id})" id ="${id}">` + val + "</button></div>";
	},
	changeColor: (id, color) => {
		document.getElementById(id).style.backgroundColor = color;
	},
	setQuestionName: (qname, i, rotate) => {
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

		$("#play svg").remove();
		$("#play").removeClass("widen");
		$("#hollow").removeClass("widenHollow");
		view.updateProgressBar(0, true);

		$(`#_${i}`).addClass("endingScreen");
		$(`#_${i}`).prepend(`<h1 id="scoreNum">${score}</h1>`)
		$(`#_${i} .questionName`).hide();
		$(`#_${i} #score h2`).html(parser.finalScoreString(text, score));
		$(`#_${i}`).prepend(`<img src="graphics/play-fill.svg">`);
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
		$("#_" + (i - 1)).addClass("left");
	},
	updateProgressBar: async (step, reset) => {
		view.progress += step;

		$("#play .circle").attr("style", `left: ${view.progress}px !important`);
		$("#bar").attr("style", `width: ${view.progress + 27}px !important`);

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
	fitText: (name) => {
		$(`.${name} h2`).each(function (i) {
			let size;
			let desiredHeight = 160;

			while ($(this).prop("scrollHeight") > desiredHeight || $(this).prop('scrollWidth') > $(this).width()) {
				size = parseInt($(this).css("font-size"), 10);
				$(this).css("font-size", size - 3);
			}
		});
	},
	showUndo: () => {
		$("#undo").css("display", "flex");
	},
	hideUndo: () => {
		$("#undo").hide();
	},
	collectCards: (lastIndex) => {
		for (let i = 1; i < 3; i++) {
			$(`#_${lastIndex - i}`).removeClass("right left center offscreenRight offscreen");
			$(`#_${lastIndex - i}`).addClass("center");
			$(`#_${lastIndex - i}`).css("transform", `rotate(${view.rotations[i - 1]}deg)`);
		}
	}
}
