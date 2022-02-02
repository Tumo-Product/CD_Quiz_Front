axios.defaults.baseURL = "https://content-tools.tumo.world:4000/";

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
            finalString = impact[index];
            rating = index;
        }

        if (finalString.includes("%{scr}") || finalString.includes("%{popImp}")) {
            finalString = finalString.replace("%{scr}", score);
            finalString = finalString.replace("%{popImp}", score * 2100000);
            return finalString;
        }

        let matches = finalString.match(/\{.+?\}/g);
        if (matches !== null) {
            let operations = [];
            let strings = matches.map(function(str) {
                let slicedString = str.slice(1, -1)
                operations.push(slicedString);
                return str;
            });

            let values = [];
            for (let i = 0; i < operations.length; i++) {
                const runExpression = new Function("score", "return " + operations[i]);
                let oldScore = score;
                score = runExpression(score);
                values.push(score.toFixed(3));
                score = oldScore;

                finalString = finalString.replace(strings[i], values[i]);
            }
        }
        return finalString;
    }
}