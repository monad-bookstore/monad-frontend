<template>
    <v-content class="content-overlay">
        <v-container>
            <v-card>
               <v-card-title class="card-title font-raleway-regular">
                   Knygų sąrašas
                   <v-spacer></v-spacer>
                <v-text-field v-model="search" append-icon="search" label="Knygos paieška" single-line hide-details></v-text-field>
                </v-card-title> 
                <v-divider></v-divider>
                <v-card-text>
                    <v-data-table :items="products" :search="search" :headers="datatable.headers" :pagination.sync="datatable.pagination">
                        <template slot="no-results">
                            Pagal paieškos terminą rezultatų nerasta.
                        </template>
                        <template slot="items" slot-scope="props">
                            <tr @click="props.expanded = !props.expanded">
                                <td> {{ props.item.id }} </td>
                                <td> {{ props.item.title }} </td>
                                <td> {{ authorsText(props.item) }} </td>
                                <td> {{ props.item.price }} </td>
                                <td> 
                                    <v-btn flat small outline color="red" @click="removeConfirmation(props.item.id)">
                                        Trinti
                                    </v-btn>
                                </td>
                            </tr>
                        </template>
                        <template slot="expand" slot-scope="props">
                            <v-card flat>
                                <v-tabs centered color="snow">
                                    <v-tab>
                                        Pagrindiniai nustatymai
                                    </v-tab>
                                    <v-tab>
                                        Papildoma informacija
                                    </v-tab>
                                    <v-tab>
                                        Aprašymas
                                    </v-tab>
                                    <v-tab-item>
                                        <v-card flat>
                                            <v-card-text>
                                                <v-text-field clearable v-model="props.item.title"
                                                    label="Knygos pavadinimas" required></v-text-field>
                                                <v-select v-model="props.item.authors" :items="authors" label="Knygos autoriai"
                                                    return-object :item-text="authorFullname" multiple :menu-props="{ 'closeOnContentClick': true }">
                                                    </v-select>
                                                <v-select v-model="props.item.categoryId" :items="getCategories" label="Knygos kategorija"
                                                    item-value="id" item-text="label" :menu-props="{ 'closeOnContentClick': true }">
                                                </v-select>
                                            </v-card-text>
                                        </v-card>
                                    </v-tab-item>
                                    <v-tab-item>
                                        <v-card flat>
                                            <v-card-text>
                                                <v-text-field clearable v-model="props.item.coverUrl"
                                                    label="Knygos viršelio adresas" required></v-text-field>
                                                <v-text-field clearable v-model="props.item.price"
                                                    label="Knygos kaina" required></v-text-field>
                                                <v-text-field clearable v-model="props.item.pages"
                                                    label="Knygos puslapių skaičius" required></v-text-field>
                                            </v-card-text>
                                        </v-card>
                                    </v-tab-item>
                                    <v-tab-item>
                                        <v-card flat>
                                            <v-card-text>
                                                <v-textarea clearable v-model="props.item.description"
                                                    label="Knygos aprašymas" required></v-textarea>
                                            </v-card-text>
                                        </v-card>
                                    </v-tab-item>
                                </v-tabs>
                                <v-card-actions class="px-0">
                                    <v-btn block color="primary" @click="save(props.item)">
                                        Išsaugoti pakeitimus
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </template>
                    </v-data-table>
                </v-card-text>
            </v-card>
            <v-general-confirmation :visibility="remove.dialog" v-bind:visibility.sync="remove.dialog" :confirmed="removeConfirmed">
                <template slot="body">
                    Ar tikrai norite ištrinti šią knygą?
                </template>
            </v-general-confirmation>
        </v-container>
    </v-content>
</template>
<script>

    import { mapGetters } from 'vuex'
    export default {
        layout: 'administrative',
        middleware: ['preload-client', 'authenticated', 'preload-data'],
        data() {
            return {
                datatable: {
                    pagination: {},
                    headers: [
                        { text: "ID", value: "id" },
                        { text: "Knygos pavadinimas", value: "title" },
                        { text: "Autorius(-ai)", value: undefined, sortable: false },
                        { text: "Kaina", value: "price" } ,
                        { text: "Funkcijos", value: undefined, sortable: false }
                    ]
                },
                search: '',
                remove: {
                    dialog: false,
                    productId: -1
                },
            }
        },
        methods: {
            authorFullname(author) {
                if (author == undefined || author == null)
                    return `Nenurodyta`

                return `${author.name} ${author.surname}`
            },
            authorsText(product) {
                if (product.authors.length < 1)
                    return `Nenurodyta`

                const aacount = product.authors.length - 1
                const others = aacount > 0 ? `(${aacount})+` : ''
                const first = _.head(product.authors)
                return `${first.name} ${first.surname} ${others}`
            },
            save(product) {
                if (product == null || product == undefined)
                    return

                this.$axios.post(`/api/privileged/books/modify/${product.id}`, product).then((response) => {
                    this.$message.show('Knygos pakeitimai išsaugoti.')
                    this.$store.dispatch('request_product_collection')
                }).catch((error) => {
                    this.$message.show('Klaida bandant išsaugoti knygos pakeitimus.')
                })
            },
            removeConfirmation(id) {
                this.remove.productId = id
                this.remove.dialog = true
            },
            removeConfirmed() {
                if (this.remove.productId < 1)
                    return;

                this.$axios.post(`/api/privileged/books/remove/${this.remove.productId}`).then((response) => {
                    this.$message.show('Knygos ištrinta.')
                    this.$store.dispatch('request_product_collection')
                }).catch((error) => {
                    this.$message.show('Klaida bandant ištrinti knygą.')
                })
            }
        },
        computed: {
            ...mapGetters([
                'products', 'authors', 'categories'
            ]),
            getCategories: function() {
                return _.filter(this.categories, function(o) {
                    return o.parentId !== null
                })
            }
        },
        components: {
            "v-general-confirmation": require('~/components/general/GeneralConfirmationDialog.vue').default
        },
    }


</script>
