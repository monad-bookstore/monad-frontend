import Vuex from 'vuex'

import mutations from './mutations'
import actions from './actions'
import getters from './getters'

import administrative from './modules/administrative'

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
            /**
             * Interface
             */
            snackbar: {
                display: false,
                message: ''
            },
            /**
             * Session cart.
             */
            cart: {
                products: []
            },
        },
        mutations,
        actions,
        getters,
        modules: {
            administrative: {
                namespaced: true,
                ...administrative
            }
        }
    })
};

export default createStore;