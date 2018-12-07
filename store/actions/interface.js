export default {
    show_message({ commit }, message) {
        commit('SET_MESSAGE', message)
    },
    clear_message({ commit }) {
        commit('CLEAR_MESSAGE')
    }
}