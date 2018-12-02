import Vuex from 'vuex'

import mutations from './mutations'
import actions from './actions'
import getters from './getters'

const createStore = () => {
    return new Vuex.Store({
        state: {
            client: undefined,
        },
        mutations,
        actions,
        getters
    })
};

export default createStore;