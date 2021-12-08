axios.defaults.baseURL = "https://blackboxbasic.herokuapp.com/";

const parser = {
    dataFetch: async (_uid) => {
        return axios.get(config.query_url + _uid);
    },
    finalScoreString: (text, score) => {
        let finalString = text;
        let questionLength = flow_data.set_data.questions.length;

        if (finalString.includes("\n\n")) {
            const impact = finalString.split("\n\n");
            
            let max     = (questionLength * 3) - questionLength;
            let value   = score - questionLength;
            let index   = Math.round((value * 2) / max);

            console.log(impact);
            console.log(max, value, index);
            finalString = impact[index];
        }

        finalString = finalString.replace("%{scr}", score);
        finalString = finalString.replace("%{popImp}", score * 2100000);
        return finalString;
    }
}