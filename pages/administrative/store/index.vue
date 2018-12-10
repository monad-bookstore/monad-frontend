<template>
    <v-content class="content-overlay">
        <v-container fluid>
            <v-card>
               <v-card-title class="card-title font-raleway-regular">
                   Knygų sąrašas
                   <v-spacer></v-spacer>
                <v-text-field 
                    v-model="search" 
                    append-icon="search" 
                    label="Knygos paieška" 
                    single-line 
                    hide-details
                >
                    <v-btn slot="append-outer" 
                        flat 
                        outline 
                        color="indigo" 
                        style="top: -12px"
                        offset-y
                        @click="create = true"
                    >
                        <v-icon>add</v-icon>
                        Naujas įrašas
                    </v-btn>
                </v-text-field>
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
                                <td class="text-xs-right"> 
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
                                    <v-btn block color="primary" @click="modify(props.item)">
                                        Išsaugoti pakeitimus
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </template>
                    </v-data-table>
                </v-card-text>
            </v-card>
            <v-dialog width="650px" v-model="create" persistent>
                <v-stepper v-model="creationStepper">
                    <v-stepper-header>
                        <v-stepper-step :complete="creationStepper > 1" step="1">
                            Pagrindiniai duomenys
                        </v-stepper-step>
                        <v-divider></v-divider>
                        <v-stepper-step  :complete="creationStepper > 2" step="2">
                            Papildoma informacija
                        </v-stepper-step>
                        <v-divider></v-divider>                        
                        <v-stepper-step step="3">
                            Aprašymas
                        </v-stepper-step ntent>
                    </v-stepper-header>
                    <v-stepper-items>
                        <v-stepper-content step="1">
                            <v-card flat>
                                <v-card-text>
                                    <v-text-field v-model="fields.title" box
                                    label="Knygos pavadinimas" required></v-text-field>
                                <v-select v-model="fields.authors" box :items="authors" label="Knygos autoriai"
                                    item-value="id" :item-text="authorFullname" multiple :menu-props="{ 'closeOnContentClick': true }">
                                    </v-select>
                                <v-select v-model="fields.categoryId" box :items="getCategories" label="Knygos kategorija"
                                    item-value="id" item-text="label" :menu-props="{ 'closeOnContentClick': true }">
                                </v-select>
                                </v-card-text>
                                <v-divider></v-divider>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn flat color="indigo" @click="creationStepper = 2">Tęsti</v-btn>
                                    <v-btn flat @click="create = false">Atšaukti</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-stepper-content>
                        <v-stepper-content step="2">
                            <v-card flat>
                                <v-card-text>
                                    <v-text-field clearable v-model="fields.cover" box
                                        label="Knygos viršelio adresas" required></v-text-field>
                                    <v-text-field clearable v-model="fields.price" box
                                        label="Knygos kaina" required></v-text-field>
                                    <v-text-field clearable v-model="fields.pages" box
                                        label="Knygos puslapių skaičius" required></v-text-field>
                                </v-card-text>
                                <v-divider></v-divider>
                                <v-card-actions>
                                    <v-btn flat color="primary" @click="creationStepper = 1">Atgal</v-btn>
                                    <v-spacer></v-spacer>
                                    <v-btn flat color="indigo" @click="creationStepper = 3">Tęsti</v-btn>
                                    <v-btn flat @click="create = false">Atšaukti</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-stepper-content>
                        <v-stepper-content step="3">
                            <v-card flat>
                                <v-card-text>
                                    <v-textarea box v-model="fields.description" box
                                        label="Knygos aprašymas" required></v-textarea>
                                </v-card-text>
                                <v-divider></v-divider>
                                <v-card-actions>
                                    <v-btn flat color="primary" @click="creationStepper = 2">Atgal</v-btn>
                                    <v-spacer></v-spacer>
                                    <v-btn flat color="indigo" @click="save">Išsaugoti</v-btn>
                                    <v-btn flat @click="create = false">Atšaukti</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-stepper-content>
                    </v-stepper-items>
                </v-stepper>
            </v-dialog>
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
    import assertPrivilage from '@/plugins/mixins/assert-privilege'
    export default {
        layout: 'administrative',
        middleware: ['preload-client', 'authenticated', 'preload-data'],
        // Administrator,Manager
        privileges: [1, 2],
        mixins: [assertPrivilage],
        data() {
            return {
                datatable: {
                    pagination: {},
                    headers: [
                        { text: "ID", value: "id" },
                        { text: "Knygos pavadinimas", value: "title" },
                        { text: "Autorius(-ai)", value: undefined, sortable: false },
                        { text: "Kaina", value: "price" } ,
                        { text: undefined, value: undefined, sortable: false }
                    ]
                },
                search: '',
                remove: {
                    dialog: false,
                    productId: -1
                },
                create: false,
                creationStepper: 1,
                fields: {
                    title: '',
                    authors: [],
                    categoryId: 0,
                    cover: '',
                    price: '',
                    pages: '',
                    description: ''
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
            save() {
                this.$axios.post('/api/privileged/books/create', this.fields).then((response) => {
                    this.create = false
                    this.$message.show(response.data.message)
                    this.$store.dispatch('request_product_collection')
                })
                .catch((error) => {
                    this.create = false
                    this.$message.show("Klaida kuriant naują įrašą.")
                })
            },
            modify(product) {
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
