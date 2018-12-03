export default {
    /**
     * API data managing. 
     */
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
    },
    SET_ADDRESSES(state, addresses) {
        state.specifics.addresses = addresses
    },
    SET_NUMBERS(state, numbers) {
        state.specifics.numbers = numbers
    },
    SET_SUPPORTED_COUNTRIES(state, countries) {
        state.specifics.countries = countries
    },
    SET_STORE_PRODUCTS(state, products) {
        state.store.products = products
    },
    /**
     * Messaging
     */
    SHOW_SNACKBAR(state, message) {
        state.snackbar.display = true
        state.snackbar.message = message
    },
    CLEAR_SNACKBAR(state) {
        state.snackbar.display = false
        state.snackbar.message = ''
    },
    /**
     * Cart managing.
     */
    CART_ADD_PRODUCTS(state, product) {
        state.cart.products.push(product)
    },
    CART_REMOVE_PRODUCT(state, product) {
        state.cart.products = _.filter(state.cart.products, function(o) {
            return o.id !== product.id
        })
    },
    CART_CLEAR(state) {
        state.cart.products = []
    }
}