module.exports = {
  createUrl: function(page, filters) {
    const API_PATH = process.env.API_PATH;
    let apiUrl;
    if (filters.text) {
      apiUrl = `${API_PATH}/anime?page[limit]=10&page[offset]=${page}`;
      apiUrl += `&filter[text]=${filters.text}`;
    } else {
      apiUrl = `${API_PATH}/anime?sort=popularityRank&page[limit]=10&page[offset]=${page}`;
    }

    if (filters.status) {
      apiUrl += `&filter[status]=${filters.status}`;
    }

    if (filters.genres) {
      apiUrl += `&filter[genres]=${filters.genres}`;
    }
    return apiUrl;
  },
};
