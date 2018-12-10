<template>
    <v-content class="content-overlay">
        <v-container fluid>
            <v-card>
                <v-card-title class="card-title">
                    Užsakymai
                    <v-spacer></v-spacer>
                    <v-menu :nudge-width="200" offset-y>
                        <v-btn outline slot="activator" class="mr-3"flat>
                            <v-icon>more_vert</v-icon>
                            Rūšiavimas
                        </v-btn>
                        <v-card>
                            <v-card-text>
                                <v-list>
                                    <v-list-tile>
                                        <v-checkbox
                                            label="Rodyti aktyvius užsakymus"
                                            v-model="options.filter.active"
                                        ></v-checkbox>
                                    </v-list-tile>
                                </v-list>
                                <v-list>
                                    <v-list-tile>
                                        <v-checkbox
                                            label="Rodyti įvykdytus užsakymus"
                                            v-model="options.filter.completed"
                                        ></v-checkbox>
                                    </v-list-tile>
                                </v-list>
                            </v-card-text>
                        </v-card>
                    </v-menu>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text class="scrollbar apply-overflow scrollbar-near-moon thin">
                    <v-list two-line v-if="filteredOrders.length > 0">
                        <v-list-tile v-for="order in filteredOrders" :key="order.id" @click="">
                            <v-list-tile-content>
                                <v-list-tile-title>Užsakymas #{{ order.id }}</v-list-tile-title>
                                <v-list-tile-sub-title>
                                    Data: {{ prettyDate(order.createdAt) }} | Užsakymo kaina: {{ price(order.products) }}&euro;
                                </v-list-tile-sub-title>
                            </v-list-tile-content>
                             <v-list-tile-content class="align-end">
                                <v-btn icon flat color="primary" @click="$router.push(`/client/order/${order.id}`)">
                                    <v-icon>arrow_forward_ios</v-icon>
                                </v-btn>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list>
                    <span v-else>Užsakymų neturite arba nei vienas užsakymas neatitiko rūšiavimo pasirinkimų.</span>
                </v-card-text>
            </v-card>
        </v-container>
    </v-content>
</template>
<script>

    import moment from 'moment'
    export default {
        middleware: ['preload-client', 'authenticated', 'preload-data'],
        data() {
            return {
                orders: [],
                options: {
                    navigator: 0,
                    filter: {
                        active: true,
                        completed: true
                    }
                }
            }
        },
        asyncData(context) {
            return context.$axios.get('/api/orders/get').then((response) => {
                return { orders: response.data }
            }).catch((error) => {
                return { orders: [] }
            })
        },
        computed: {
            filters: function() {
                const active = this.options.filter.active ? [0, 1, 2, 3] : []
                const completed = this.options.filter.completed ? [4] : []
                return [...active, ...completed]
            },
            filteredOrders: function() {
                const filters = this.filters
                return _.filter(this.orders, function(order) {
                    return filters.includes(order.status)
                })
            },
        },
        methods: {
            prettyDate(date) {
                return moment(date).format('YYYY-MM-DD HH:mm')
            },
            price(products) {
                return _.sumBy(products, function(product) {
                    return product.price
                })
            }
        }
    }

</script>
<style lang="scss">

    .v-bottom-navcard {
        padding-bottom: 64px;
    }

    .apply-overflow {
        display: block !important;
        max-height: 100% !important;
        overflow-y: auto !important;
    }

</style>
