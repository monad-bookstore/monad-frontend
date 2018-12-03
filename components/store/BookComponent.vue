<template>
    <v-card width="240px">
        <v-img :src="product.coverUrl" aspect-ratio="1.2"></v-img>
        <v-card-title primary-title>
            <div>
                <div class="subheading">{{ author }}</div>
                <span class="grey--text">{{ product.title }}</span>
                <span>{{ product.price }}&euro;</span>
            </div>
        </v-card-title>
        <v-card-actions>
            <v-btn small flat v-if="!cart_contains(product)" @click="cart_append(product)">Pridėti į krepšelį</v-btn>
            <v-btn small flat v-else @click="cart_remove(product)">Išimti iš krepšelio</v-btn>
            <v-spacer></v-spacer>
            <v-btn small flat color="purple">Plačiau</v-btn>
        </v-card-actions>
    </v-card>
</template>
<script>

    import { mapGetters } from 'vuex'
    export default 
    {
        props: {
            product: {
                type: Object,
                required: true
            }
        },
        computed: {
            ...mapGetters([
                'cart_products'
            ]),
            author: function() {
                const product = this.product
                const more = product.authors.length > 1 ? `+${product.authors.length - 1} kiti` : ''
                return `${product.authors[0].name} ${product.authors[0].surname} ${more}`
            }
        },
        methods: {
            cart_contains(product) {
                return _.find(this.cart_products, { id: product.id })
            },
            cart_append(product) {
                this.$store.commit('CART_ADD_PRODUCTS', product)
                this.$store.commit('SHOW_SNACKBAR', "Pridėta į krepšelį")
            },
            cart_remove(product) {
                this.$store.commit('CART_REMOVE_PRODUCT', product)
                this.$store.commit('SHOW_SNACKBAR', "Išimta iš krepšelio")
            }
        }
    }

</script>
