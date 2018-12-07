export default {

    state: {
        collections: {
            clients: []
        }
    },
    mutations: {
        SET_CLIENT_COLLECTION(state, collection) {
            state.collections.clients = collection
        }
    },
    actions: {
        request_client_collection({ commit }) {
            return this.$axios.get('/api/privileged/clients/get').then((response) => {
                commit('SET_CLIENT_COLLECTION', response.data)
            })
        }
    },
    getters: {
        clients: state => state.collections.clients
    }
}