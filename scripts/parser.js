axios.defaults.baseURL = "https://blackboxbasic.herokuapp.com/";

const parser = {
    dataFetch: async () => {
        let response = await fetch(config.query_url);
        // return await response.json();
        
        return axios.get('/quiz/list');
    },
    finalScoreString: (text, score) => {
        let splitText = text.split("%{scr}");
        let finalString = "";

        for (let i  = 0; i < splitText.length - 1; i++) {
            finalString += splitText[i] + score;
        }
        
        finalString += splitText[splitText.length - 1];

        return finalString;
    }
}