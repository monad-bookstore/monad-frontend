export default async function({ store }) {
    if (store.getters['administrative/clients'].length < 1) {
        return Promise.all([
            store.dispatch('administrative/request_client_collection')
        ])
    }
    
    return true
}
