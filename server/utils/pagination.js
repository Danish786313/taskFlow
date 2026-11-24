function getPaginationParams(query = {}, defaultLimit = 10, maxLimit = 100) {
    const rawPage = parseInt(query.page, 10);
    const rawLimit = parseInt(query.limit || query.pageSize, 10);

    const page = !isNaN(rawPage) && rawPage > 0 ? rawPage : 1;
    const limit = !isNaN(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, maxLimit) : defaultLimit;
    const offset = (page - 1) * limit;

    return { page, limit, offset };
}

function formatPaginatedResponse(rows = [], count = 0, page = 1, limit = 10) {
    const totalPages = Math.ceil(count / limit) || 1;

    return {
        items: rows,
        pagination: {
            totalItems: count,
            currentPage: page,
            pageSize: limit,
            totalPages: totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        }
    };
}

module.exports = {
    getPaginationParams,
    formatPaginatedResponse
};
