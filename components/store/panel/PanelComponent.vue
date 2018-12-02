<template>
    <v-tabs dark ripple color="primary" class="panel-toolbar">
        <v-tab>
            Prekių peržiūra
        </v-tab>
        <v-tab-item>
            <v-privileged-store-items
                :authors="preloaded.authors" :products="preloaded.products"></v-privileged-store-items>
        </v-tab-item>
        <v-tab>
            Prekių pridėjimas
        </v-tab>
        <v-tab-item>
            <v-privileged-product-addition :authors="preloaded.authors" :categories="preloaded.parented_categories">
                </v-privileged-product-addition>
        </v-tab-item>
    </v-tabs>
</template>
<script>

    export default 
    {
        data: () => ({
            /**
             * Data preloaded and used inside control panel.
             */
            preloaded: {
                products: null,
                authors: null,
                categories: null,
                /**
                 * Categories that has parent id set.
                 * Categories without parent id is simply a dividers.
                 */
                parented_categories: null
            }
        }),
        components: {
            "v-privileged-store-items": require("~/components/store/panel/PanelProductListing.vue").default,
            "v-privileged-product-addition": require("~/components/store/panel/PanelProductAddition.vue").default
        },
        props: 
        {
            client: {
                type: Object,
                required: true
            }
        },
        /**
         * Event registry, data preload.
         */
        mounted() {
            this.$nuxt.$on('AUTHORS_PRELOAD', this.fetch_authors())
            this.$nuxt.$on('PRODUCTS_PRELOAD', this.fetch_products())
            this.$nuxt.$on('CATEGORIES_PRELOAD', this.fetch_categories())
            this.preload()
        },
        /**
         * Component methods.
         */
        methods: {
            /**
             * Function used to combine multiple required requests.
             */
            preload() {
                this.fetch_authors()
                this.fetch_products()
                this.fetch_categories()
            },
            /**
             * Retrieve all authors from database.
             */
            fetch_authors() {
                this.$axios.get('/api/privileged/authors/get').then((response) => {
                    this.preloaded.authors = response.data
                })
            },
            /**
             * Retrieve all products(books) from database.
             * Used word "products" because I don't like how word "books" looks.
             */
            fetch_products() {
                this.$axios.get('/api/privileged/books/get').then((response) => {
                    this.preloaded.products = response.data
                })
            },
            /**
             * Retrieve all categories from database.
             */
            fetch_categories() {
                this.$axios.get('/api/categories/get').then((response) => {
                    this.preloaded.categories = response.data
                    this.preloaded.parented_categories = _.filter(this.preloaded.categories, function(category) {
                        return category.parentId !== null
                    })
                })
            }
        }
    }

</script>
<style lang="scss" scoped>
    
    .panel-toolbar {
        border-top: 1px solid rgba($color: white, $alpha: 0.2);
    }

</style>
