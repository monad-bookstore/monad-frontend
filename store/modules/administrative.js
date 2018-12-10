export default {
    state: {
        collections: {
            clients: [],
            orders: []
        }
    },
    mutations: {
        SET_CLIENT_COLLECTION(state, collection) {
            state.collections.clients = collection
        },
        SET_ORDER_COLLECTION(state, collection) {
            state.collections.orders = collection
        },
    },
    actions: {
        request_client_collection({ commit }) {
            return this.$axios.get('/api/privileged/clients/get').then((response) => {
                commit('SET_CLIENT_COLLECTION', response.data)
            })
        },
        request_order_collection({ commit }) {
            return this.$axios.get('/api/privileged/orders/get').then((response) => {
                commit('SET_ORDER_COLLECTION', response.data)
            })
        },
    },
    getters: {
        clients: state => state.collections.clients,
        orders: state => state.collections.orders
    }
}