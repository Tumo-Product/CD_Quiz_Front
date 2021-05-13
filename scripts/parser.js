const parser = {
  dataFetch : async () => {
    let response = await fetch(config.query_url);
    return await response.json();
  }
}
