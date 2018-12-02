export default {
    isAuthenticated: state => state.client !== undefined,
    client: state => state.client,
    authors: state => state.data.authors,
    products: state => state.data.products,
    categories: state => state.data.categories,
    filtered_categories: state => _.filter(state.data.categories, function(category) {
        return category.parentId !== null
    })
}