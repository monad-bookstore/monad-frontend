export default {
    /**
     * Global interface control data mutations.
     */
    SET_MESSAGE(state, message) {
        state.snackbar.display = true
        state.snackbar.message = message
    },
    CLEAR_MESSAGE(state) {
        state.snackbar.display = false
        state.snackbar.message = ''
    },
}