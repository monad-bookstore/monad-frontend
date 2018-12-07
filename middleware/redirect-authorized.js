/**
 * Used in pages where which logged in clients should not see. 
 */
export default async function({ store, redirect }) {
    if (store.state.client.self !== undefined)
        return redirect('/')
    return true
}