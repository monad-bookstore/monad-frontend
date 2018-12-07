export default {
    request_client_data({ commit }) {
        return this.$axios.get('/api/authentication/client').then((response) => {
            commit('SET_CLIENT', response.data)
        });
    },
    request_client_addresses({ commit }) {
        return this.$axios.get('/api/client/addresses').then((response) => {
            commit('SET_ADDRESS_COLLECTION', response.data)
        });
    },
    request_client_contacts({ commit }) {
        return this.$axios.get('/api/client/numbers').then((response) => {
            commit('SET_CONTACTS_COLLECTION', response.data)
        });
    }
}