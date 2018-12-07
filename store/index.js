import Vuex from 'vuex'

import mutations from './mutations'
import actions from './actions'
import getters from './getters'

const createStore = () => {
    return new Vuex.Store({
        state: {
            /**
             * Base client information object.
             */
            client: {
                self: undefined,
                collections: {
                    addresses: undefined,
                    contacts: undefined,
                }
            },
            /**
             * Site containing data.
             */
            data: {
                authors: undefined,
                products: undefined,
                categories: undefined,
                countries: undefined
            },

            store: {
                products: undefined
            },
            snackbar: {
                display: false,
                message: ''
            },
            cart: {
                products: []
            }
        },
        mutations,
        actions,
        getters
    })
};

export default createStore;