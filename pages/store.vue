<template>
    <v-content class="content-overlay">
        <v-toolbar dense class="elevation-1 rounded-0 monad-toolbar store-toolbar" absolute>
            <v-toolbar-side-icon @click="options.drawer = !options.drawer"></v-toolbar-side-icon>
            <v-toolbar-title class="font-raleway-regular">Parduotuvė</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
                <v-text-field class="v-store-search-field pa-0 mt-2" append-icon="search" label="Ieškoti knygos" 
                    v-model="searchedBy" single-line hide-details clearable></v-text-field>
            </v-toolbar-items>
            <!-- <template v-if="$client.privileged($AccessLevel.ADMINISTRATOR, $AccessLevel.MANAGER)">
                <v-toolbar-items>
                    <v-btn icon @click="options.administrator.panel = true"> 
                        <v-icon>fas fa-cog</v-icon>
                    </v-btn>
                </v-toolbar-items>
            </template> -->
        </v-toolbar>
        <div class="v-store-container">
            <div class="v-store-wrapper">
                <v-navigation-drawer v-model="options.drawer" absolute width="330" floating class="v-store-drawer">
                    <v-list>
                        <v-list-tile>
                            <v-list-tile-title class="font-weight-light">
                                Naujausios
                            </v-list-tile-title>
                        </v-list-tile>
                        <v-list-group v-for="category in category_dividers" :key="category.id">
                            <v-list-tile slot="activator">
                                <v-list-tile-title>{{ category.label }}</v-list-tile-title>
                            </v-list-tile>
                            <v-list-tile @click="categorizedBy = child_category.id" v-for="child_category in treeOf(category.id)" 
                                :key="child_category.id" :value="categorizedBy == child_category.id" active-class="v-store-category-active">
                                <v-list-tile-title class="font-weight-light">{{ child_category.label }}</v-list-tile-title>
                            </v-list-tile>
                        </v-list-group>
                    </v-list>
                </v-navigation-drawer>
                <v-card height="100%" width="100%" color="transparent">
                    <v-layout wrap justify-center>
                        <v-flex xs12 shrink class="mb-5">
                            <v-toolbar color="grey lighten-5 elevation-0">
                                <v-spacer></v-spacer>
                                <v-menu v-model="options.sorter" :close-on-content-click="true"
                                    :nudge-bottom="40">
                                    <v-btn flat slot="activator">
                                        Rikiuoti pagal kainą
                                    </v-btn>
                                    <v-card>
                                        <v-card-title class="pa-1">
                                            <v-btn icon @click="filteredBy = 2">
                                                <v-icon>fas fa-sort-amount-up</v-icon>
                                            </v-btn>
                                            <v-spacer></v-spacer>
                                            <v-btn icon @click="filteredBy = 3">
                                                <v-icon class="fa-rotate-180">fas fa-sort-amount-up</v-icon>
                                            </v-btn>
                                        </v-card-title>
                                    </v-card>
                                </v-menu>
                            </v-toolbar>
                        </v-flex>
                        <template v-if="collections.products !== undefined && collections.products.length > 0">
                            <v-flex class="pa-2" shrink v-for="product in collections.products" :key="product.id">
                                <v-layout justify-center>
                                    <v-book :product="product"></v-book>
                                </v-layout>                           
                            </v-flex>
                        </template>
                        <template v-else>
                            <v-layout row justify-center>
                                    <v-card flat color="transparent">
                                        <v-card-text>
                                            <template v-if="categorizedBy == -1 && (searchedBy === undefined || searchedBy === '')">
                                                Knygų parduotuvėje nėra.
                                            </template>
                                            <template v-else-if="categorizedBy != -1">
                                                Atsiprašome, šioje kategorijoje knygų nėra.
                                            </template>
                                            <template v-else>
                                                Pagal jūsų paieškos užklausą knygų nerasta.
                                            </template>
                                        </v-card-text>
                                    </v-card>
                            </v-layout>
                        </template>
                    </v-layout>
                </v-card>
            </div>
        </div>
        <!-- <v-dialog v-if="$client.privileged($AccessLevel.ADMINISTRATOR, $AccessLevel.MANAGER)"  
            v-model="options.administrator.panel" fullscreen hide-overlay transition="dialog-bottom-transition" scrollable>
            <v-card tile>
                <v-toolbar card color="white">
                    <v-btn icon @click="options.administrator.panel = false">
                        <v-icon>close</v-icon>
                    </v-btn>
                    <v-toolbar-title>Parduotuvės valdymas</v-toolbar-title>
                </v-toolbar>
                <v-privileged-panel :client="client">
                    </v-privileged-panel>
            </v-card>
        </v-dialog> -->
    </v-content>
