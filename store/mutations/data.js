export default {
    /**
     * Site data mutations.
     */
    SET_AUTHORS(state, authors) {
        state.data.authors = authors
    },
    SET_PRODUCTS(state, products) {
        state.data.products = products
    },
    SET_CATEGORIES(state, categories) {
        state.data.categories = categories
    },
    SET_COUNTRIES(state, countries) {
        state.data.countries = countries
    }
}