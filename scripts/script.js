let loaderHidden = true;

async function getData() {
    const response = await fetch("../test.json");
    const json = await response.json();
    return json;
}

let points = 3;

$(function () {
    if (loaderHidden) {
        $("#loadingScreen").hide();
    } else {
        $("#loadingScreen").show();
    }

    getData().then(data => {
        let sets = data.sets;
        let html = "";
    
        let questions = [];
        let testSet = sets[2];
    
        let name = testSet.name;
        $("#name").html(name);
    
        for (let question of testSet.questions) {
            html += "<div><button>" + question.text + "</button></div>";
            questions.push(question);
        }
        
        // console.log(questions);
        $(".questions").append(html);

        $(".questions").on("click", "button", function() {
            let question = $(this).text();
            for (let q of questions) {
                if (question == q.text) {
                    points += parseInt(q.points);
                }
            }

            console.log(points);
        });
    });
});