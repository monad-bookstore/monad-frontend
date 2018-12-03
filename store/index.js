import Vuex from 'vuex'

import mutations from './mutations'
import actions from './actions'
import getters from './getters'

const createStore = () => {
    return new Vuex.Store({
        state: {
            client: undefined,
            specifics: {
                addresses: undefined,
                numbers: undefined,
                countries: undefined
            },
            data: {
                authors: undefined,
                products: undefined,
                categories: undefined
            },
            snackbar: {
                display: false,
                message: ''
            }
        },
        mutations,
        actions,
        getters
    })
};

export default createStore;