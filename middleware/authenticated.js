export default async function({ store, redirect }) {
    if (store.state.client === undefined)
        return redirect('/signin')
    return true
}