export default {
    created() {
        const privileges = this.$options.privileges
        if (privileges !== undefined) {
            const client = this.$store.getters.client
            if (!privileges.includes(client.accessFlag)) {
                this.$router.push('/')
            }
        }
    },
}