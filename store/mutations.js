export default {
    SET_CLIENT(state, client) {
        state.client = client
    },
    CLEAR_CLIENT(state) {
        state.client = undefined
    },
    SET_AUTHORS(state, authors) {
        state.data.authors = authors
    },
    SET_PRODUCTS(state, products) {
        state.data.products = products
    },
    SET_CATEGORIES(state, categories) {
        state.data.categories = categories
    }
}