</template>
<script>

    import { mapGetters } from 'vuex';
    export default {

        middleware: ['preload-client', 'authenticated', 'preload-data'],
        mounted() {
            //this.$store.dispatch('retrieve_categories')            
            //this.$store.dispatch('retrieve_store_data')       
        },
        data() {
            return {
                options: {
                    drawer: false,
                    sorter: false,
                    administrator: {
                        panel: false
                    }
                },
                collections: {
                    products: this.products
                },
                filteredBy: 1,
                categorizedBy: -1,
                searchedBy: ''
            }
        },
        computed: {
            ...mapGetters([
                'client', 'categories', 'products'
            ]),
            category_dividers: function() {
                return _.filter(this.categories, function(category) {
                    return category.parentId == null
                })
            }
        },
        methods: {
            treeOf(parent) {
                return _.filter(this.categories, function(category){
                    return category.parentId == parent;
                })
            },
            search(input) {
                this.categorizedBy = -1;
                if (input === undefined || input === null || input.length < 3) {
                    this.collections.products = this.products
                    return
                }

                this.categorizedBy = -1
                const searching = input.toLowerCase()
                this.collections.products = _.filter(this.products, function(product) {
                    const authors_match = _.sumBy(product.authors, ({name, surname}) =>
                        name != null && name != undefined && name.toLowerCase().indexOf(searching) > -1 ||
                        surname != null && surname != undefined && surname.toLowerCase().indexOf(searching) > -1)

                    return ((product.title !== null && product.title !== undefined) && product.title.toLowerCase().indexOf(searching) > -1) || authors_match > 0
                })
            },
            sortBy(products) {
                switch(this.filteredBy) {
                    // Filtering by creation date.
                    case 1:
                        return _.orderBy(products, ['id'], ['desc'])
                    // Filtering by price descending.
                    case 2:
                        return _.orderBy(products, ['price'], ['desc'])
                    // Filtering by price ascending.
                    case 3:
                        return _.orderBy(products, ['price'], ['asc'])
                }

                this.filteredBy = 1
                return _.orderBy(products, ['id'], ['desc'])
            },
            categorizeBy(category) {
                if (category < 1) {
                    this.collections.products = this.products
                    return
                }

                this.collections.products = _.filter(this.products, function(product) {
                    return product.categoryId == category
                })
            }
        },
        components: {
            "v-book": require("~/components/store/BookComponent.vue").default
        },
        watch: {
            products(changed, _) {
                this.collections.products = this.sortBy(changed)
            },
            filteredBy(changed, _) {
                this.collections.products = this.sortBy(this.products)
            },
            categorizedBy(changed, _) {
                this.categorizeBy(changed)
            },
            searchedBy(changed, _) {
                this.search(changed)
            }
        }
    }

</script>
<style lang="scss">

    .store-toolbar {
        border-top: 1px solid rgba($color: #000000, $alpha: 0.1);
    }

    .v-store-container {
        height: 100%;
        padding-top: 51px;
        .v-store-wrapper {
            height: 100%;  
            position: relative;
        }
    }

    .v-store-category-active {
        background-color: rgba($color: #000000, $alpha: 0.1) !important;
    }

    .v-store-search-field {
        width: 220px !important;
    }

    .v-store-drawer {
        border-right: 1px solid rgba($color: #000000, $alpha: 0.3);
    }

</style>
