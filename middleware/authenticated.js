export default async function({ store, redirect }) {
    if (store.state.client.self === undefined)
        return redirect('/signin')
    return true
}