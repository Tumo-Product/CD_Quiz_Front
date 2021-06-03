const view = {
    loaderOpen: true,
	rotations: [3, -3],
	name: '<div id="name"><h1></h1></div>',
	questions: `<div id="questions">`,
	progress: 0,

	createContainer: (i) => {
		let container =
		`<div id="${i}" class="container">
			<div id="questionName">
				<h2></h2>
			</div>
			<div id="score">
				<h2></h2>
			</div>
			</div>
		</div>`;

		$(".parent").eq(1).prepend(container);
	},

    setButtons: (list, i) => {
        let html = "";
        let id = 0;
		
        for (let question of list) {
            html += view.createButton(question.text, id);
            id++;
        }

        $(function() {
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
	onPLay: (length) => {
		$("#play").addClass("widen");

		$("#start").addClass("left");
		$(`#_1`).addClass("right");

		for (let i = 0; i < length; i++) {
			if (i > 1) {
				$(`#_${i}`).addClass("offscreenRight");
			}
			
			$(`#_${i}`).css("transform", "rotate(0deg)");
		}

		$("#_0").css("transform", "rotate(0deg)");

		$("#play").attr("onclick", "").unbind("click");
	},
    createButton: (val, id) => {
        return `<div><button onclick="onButtonClick(${id})" id ="${id}">` + val + "</button></div>";
    },
    changeColor: (id, color) => {
        document.getElementById(id).style.backgroundColor = color;
    },
    setQuestionName: (qname, i, rotate) => {
        $(`#_${i} #questionName h2`).html(qname);

		if (rotate) {
			$(`#_${i}`).css("transform", `rotate(${view.rotations[i]}deg)`);
		}
    },
	
    drawStartingScreen: (name, i) => {
		view.createContainer(i);

        $(`#${i}`).append(view.name);

        $(`#${i} #name h1`).html(name);
        $("body").append('<div id="play" onclick="onPlay()"><div><img src="graphics/play-fill.svg" alt="My Happy SVG"/></div></div>');
    },

    drawEndingScreen: (i) => {
		view.createContainer("_" + i);

		$(`#_${i}`).addClass("offscreenRight");
        
    },
	updateScore: (text, score, i) => {
		console.log(parser.finalScoreString(text, score));
		$(`#_${i} #score h2`).html(parser.finalScoreString(text, score));
	},
	swipe: (i) => {
		$("#_" + (i - 1)).removeClass("right left center offscreenRight");
		$("#_" + (i + 1)).removeClass("right left center offscreenRight");
		$("#_" + (i)).removeClass("right left center offscreenRight");

		if (i == 1) {
			$("#start").addClass("offscreen");
		} else {
			$("#_" + (i - 2)).addClass("offscreen");
		}

		$("#_" + i).addClass("center");
		$("#_" + (i - 1)).addClass("left");
	},
	updateProgressBar: (step) => {
		console.log(step);
		view.progress += step;
		$("#play div").css("margin-left", `${view.progress}px`);
	}
}
