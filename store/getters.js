export default {
    isAuthenticated: state => state.client !== undefined,
    client: state => state.client
}