export default async function({ store }) {
    if (Object.values(store.state.data).includes(undefined)) {
        return Promise.all([
            store.dispatch('request_author_collection'),
            store.dispatch('request_product_collection'),
            store.dispatch('request_category_collection'),
            store.dispatch('request_country_collection')
        ])
    }
    
    return true
}