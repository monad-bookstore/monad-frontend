<template>
    <v-content class="content-overlay">
        <v-container fluid>
            <v-card v-if="order !== undefined">
                <v-card-title class="card-title">
                    Užsakymo informacija
                    <v-chip class="ml-3" :color="statusChip.color" text-color="white">
                        {{ statusChip.text }}
                    </v-chip>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    <v-list>
                        <v-list-tile>
                            <v-list-tile-content class="shrink">
                                Užsakymo data: 
                            </v-list-tile-content>
                            <v-list-tile-content class="align-start ml-4">
                                {{ prettyDate(order.createdAt) }}
                            </v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile>
                            <v-list-tile-content class="shrink">
                                Užsakymo kaina:
                            </v-list-tile-content>
                            <v-list-tile-content class="align-start ml-4">
                                {{ price(order.products) }}&euro;
                            </v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile>
                            <v-list-tile-content class="shrink">
                                Pristatymo adresas:
                            </v-list-tile-content>
                            <v-list-tile-content class="align-start ml-4">
                                {{ order.address.label }}
                            </v-list-tile-content>
                            <v-list-tile-content class="align-end" v-if="order.status != 3 && order.status != 4">
                                <!-- <v-btn flat color="indigo" outline>
                                    Pakeisti
                                </v-btn> -->
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-title class="card-title">
                    Užsakytos prekės
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    <v-list two-line>
                        <v-list-tile avatar v-for="product in order.products" :key="product.id">
                            <v-list-tile-avatar>
                                <img :src="product.coverUrl">
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                                <v-list-tile-title v-html="author(product)"></v-list-tile-title>
                                <v-list-tile-sub-title v-html="product.title"></v-list-tile-sub-title>
                            </v-list-tile-content>
                            <v-list-tile-content class="align-end">
                                <v-chip text-color="white" color="indigo">
                                    <v-avatar>
                                        <v-icon>euro_symbol</v-icon>
                                    </v-avatar>
                                    {{ product.price }}
                                </v-chip>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions class="pa-3">
                    <v-spacer></v-spacer>
                    <v-btn color="red" flat @click="$router.push(`/client/cases/create/${order.id}`)">
                        Kurti naują bylą   
                    </v-btn> 
                </v-card-actions>
            </v-card>
        </v-container>
    </v-content>
</template>
<script>

    import moment from 'moment'
    import { mapGetters } from 'vuex';
    export default {
        middleware: ['preload-client', 'authenticated', 'preload-data'],
        data() {
            return {
                parameter: this.$route.params.id,
                order: undefined,
                status: {
                        0: {
                            color: "info",
                            text: "Apmokėjimas sėkmingas - laukiama patvirtinimo"
                        }, 1: {
                            color: "success lighten-3",
                            text: "Apmokėjimas patvirtintas - užsakymas ruošiamas"
                        }, 2: {
                            color: "success",
                            text: "Užsakymas vykdomas"
                        }, 3: {
                            color: "info",
                            text: "Išsiųsta"
                        }, 4: {
                            color: "Užsakymas užbaigtas",
                            text: "indigo"
                        }
                }
            }
        },
        mounted() {
            this.fetch()
        },
        methods: {
            fetch() {    
                this.$axios.get(`/api/orders/get/${this.parameter}`).then((response) => {
                    this.order = response.data
                    if (this.order === undefined || this.order === null) {
                        this.$router.push('/client/orders')
                    }
                })
            },
            author(product) {
                const authors = _.filter(this.authors, function(author) {
                    return product.authors.includes(author.id) 
                })
                
                const more = authors.length > 1 ? `+${authors.length - 1} kiti` : ''
                return `${authors[0].name} ${authors[0].surname} ${more}`
            },
            prettyDate(date) {
                return moment(date).format('YYYY-MM-DD HH:mm')
            },
            price(products) {
                return _.sumBy(products, function(product) {
                    return product.price
                })
            }
        },
        computed: {
            ...mapGetters([
                'authors'
            ]),
            statusChip: function() {
                return this.status[this.order.status]
            }
        }
    }

</script>