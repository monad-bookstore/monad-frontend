<template>
    <v-content>
        <v-container fill-height>
            <v-layout row justify-center align-center>
                <v-flex xs12 md5>
                    <v-card>
                        <v-card-title class="headline font-raleway-elight text-uppercase">
                            Apmokėjimas sėkmingas!
                        </v-card-title>
                        <v-divider></v-divider>
                        <v-card-text>
                            Apmokėjimas užsakymui #{{ order.id }} sėkmingai įvykdytas. Užsakymo data {{ dateFormatted }}.
                            Užsakytos prekės įprastai išsiunčiamas per 2-3 darbo dienas.
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <!-- TODO: Pridėti nuorodą į užsakymo peržiūrėjimą -->
                            <v-btn flat color="indigo" @click="$router.push(`/client/order/${order.id}`)">
                                Peržiūrėti užsakymą
                            </v-btn>
                            <v-btn flat color="black" @click="$router.push('/client/orders')">
                                Visi užsakymai
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
    </v-content>
</template>
<script>

    import moment from 'moment'
    export default {
        middleware: ['preload-client', 'authenticated', 'preload-data'],
        data() {
            return {
                order: undefined
            }
        },
        beforeRouteEnter (to, from, next) {
            const order = _.get(to.query, "order", undefined)
            if (order === undefined)
                next('/orders')
            next()
        },
        asyncData(context) {
            return context.$axios.get(`/api/orders/get/${context.query.order}`).then((response) => {
                return { order: response.data }
            }).catch((error) => {
                context.redirect('/')
            })
        },
        computed: {
            dateFormatted: function() {
                return moment(this.order.createdAt).format('YYYY-MM-DD')
            }
        },
        mounted() {
            this.$store.commit('CART_CLEAR')
            
        }
    }

</script>
