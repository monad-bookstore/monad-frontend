export default async function({ store }) {
    if (store.state.client.self === undefined)
        return store.dispatch('request_client_data')
    
    return true
}