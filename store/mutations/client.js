export default {
    /**
     * Client object mutations.
     */
    SET_CLIENT(state, client) {
        state.client.self = client
    },
    
    CLEAR_CLIENT(state) {
        state.client.self = undefined
    },
    /**
     * Client additional data mutations.
     */
    SET_ADDRESS_COLLECTION(state, collection) {
        state.client.collections.addresses = collection
    },
    SET_CONTACTS_COLLECTION(state, collection) {
        state.client.collections.contacts = collection
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