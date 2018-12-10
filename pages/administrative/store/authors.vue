<template>
    <v-content class="content-overlay">
        <v-container fluid>
            <v-card>
                <v-card-title class="card-title font-raleway-regular">
                    Autorių valdymas
                    <v-spacer></v-spacer>
                    <v-text-field v-model="search" 
                        append-icon="search" 
                        label="Autoriaus paieška" 
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
                        :items="authors" 
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
                                <td> {{ props.item.name }} </td>
                                <td> {{ props.item.surname }} </td>
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
                                        <v-text-field clearable v-model="props.item.name"
                                            label="Autoriaus vardas" required></v-text-field>
                                        <v-text-field clearable v-model="props.item.surname"
                                            label="Autoriaus pavardė" required></v-text-field>
                                        <v-text-field mask="####-##-##" return-masked-value v-model="props.item.birthDate" label="Gimimo metai">
                                            </v-text-field>
                                        <v-text-field mask="####-##-##" return-masked-value v-model="props.item.deathDate" label="Mirties metai">
                                            </v-text-field>
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
                        <v-text-field clearable v-model="fields.name"
                            label="Autoriaus vardas" required></v-text-field>
                        <v-text-field clearable v-model="fields.surname"
                            label="Autoriaus pavardė" required></v-text-field>
                        <v-text-field mask="####-##-##" return-masked-value v-model="fields.birth" label="Gimimo metai">
                            </v-text-field>
                        <v-text-field mask="####-##-##" return-masked-value v-model="fields.death" label="Mirties metai">
                            </v-text-field>
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
                Ar tikrai norite ištrinti šį autorių?
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
                        { text: "Vardas", value: "name" },
                        { text: "Pavardė", value: "surname" },
                        { text: undefined, value: undefined, sortable: false }
                    ]
                },
                create: false,
                fields: {
                    name: '',
                    surname: '',
                    birth: '1900-01-01',
                    death: '1900-01-01',
                },
                search: '',
                remove: {
                    dialog: false,
                    authorId: -1
                },
            }
        },
        computed: {
            ...mapGetters([
                'authors'
            ])
        },
        methods: {
            confirm_removal(id) {
                this.remove.authorId = id
                this.remove.dialog = true
            },
            remove_confirmed() {
                if (this.remove.authorId < 1)
                    return;
                this.$axios.get(`/api/privileged/authors/remove/${this.remove.authorId}`).then((response) => {
                    this.$message.show("Autorius ištrintas.")
                    this.$store.dispatch('request_author_collection')
                }).catch((error) => {
                    this.$message.show("Nenumatyta klaida trinant įrašą.")
                })
            },
            modify(author) {
                const payload = {
                    name: author.name,
                    surname: author.surname,
                    birth: author.birthDate,
                    death: author.deathDate
                }
                this.$axios.post(`/api/privileged/authors/modify/${author.id}`, payload).then((response) => {
                    this.$message.show("Autoriaus duomeys atnaujinti.")
                    this.$store.dispatch('request_author_collection')
                }).catch((error) => {
                    this.$message.show("Klaida keičiant įrašo duomenis.")
                })
            },
            save() {
                this.$axios.post(`/api/privileged/authors/create`, this.fields).then((response) => {
                    this.$message.show("Naujas autorius pridėtas.")
                    this.$store.dispatch('request_author_collection')
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
