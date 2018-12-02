export default {
    SET_CLIENT(state, client) {
        state.client = client
    },
    CLEAR_CLIENT(state) {
        state.client = undefined
    }
}