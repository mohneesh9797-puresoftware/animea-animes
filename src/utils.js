module.exports = {
  createUrl: function(page, filters) {
    const API_PATH = process.env.API_PATH;
    let apiUrl = `${API_PATH}/anime?sort=popularityRank&page[limit]=10&page[offset]=${page}`;
    if (filters.text) {
      apiUrl += `&filter[text]=${filters.text}`;
    }

    if (filters.status) {
      apiUrl += `&filter[status]=${filters.status}`;
    }

    if (filters.genres) {
      apiUrl += `&filter[genres]=${filters.genres}`;
    }
    console.log(apiUrl)
    return apiUrl;
  },
};
