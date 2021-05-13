axios.defaults.baseURL = "https://blackboxbasic.herokuapp.com/";

const parser = {
    dataFetch: async () => {
        let response = await fetch(config.query_url);
        // return await response.json();
        
        return axios.get('/quiz/list');
    }
}