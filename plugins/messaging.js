export default ({ store, app, $axios }, inject) => {
    inject('message', {
        show: function(message) {
            store.dispatch('show_message', message)
        }
    })
};