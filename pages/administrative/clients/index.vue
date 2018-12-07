<template>
    <v-content class="content-overlay">
        <v-container fluid>
            <v-card>
                <v-card-title class="card-title font-raleway-regular">
                    Klientų sąrašas
                    <v-spacer></v-spacer>
                    <v-text-field v-model="search" append-icon="search" label="Kliento paieška" single-line hide-details></v-text-field>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    <v-data-table :headers="table.headers" :search="search"
                        :items="clients" v-model="table.selected"  item-key="username" :pagination.sync="table.pagination">
                        <template slot="no-results">
                            Pagal paieškos terminą rezultatų nerasta.
                        </template>
                        <template slot="items" slot-scope="props">
                            <tr :active="props.selected" @click="props.selected != !props.selected">
                                <td>
                                    {{ props.item.id }}
                                </td>
                                <td>
                                    <v-edit-dialog
                                        :return-value.sync="props.item.username"
                                        lazy @save="save(props.item)">
                                        {{ props.item.username }}
                                        <v-text-field slot="input" v-model="props.item.username" label="Vartotojo vardas" single-line>
                                            </v-text-field>
                                    </v-edit-dialog>
                                </td>
                                <td>
                                    <v-edit-dialog
                                        :return-value.sync="props.item.email"
                                        lazy @save="save(props.item)">
                                        {{ props.item.email }}
                                        <v-text-field slot="input" v-model="props.item.email" label="El. paštas" single-line>
                                            </v-text-field>
                                    </v-edit-dialog>
                                </td>
                                <td> {{ friendly_date(props.item.createdAt) }} </td>
                                <td>
                                    <v-edit-dialog
                                        :return-value.sync="props.item.accessFlag"
                                        lazy @save="save(props.item)">
                                        {{ friendly_access_level(props.item.accessFlag) }}
                                        <v-text-field slot="input" type="number" v-model="props.item.accessFlag" label="Prieigos lygis" single-line>
                                            </v-text-field>
                                    </v-edit-dialog>
                                </td>
                                <td class="text-xs-left">
                                   
                                    <v-btn flat small outline color="red" @click="removeClient(props.item.id)">
                                        Trinti
                                    </v-btn>
                                </td>
                            </tr>
                        </template>
                    </v-data-table>
                </v-card-text>
            </v-card>
            <v-general-confirmation :visibility="remove.dialog" v-bind:visibility.sync="remove.dialog" :confirmed="remove_confirmed">
                <template slot="body">
                    Ar tikrai norite ištrinti šį klientą?
                </template>
            </v-general-confirmation>
        </v-container>
    </v-content>
</template>
<script>

    import moment from 'moment'
    export default {
        middleware: ['preload-client', 'authenticated'],
        layout: 'administrative',
        data: function() {
            return {
                clients: [],
                table: {
                    pagination: {
                        sortBy: 'username'
                    },
                    selected: [],
                    headers: [
                        { text: "ID", value: 'id' },
                        { text: "Vartotojas", align: "left", value: 'username' },
                        { text: "El. paštas", value: "email" },
                        { text: "Registracijos data", value: "createdAt" },
                        { text: "Prieigos lygis", value: "accessFlag" },
                        { text: "Funkcijos", align: "left", value: undefined }
                    ]
                },
                remove: {
                    dialog: false,
                    clientId: -1
                },
                search: ''
            }
        },
        mounted() {
            this.request_clients()
        },
        methods: {
            request_clients() {
                this.$axios.get('/api/privileged/clients/get').then((response) => {
                    this.clients = response.data
                })
            },
            friendly_date(date) {
                return moment(date).format('YYYY-MM-DD')
            },
            friendly_access_level(level) {
                switch(Number(level)) {
                    case 1: return "Administratorius"
                    case 2: return "Vadybininkas"
                    case 3: return "Konsultantas"
                    case 4: return "Darbuotojas"
                }
        
                return "Klientas";
            },
            removeClient(clientId) {
                this.clientId = clientId
                this.remove.dialog = true
            },
            remove_confirmed() {
                const cid = this.clientId
                if (cid == undefined || cid < 0) 
                    return

                this.$axios.get(`/api/privileged/clients/remove/${cid}`).then((response) => {
                    this.request_clients()
                })
            },
            save(client) {
                this.$axios.post(`/api/privileged/clients/modify/${client.id}`, client).then((response) => {
                    this.$message.show('Išsaugota.')
                })
            },
            
        
        },
        components: {
            "v-general-confirmation": require('~/components/general/GeneralConfirmationDialog.vue').default
        }
    }

</script>