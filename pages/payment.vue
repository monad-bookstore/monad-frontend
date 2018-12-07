<template>
    <v-content class="content-overlay">
        <v-container>
            <v-card>
                <v-card-title class="card-title">
                    Apmokėjimas
                </v-card-title>
                <v-divider></v-divider>
                <v-subheader>Pirkiniai</v-subheader>
                <v-card-text>
                    <v-list two-line>
                        <v-list-tile avatar v-for="product in cart" :key="product.id">
                            <v-list-tile-avatar>
                                <img :src="product.coverUrl">
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                                <v-list-tile-title v-html="author(product)"></v-list-tile-title>
                                <v-list-tile-sub-title v-html="product.title"></v-list-tile-sub-title>
                            </v-list-tile-content>
                            <v-list-tile-content class="align-end">
                                <v-btn icon @click="$store.commit('CART_REMOVE_PRODUCT', product)">
                                    <v-icon>close</v-icon>
                                </v-btn>
                            </v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile>
                            <v-list-tile-content>
                                Galutinė kaina {{ price }}&euro;
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-text>
                    <small v-if="hasNoAddresses" class="red--text">
                        Jūs neturite sukurtų adresų. Pridėti naujus pristatymo adresus galite skiltyje <nuxt-link to="/client/settings">Nustatymai</nuxt-link>.
                    </small>
                    <v-select :disabled="hasNoAddresses" v-model="fields.addressId" 
                        :items="addresses" item-text="label" item-value="id"
                        label="Pristatymo adresas">
                    </v-select>
                    <v-select :items="payments"
                        label="Apmokėjimo būdas">
                    </v-select>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn flat color="red" @click="cancel">
                        Atšaukti užsakymą
                    </v-btn>
                    <v-btn flat color="indigo" @click="create">
                        Patvirtinti užsakymą
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-container>
    </v-content>
</template>
<script>

    import { mapGetters } from 'vuex'
    export default {
        middleware: ['preload-client', 'authenticated'],
        data() {
            return {
                fields: {
                    addressId: undefined
                },
                payments: [
                    'Bankiniu pavedimu', 'PayPal', 'PaySera', 'Skrill', 'WebMoney'
                ],
                error: {
                    fields: ['addressId', 'books']
                }
            }
        },
        mounted() {
            this.$store.dispatch('request_client_addresses')
            this.$store.dispatch('request_client_contacts')
        },
        methods: {
            author(product) {
                const more = product.authors.length > 1 ? `+${product.authors.length - 1} kiti` : ''
                return `${product.authors[0].name} ${product.authors[0].surname} ${more}`
            },
            cancel() {
                this.$store.commit('CART_CLEAR')
                this.$router.push('/store')
            },
            create() {
                const payload = {
                    addressId: this.fields.addressId,
                    books: _.map(this.cart, "id")
                }

                this.$axios.post('/api/orders/create', payload).then((response) => {
                    
                }).catch((error) => {
                    const data = _.mapKeys(error.response.data, function(v, k) {
                        return k.toLowerCase()
                    })

                    let message = "Klaida kuriant užsakymą. Bandykite iš naujo."
                    _.each(error.fields, function(field) {
                        if (_.has(data, field)) {
                            message = data.field[0]
                        }
                    })

                    this.$store.commit('SET_MESSAGE', message)
                })
            }
        },
        computed: {
            ...mapGetters([
                'addresses', 'contacts', 'cart'
            ]),
            hasNoAddresses: function() {
                return this.addresses === undefined || this.addresses.length < 1
            },
            price: function() {
                return _.sumBy(this.cart, function(product) {
                    return product.price
                })
            }
        },
        watch: {
            cart(changed, _) {
                if (changed === undefined || changed.length < 1)
                    this.$router.push('/store')
            }
        }
    }

</script>

