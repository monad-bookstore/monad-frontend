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
    },
    retrieve_client_addresses({ commit }) {
        return this.$axios.get('/api/client/addresses').then((response) => {
            commit('SET_ADDRESSES', response.data)
        }).catch((e) => {})
    },
    retrieve_client_numbers({ commit }) {
        return this.$axios.get('/api/client/numbers').then((response) => {
            commit('SET_NUMBERS', response.data)
        }).catch((e) => {})
    },
    retrieve_supported_countries({ commit }) {
        return this.$axios.get('/api/addresses/supported_country_list').then((response) => {
            commit('SET_SUPPORTED_COUNTRIES', response.data)
        }).catch((e) => {})
    },
    retrieve_store_data({ commit }) {
        return this.$axios.get('/api/store/products').then((response) => {
            commit('SET_STORE_PRODUCTS', response.data)
        }).catch((e) => {})
    },
    show_message({ commit }, message) {
        commit('SHOW_SNACKBAR', message)
    },
    clear_message({ commit }) {
        commit('CLEAR_SNACKBAR')
    }
}