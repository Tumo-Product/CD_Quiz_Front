let loaderHidden = true;

async function getData() {
    const response = await fetch("../test.json");
    const json = await response.json();
    return json;
}

let points = 3;

$(function () {

    getData().then(data => {
       
        

       

        // console.log(questions);


        // $(".questions").on("click", "button", function() {
        //     let question = $(this).text();
        //     for (let q of questions) {
        //         if (question == q.text) {
        //             points += parseInt(q.points);
        //         }
        //     }

        //     console.log(points);
        // });
    });
});
