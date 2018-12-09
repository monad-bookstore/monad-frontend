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
                            <v-list-tile>
                                <v-list-tile-content>
                                    <v-rating v-model="rating"></v-rating>
                                </v-list-tile-content>
                                <v-list-tile-action>
                                    <v-btn flat small color="blue" @click="rate">
                                        Įvertinti
                                    </v-btn>
                                </v-list-tile-action>
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
                                Papildoma informacija
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
                                <v-btn flat color="indigo" @click="comments = true">
                                    Skaityti komentarus
                                </v-btn>
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
                            <v-spacer></v-spacer>
                            <v-btn flat outline color="blue" @click="writing_comment = !writing_comment">
                                Palikti komentarą
                            </v-btn>
                        </v-toolbar>
                        <v-card-text v-if="product.comments.length > 0">
                            <v-list two-line>
                                <v-list-tile v-for="comment in product.comments" :key="comment.id">
                                    <v-list-tile-content>
                                        <v-list-tile-title v-html="comment.message"></v-list-tile-title>
                                        <v-list-tile-sub-title v-html="friendly_date(comment.createdAt)"></v-list-tile-sub-title>
                                    </v-list-tile-content>
                                    <v-list-tile-content class="align-end" v-if="$client.privileged($AccessLevel.ADMINISTRATOR, $AccessLevel.MANAGER, $AccessLevel.SUPPORT, $AccessLevel.EMPLOYEE)">
                                        <v-btn icon flat @click="delete_comment(comment.id)">
                                            <v-icon>delete</v-icon>
                                        </v-btn>
                                    </v-list-tile-content>
                                </v-list-tile>
                            </v-list>
                        </v-card-text>
                        <v-card-text v-else>
                            Komentarų nėra.
                        </v-card-text>
                    </v-card>
                </v-dialog>
            </template>
            <!--  -->
            <template v-else>
                <v-layout fill-height justify-center align-center>
                    <v-progress-circular indeterminate></v-progress-circular>
                </v-layout>
            </template>
            <v-dialog v-model="writing_comment" persistent width="600px">
                <v-card flat>
                    <v-card-text>
                        <v-textarea
                            v-model="comment"
                            auto-grow
                            row-height="64"
                            color="deep-purple"
                            label="Komentaras"
                            rows="1"
                        ></v-textarea>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn flat color="black" @click="writing_comment = false">
                            Atšaukti
                        </v-btn>
                        <v-btn flat color="indigo" @click="save_comment">
                            Įrašyti
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-container>
    </v-content>
</template>
<script>
    
    import { mapGetters } from 'vuex'
    import moment from 'moment'
    export default 
    {
        middleware: ['preload-client', 'authenticated'],
        data() {
            return { 
                parameter: this.$route.params.id,
                product: undefined,
                comments: false,
                rating: -1,
                writing_comment: false,
                comment: ''
            }
        },
        mounted() {
            this.fetch_product()
        },
        computed: {
            ...mapGetters([
                'cart'
            ]),
            authors: function() {
                return _.map(this.product.authors, function(author) { 
                    return author.name + " " + author.surname; 
                }).join(', ')
            },
        },
        methods: {
            fetch_product() {
                this.$axios.get(`/api/store/product/${this.parameter}`).then((response) => {
                    this.product = response.data
                    this.rating = this.avarageRating();
                }).catch((error) => {})
            },
            cart_append(product) {
                this.$store.commit('CART_ADD_PRODUCTS', product)
                this.$store.commit('SET_MESSAGE', "Pridėta į krepšelį")
            },
            cart_remove(product) {
                this.$store.commit('CART_REMOVE_PRODUCT', product)
                this.$store.commit('SET_MESSAGE', "Išimta iš krepšelio")
            },
            cart_contains(product) {
                return _.find(this.cart, { id: product.id })
            },
            avarageRating() {
                const ratings = _.sumBy(this.product.ratings, "rating1")
                return ratings > 0 ? ratings / this.product.ratings.length : 0
            },
            rate() {
                const payload = {
                    bookId: this.product.id,
                    rating: this.rating
                }
                this.$axios.post(`/api/ratings/rate`, payload)
            },
            friendly_date(date) {
                return moment(date).format('YYYY-MM-DD HH:mm')
            },
            delete_comment(comid) {
                this.$axios.get(`/api/privileged/comments/delete/${comid}`).then((response) => {
                    this.$message.show("Komentaras ištrintas.")
                    this.fetch_product()
                }).catch((error) => {
                    this.$message.show("Klaida trinant komentarą.")
                })
            },
            save_comment() {
                const payload = {
                    bookId: this.product.id,
                    message: this.comment
                }

                this.$axios.post('/api/comments/create', payload).then((response) => {
                    this.$message.show('Komentaras įrašytas!')
                    this.writing_comment = false
                    this.comments = true
                    this.fetch_product()
                }).catch((error) => {
                    this.comments = true
                    this.writing_comment = false
                    this.$message.show('Klaida bandant įrašyti komentarą!')
                })
            }
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
