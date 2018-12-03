<template>
    <v-container>
        <v-card flat class="pa-2">
            <template v-if="products !== null && authors !== null">
                <v-card-title>
                    <v-text-field v-model="product_search" append-icon="search" label="Paieška" single-line hide-details></v-text-field>
                </v-card-title>
                <v-card-text>
                    <v-data-table :items="products" :pagination.sync="product_pagination" 
                            :search="product_search" :custom-filter="product_search_filter" hide-headers hide-actions>
                        <template slot="items" slot-scope="props">
                            <tr>
                                <td>{{ props.item.title }}</td>
                                <td class="text-xs-right">
                                    <v-btn flat outline small color="primary" @click="modify_product(props.item)">
                                        Keisti
                                    </v-btn>
                                    <v-btn flat outline small color="red">
                                        Ištrinti
                                    </v-btn>
                                </td>
                            </tr>
                        </template>
                    </v-data-table>
                </v-card-text>
            </template>
            <template v-else>
                <v-layout fill-height justify-center align-center>
                    <v-progress-circular indeterminate></v-progress-circular>
                </v-layout>
            </template>
        </v-card>
        <v-panel-product-modification v-if="modifying !== undefined" :product="modifying" :visibility="dialogs.product_modification" 
            v-bind:visibility.sync="dialogs.product_modification"></v-panel-product-modification>
    </v-container>
</template>
<script>

    export default 
    {
        data() {
            return {
                product_search: '',
                product_pagination: {
                    totalItems: 0,
                    rowsPerPage: 8
                },
                dialogs: {
                    product_modification: false
                },
                modifying: undefined,
            }
        },
        props: 
        {
            authors: {
                required: true,
            },
            products: {
                required: true,
            }
        },
        methods: {
            /**
             */
            product_search_filter(products, searchingFor, filter) {
                return _.filter(products, function(product) {
                    return product.title != null && product.title.toString().includes(searchingFor)
                })
            },
            /**
             * 
             */
            modify_product(product) {
                this.dialogs.product_modification = true
                this.modifying = product
            }
        },
        components: {
            "v-panel-product-modification": require('~/components/store/panel/PanelProductModification.vue').default,
        }
    }

</script>
