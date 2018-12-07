export default {
    request_author_collection({ commit }) {
        return this.$axios.get('/api/privileged/authors/get').then((response) => {
            commit('SET_AUTHORS', response.data)
        });
    },
    request_product_collection({ commit }) {
        return this.$axios.get('/api/store/products').then((response) => {
            commit('SET_PRODUCTS', response.data)
        });
    },
    request_category_collection({ commit }) {
        return this.$axios.get('/api/categories/get').then((response) => {
            commit('SET_CATEGORIES', response.data)
        });
    },
    request_country_collection({ commit }) {
        return this.$axios.get('/api/addresses/supported_country_list').then((response) => {
            commit('SET_COUNTRIES', response.data)
        });
    },
}