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
                                <td class="text-xs-right"> || </td>
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
        },
    }

</script>
