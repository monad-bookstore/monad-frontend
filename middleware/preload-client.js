export default async function({ store }) {
    if (store.state.client === undefined)
        return store.dispatch('retrieve_client')
    
    return true
}