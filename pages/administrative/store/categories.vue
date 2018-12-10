<template>
    <v-content class="content-overlay">
        <v-container fluid>
            <v-card>
                <v-card-title class="card-title font-raleway-regular">
                    Kategorijų valdymas
                    <v-spacer></v-spacer>
                    <v-text-field v-model="search" 
                        append-icon="search" 
                        label="Kategorijos paieška" 
                        single-line 
                        hide-details
                    >
                        <v-btn slot="append-outer" 
                            flat 
                            outline 
                            color="indigo" 
                            style="top: -12px"
                            offset-y
                            @click="create = !create"
                        >
                            <v-icon>add</v-icon>
                            Naujas įrašas
                        </v-btn>
                    </v-text-field>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    <v-data-table 
                        :items="categories" 
                        :search="search" 
                        :headers="datatable.headers" 
                        :pagination.sync="datatable.pagination"
                    >
                        <template slot="no-results">
                            Pagal paieškos terminą rezultatų nerasta.
                        </template>
                        <template slot="items" slot-scope="props">
                            <tr @click="props.expanded = !props.expanded">
                                <td> {{ props.item.id }} </td>
                                <td> {{ props.item.label }} </td>
                                <td> {{ childOf(props.item.parentId) }} </td>
                                <td class="text-xs-right">
                                    <v-btn flat small outline color="red" @click="confirm_removal(props.item.id)">
                                        Trinti
                                    </v-btn>
                                </td>
                            </tr>
                        </template>
                        <template slot="expand" slot-scope="props">
                            <v-card flat>
                                <v-card-text>
                                    <v-form @keyup.enter.native="modify(props.item)">
                                        <v-text-field clearable v-model="props.item.label"
                                            label="Kategorijos pavadinimas" required></v-text-field>
                                        <v-select v-model="props.item.parentId" :items="parentCategories" label="Subkategorija"
                                            item-value="id" item-text="label">
                                            <v-list-tile slot="prepend-item" @click="props.item.parentId = 0" ripple>
                                                <v-list-tile-avatar color="grey lighten-3">
                                                    <v-icon>category</v-icon>
                                                </v-list-tile-avatar>
                                                <v-list-tile-content>
                                                    <v-list-tile-title>
                                                        Pažymėti kaip skirtuką
                                                    </v-list-tile-title>
                                                </v-list-tile-content>
                                            </v-list-tile>
                                        </v-select>
                                    </v-form>
                                </v-card-text>
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
        <v-dialog width="500px" v-model="create" persistent>
            <v-card flat>
                <v-card-text>
                    <v-form @keyup.enter.native="save">
                        <v-text-field clearable v-model="fields.label"
                            label="Kategorijos pavadinimas" required></v-text-field>
                        <v-select v-model="fields.parentId" :items="parentCategories" label="Subkategorija"
                            item-value="id" item-text="label">
                            <v-list-tile slot="prepend-item" @click="fields.parentId = 0" ripple>
                                <v-list-tile-avatar color="grey lighten-3">
                                    <v-icon>category</v-icon>
                                </v-list-tile-avatar>
                                <v-list-tile-content>
                                    <v-list-tile-title>
                                        Pažymėti kaip skirtuką
                                    </v-list-tile-title>
                                </v-list-tile-content>
                            </v-list-tile>
                        </v-select>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn flat color="black" @click="create = !create">
                        Atšaukti
                    </v-btn>
                    <v-btn flat color="indigo" @click="save">
                        Išsaugoti
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-general-confirmation :visibility="remove.dialog" v-bind:visibility.sync="remove.dialog" :confirmed="remove_confirmed">
            <template slot="body">
                Ar tikrai norite ištrinti šią kategorija?
            </template>
        </v-general-confirmation>
        </v-container>
    </v-content>
</template>
<script>

    import assertPrivilage from '@/plugins/mixins/assert-privilege'
    import { mapGetters } from 'vuex'  
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
                        { text: "Pavadinimas", value: "label" },
                        { text: "Subkategorija", value: undefined },
                        { text: undefined, value: undefined, sortable: false }
                    ]
                },
                create: false,
                fields: {
                    label: '',
                    parentId: null
                },
                search: '',
                remove: {
                    dialog: false,
                    categoryId: -1
                },
            }
        },
        computed: {
            ...mapGetters([
                'categories'
            ]),
            parentCategories: function() {
                return _.filter(this.categories, function(category) {
                    return category.parentId == null
                })
            }
        },
        methods: {
            childOf(parentId) {
                if (parentId === null || parentId === undefined)
                    return 'Nėra'

                const parent = _.find(this.categories, { id: parentId })
                if (parent !== undefined) {
                    return `${parent.label}`
                }                
            },
            confirm_removal(id) {
                this.remove.categoryId = id
                this.remove.dialog = true
            },
            remove_confirmed() {
                if (this.remove.categoryId < 1)
                    return;

                this.$axios.get(`/api/privileged/categories/remove/${this.remove.categoryId}`).then((response) => {
                    this.$message.show("Kategorija ištrinta.")
                    this.$store.dispatch('request_category_collection')
                }).catch((error) => {
                    this.$message.show("Nenumatyta klaida trinant įrašą.")
                })
            },
            modify(category) {
                const payload = {
                    label: category.label,
                    parentId: category.parentId,
                }

                this.$axios.post(`/api/privileged/categories/modify/${category.id}`, payload).then((response) => {
                    this.$message.show("Kategorijos duomeys atnaujinti.")
                    this.$store.dispatch('request_category_collection')
                }).catch((error) => {
                    this.$message.show("Klaida keičiant įrašo duomenis.")
                })
            },
            save() {
                this.$axios.post(`/api/privileged/categories/create`, this.fields).then((response) => {
                    this.$message.show("Nauja kategorija pridėta.")
                    this.$store.dispatch('request_category_collection')
                    this.create = false
                }).catch((error) => {
                    this.$message.show("Klaida pridedant naują įrašą.")
                    this.create = false
                })
            }
        },
        components: {
            "v-general-confirmation": require('~/components/general/GeneralConfirmationDialog.vue').default
        },
    }

</script>