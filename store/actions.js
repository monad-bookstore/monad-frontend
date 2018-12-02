export default {
    retrieve_client({ commit }) {
        return this.$axios.get('/api/authentication/client').then((response) => {
            commit('SET_CLIENT', response.data)
        }).catch((e) => {})
    }
}