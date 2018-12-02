export default {
    retrieve_client({ commit }) {
        return this.$axios.get('/api/authentication/client').then((response) => {
            commit('SET_CLIENT', response.data)
        }).catch((e) => {})
    },
    retrieve_authors({ commit }) {
        return this.$axios.get('/api/privileged/authors/get').then((response) => {
            commit('SET_AUTHORS', response.data)
        }).catch((e) => {})
    },
    retrieve_products({ commit }) {
        return this.$axios.get('/api/privileged/books/get').then((response) => {
            commit('SET_PRODUCTS', response.data)
        }).catch((e) => {})
    },
    retrieve_categories({ commit }) {
        return this.$axios.get('/api/categories/get').then((response) => {
            commit('SET_CATEGORIES', response.data)
        }).catch((e) => {})
    }
}