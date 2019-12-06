module.exports = {
    createUrl: function (page, filters) {
        const API_PATH = process.env.API_PATH;
        var apiUrl = `${API_PATH}/anime?page[offset]=${page}`
        console.log(filters)
        if (filters.text) {
            apiUrl += `&filter[text]=${filters.text}`
        }

        if (filters.status) {
            apiUrl += `&filter[status]=${filters.status}`
        }

        if (filters.genres) {
            apiUrl += `&filter[genres]=${filters.genres}`
        }

        console.log(apiUrl)
        return apiUrl;
    }
}