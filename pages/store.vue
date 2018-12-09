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
                        <v-list-tile @click="newest">
                            <v-list-tile-title class="font-weight-light">
                                Naujausios knygos
                            </v-list-tile-title>
                        </v-list-tile>
                        <v-list-group v-for="cat in category_dividers" :key="category.id">
                            <v-list-tile slot="activator">
                                <v-list-tile-title>{{ cat.label }}</v-list-tile-title>
                            </v-list-tile>
                            <v-list-tile @click="set_category(child_category)" v-for="child_category in treeOf(cat.id)" 
                                :key="child_category.id" :value="category.current !== undefined && category.current.id == child_category.id" active-class="v-store-category-active">
                                <v-list-tile-title class="font-weight-light">{{ child_category.label }}</v-list-tile-title>
                            </v-list-tile>
                        </v-list-group>
                    </v-list>
                </v-navigation-drawer>
                <v-card height="100%" width="100%" color="transparent">
                    <v-layout wrap justify-center>
                        <v-flex xs12 shrink class="mb-5">
                            <v-toolbar color="grey lighten-5 elevation-0">
                                <v-toolbar-title>
                                <v-breadcrumbs :items="category_breadcrumbs">
                                    <v-breadcrumbs-item slot="item" slot-scope="props">
                                        <template v-if="props.item.reset">
                                            <a @click="reset_category">{{ props.item.text.toUpperCase() }}</a>
                                        </template>
                                        <template v-else>
                                            {{ props.item.text.toUpperCase() }}
                                        </template>
                                    </v-breadcrumbs-item>
                                    <v-icon slot="divider">chevron_right</v-icon>
                                </v-breadcrumbs>
                                </v-toolbar-title>
                                <v-spacer></v-spacer>
                                <v-menu v-model="options.sorter" :close-on-content-click="true"
                                    :nudge-bottom="40">
                                    <v-btn flat slot="activator">
                                        Rikiuoti pagal kainą
                                    </v-btn>
                                    <v-card>
                                        <v-card-title class="pa-1">
                                            <v-btn icon @click="sortedBy = 2">
                                                <v-icon>fas fa-sort-amount-up</v-icon>
                                            </v-btn>
                                            <v-spacer></v-spacer>
                                            <v-btn icon @click="sortedBy = 3">
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
                                            <template v-if="category.current === undefined && (searchedBy === undefined || searchedBy === '')">
                                                Knygų parduotuvėje nėra.
                                            </template>
                                            <template v-else-if="category.current != undefined">
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
    </v-content>
</template>
<script>

    import { mapGetters } from 'vuex';
    export default {
        middleware: ['preload-client', 'authenticated', 'preload-data'],
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
                    products: []
                },
                sortedBy: 1,
                searchedBy: '',
                category: {
                    current: undefined,
                    parent: undefined
                }
            }
        },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                vm.collections.products = vm.products
                next();
            })
        },
        computed: {
            ...mapGetters([
                'client', 'categories', 'products'
            ]),
            /**
             * Get categories that have no parent.
             */
            category_dividers: function() {
                return _.filter(this.categories, function(category) {
                    return category.parentId == null
                })
            },
            /**
             * Breadcrumbs for category navigation.
             */
            category_breadcrumbs: function() {
                let crumbs = [{ 
                    text: "Visos kategorijos", 
                    disabled: this.category.current === undefined, 
                    reset: true
                }]

                if (this.category.current !== undefined) {
                    crumbs.push({
                        text: this.category.parent.label,
                        disabled: true,
                    })
                }

                if (this.category.current !== undefined) {
                    crumbs.push({
                        text: this.category.current.label,
                        disabled: true,
                    })
                }

                return crumbs
            }
        },
        methods: {
            /**
             * Return all categories related to parent.
             */
            treeOf(parent) {
                return _.filter(this.categories, function(category){
                    return category.parentId == parent;
                })
            },
            /**
             * Update products based on search input.
             */
            search(input) {
                this.category.current = undefined;
                if (input === undefined || input === null || input.length < 3) {
                    this.collections.products = this.products
                    return
                }

                const searching = input.toLowerCase()
                this.collections.products = _.filter(this.products, function(product) {
                    const authors_match = _.sumBy(product.authors, ({name, surname}) =>
                        name != null && name != undefined && name.toLowerCase().indexOf(searching) > -1 ||
                        surname != null && surname != undefined && surname.toLowerCase().indexOf(searching) > -1)

                    return ((product.title !== null && product.title !== undefined) && product.title.toLowerCase().indexOf(searching) > -1) || authors_match > 0
                })
            },
            /**
             * Sort products based on sorting choice.
             */
            sortBy(products) {
                switch(this.sortedBy) {
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

                this.sortedBy = 1
                return _.orderBy(products, ['id'], ['desc'])
            },
            /**
             * Sets current and parent categories.
             * Filters products by category.
             */
            set_category(category) {
                this.options.drawer = false
                this.category.current = category
                this.category.parent = _.find(this.categories, { id: category.parentId })
                this.collections.products = _.filter(this.products, function(product) {
                    return product.categoryId == category.id
                })
            },
            /**
             * Resets current and parent categories, also 
             * resets product collection.
             */
            reset_category(category) {
                this.collections.products = this.products
                this.category.current = undefined
                this.category.parent = undefined
            },
            /**
             * Sorts products and resets category selection.
             */
            newest() {
                this.sortBy = 1
                this.reset_category()
                this.options.drawer = false
            }
        },
        components: {
            "v-book": require("~/components/store/BookComponent.vue").default
        },
        watch: {
            products(changed, _) {
                this.collections.products = this.sortBy(changed)
            },
            sortedBy(changed, _) {
                this.collections.products = this.sortBy(this.products)
            },
            searchedBy(changed, _) {
                this.search(changed)
            }
        }
    }

</script>
<style lang="scss">

    .v-store-container {
        height: 100%;
        padding-top: 51px;
        .v-store-wrapper {
            height: 100%;  
            position: relative;
        }
    }

    .store-toolbar { border-top: 1px solid rgba($color: #000000, $alpha: 0.1); }
    .v-store-category-active { background-color: rgba($color: #000000, $alpha: 0.1) !important; }
    .v-store-search-field { width: 220px !important; }
    .v-store-drawer { border-right: 1px solid rgba($color: #000000, $alpha: 0.3); }
</style>
