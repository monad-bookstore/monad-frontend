export default {
    isAuthenticated: state => state.client.self !== undefined,
    /**
     * Client related data getters.
     */
    client: state => state.client.self,
    addresses: state => state.client.collections.addresses,
    contacts: state => state.client.collections.contacts,
    cart: state => state.cart.products,
    /**
     * Site related data getters.
     */
    authors: state => state.data.authors,
    products: state => state.data.products,
    categories: state => state.data.categories,
    countries: state => state.data.countries,
    /**
     * UI related data getters.
     */
    snackbar: state => state.snackbar,
}