import Cookie from 'js-cookie'
export default ({ store, app, $axios }, inject) => {
    inject('client', {
        reload: function() {
            return store.dispatch('request_client_data')
        },
        privileged: function(...privileges) {
            const client = store.getters.client
            const privilege = _.get(client, "accessFlag", -1)
            return privileges.includes(privilege)
        }
    }),
    inject('AccessLevel', {
        ADMINISTRATOR: 1,
        MANAGER: 2,
        SUPPORT: 3,
        EMPLOYEE: 4
    })
};