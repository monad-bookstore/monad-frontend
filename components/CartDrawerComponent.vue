<template>
    <div class="v-cart-container">
        <v-toolbar dense card color="transparent" absolute>
			<v-toolbar-title class="title">Pirkinių krepšelis</v-toolbar-title>
			<v-spacer></v-spacer>
			<v-btn icon @click="close">
				<v-icon>close</v-icon>
			</v-btn>
		</v-toolbar>
        <div class="v-cart-wrapper">
            <template v-if="cart_products !== undefined && cart_products.length > 0">
                <v-card>
                    <v-list two-line>
                        <v-list-tile avatar v-for="product in cart_products" :key="product.id">
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
                    </v-list>
                </v-card>
                <v-card class="footer-card">
                    <v-card-title class="title">
                        Kaina:
                        <v-spacer></v-spacer>
                        {{ price }}&euro;
                    </v-card-title>
                    <v-btn block color="primary" class="ma-0 rounded-0" dark>
                        Apmokėjimas
                    </v-btn>
                </v-card>
            </template>
            <template v-else>
                <v-card flat>
                    <v-card-text>
                        Pirkinių krepšelis tuščias...
                    </v-card-text>
                </v-card>
            </template>
        </div>
    </div>
</template>
<script>

    import { mapGetters } from 'vuex'
    export default {
        data() { return {

        }},
        computed: {
            ...mapGetters([
                'cart_products'
            ]),
            price: function() {
                return _.sumBy(this.cart_products, function(product) {
                    return product.price
                })
            }
        },
        methods: {
            close() {
                this.$emit('update:drawer', false)
            },
            author(product) {
                const more = product.authors.length > 1 ? `+${product.authors.length - 1} kiti` : ''
                return `${product.authors[0].name} ${product.authors[0].surname} ${more}`
            },
        }
    }

</script>

<style lang="scss" scoped>

    .v-cart-container {
        height: 100%;
        .v-cart-wrapper {
            height: 100%;  
            position: relative;
            padding-top: 51px;
            .footer-card {
                width: 100%;
                position: absolute;
                bottom: 0;
            }
        }
    }

</style>
