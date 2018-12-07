<template>
    <v-tabs dark ripple color="primary" class="panel-toolbar">
        <v-tab>
            Prekių peržiūra
        </v-tab>
        <v-tab-item>
            <v-privileged-store-items
                :authors="authors" :products="products"></v-privileged-store-items>
        </v-tab-item>
        <v-tab>
            Prekių pridėjimas
        </v-tab>
        <v-tab-item>
            <v-privileged-product-addition :authors="authors" :categories="filtered_categories">
                </v-privileged-product-addition>
        </v-tab-item>
    </v-tabs>
</template>
<script>

    import { mapGetters } from 'vuex';
    export default 
    {
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
                this.$store.dispatch('request_author_collection')
                this.$store.dispatch('request_product_collection')
                this.$store.dispatch('request_category_collection')
            },
        },
        computed: {
            ...mapGetters([
                'authors', 'products', 'categories', 'filtered_categories'
            ])
        }
    }

</script>
<style lang="scss" scoped>
    
    .panel-toolbar {
        border-top: 1px solid rgba($color: white, $alpha: 0.2);
    }

</style>
