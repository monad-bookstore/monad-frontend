<template>
    <v-content class="content-overlay">
        <v-container fluid>
            <template v-if="product !== undefined">
                <v-layout>
                    <v-flex shrink>
                        <v-avatar tile size="200">
                            <v-img :src="product.coverUrl" aspect-ratio="1.2"></v-img>
                        </v-avatar>
                    </v-flex>
                    <v-flex grow class="ml-3">
                        <v-list>
                            <v-list-tile>
                                <v-list-tile-content>
                                    <span class="font-raleway-regular product-title">
                                        „{{ product.title }}“
                                    </span>
                                </v-list-tile-content>
                                <v-list-tile-content class="align-end">
                                    <v-btn v-if="!cart_contains(product)" flat small color="purple" class="ml-0" @click="cart_append(product)">
                                        Pridėti į krepšelį
                                    </v-btn>
                                    <v-btn v-else flat small color="purple" class="ml-0" @click="cart_remove(product)">
                                        Iššimti iš krepšelio
                                    </v-btn>
                                </v-list-tile-content>
                            </v-list-tile>
                            <v-list-tile>
                                <v-list-tile-content>
                                    <span class="font-raleway-regular">
                                        {{ authors }}
                                    </span>
                                </v-list-tile-content>
                            </v-list-tile>
                        </v-list>
                    </v-flex>
                </v-layout>
                <v-layout wrap>
                    <v-flex xs12>
                        <v-card class="mt-2" flat>
                            <v-card-title class="font-raleway-regular card-header">
                                Knygos aprašymas
                            </v-card-title>
                            <v-divider></v-divider>
                            <v-card-text class="product-description">
                                <p>{{ product.description }}</p>
                            </v-card-text>
                        </v-card>
                    </v-flex>
                    <v-flex xs12>
                        <v-card class="mt-2" flat>
                            <v-card-title class="font-raleway-regular card-header">
                                Papildomai
                            </v-card-title>
                            <v-divider></v-divider>
                            <v-card-text>
                                <v-list>
                                    <v-list-tile>
                                        <v-list-tile-content>
                                            Puslapių skaičius: {{ product.pages }}
                                        </v-list-tile-content>
                                    </v-list-tile>
                                    <v-list-tile>
                                        <v-list-tile-content>
                                            Kaina: {{ product.price }}&euro;
                                        </v-list-tile-content>
                                    </v-list-tile>
                                </v-list>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <!-- <v-btn flat color="indigo" @click="comments = true">
                                    Skaityti komentarus
                                </v-btn> -->
                            </v-card-actions>
                        </v-card>
                    </v-flex>
                </v-layout>
                <v-dialog v-model="comments" fullscreen hide-overlay transition="dialog-bottom-transition" scrollable>
                    <v-card tile>
                        <v-toolbar card color="white" class="elevation-1">
                            <v-btn icon @click="comments = false">
                                <v-icon>close</v-icon>
                            </v-btn>
                            <v-toolbar-title>Knygos „{{ product.title }}“ komentarai</v-toolbar-title>
                        </v-toolbar>
                    </v-card>
                </v-dialog>
            </template>
            <!--  -->
            <template v-else>
                <v-layout fill-height justify-center align-center>
                    <v-progress-circular indeterminate></v-progress-circular>
                </v-layout>
            </template>
        </v-container>
    </v-content>
</template>
<script>
    
    import { mapGetters } from 'vuex'
    export default 
    {
        middleware: ['preload-client', 'authenticated'],
        data() {
            return { 
                parameter: this.$route.params.id,
                product: undefined,
                comments: false,
            }
        },
        mounted() {
            this.$axios.get(`/api/store/product/${this.parameter}`).then((response) => {
                this.product = response.data
            }).catch((error) => {})
        },
        computed: {
            ...mapGetters([
                'cart_products'
            ]),
            authors: function() {
                return _.map(this.product.authors, function(author) { 
                    return author.name + " " + author.surname; 
                }).join(', ')
            }
        },
        methods: {
            cart_append(product) {
                this.$store.commit('CART_ADD_PRODUCTS', product)
                this.$store.commit('SHOW_SNACKBAR', "Pridėta į krepšelį")
            },
            cart_remove(product) {
                this.$store.commit('CART_REMOVE_PRODUCT', product)
                this.$store.commit('SHOW_SNACKBAR', "Išimta iš krepšelio")
            },
            cart_contains(product) {
                return _.find(this.cart_products, { id: product.id })
            },
        }
    }

</script>

<style lang="scss">

    .product-title {
        font-size: 32px !important;
    }

    .card-header {
        font-size: 21px !important;
    }

    .product-description {
        text-align: justify;
    }

</style>
