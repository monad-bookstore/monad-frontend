<template>
    <v-content class="content-overlay">
        <v-container fluid>
            <v-card>
                <v-card-title class="card-title">
                    Bylos
                    <v-spacer></v-spacer>
                    <v-text-field label="Bylos paieška" v-model="search" single-line append-icon="search" hide-details>
                        </v-text-field>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    <v-data-table :headers="datatable.headers" :items="cases" :search="search" :pagination.sync="datatable.pagination">
                        <template slot="no-results">
                            Pagal paieškos terminą rezultatų nerasta.
                        </template>
                        <template slot="items" slot-scope="props">
                            <tr @click="props.expanded = !props.expanded">
                                <td> {{ props.item.id }} </td>
                                <td> {{ prettyPrintClient(props.item.client.profile) }} </td>
                                <td> {{ props.item.title }} </td>
                                <td> {{ prettyPrintDate(props.item.createdAt) }} </td>
                                <td> {{ consultant(props.item).fullname }} </td>
                                <td class="text-xs-right">
                                    <v-btn flat color="red" @click="assign(props.item.id)">
                                        Prisiskirti
                                    </v-btn>
                                    <router-link :to="`/client/cases/${props.item.id}`" target="_blank">
                                        <v-btn flat color="indigo">
                                            Peržiūrėti        
                                        </v-btn>
                                    </router-link>
                                </td>
                            </tr>
                        </template>
                        <template slot="expand" slot-scope="props">
                            <v-card flat>
                            </v-card>
                        </template>
                    </v-data-table>
                </v-card-text>
            </v-card>
        </v-container>
    </v-content>
</template>
<script>

    import { mapGetters } from 'vuex'
    import moment from 'moment'
    export default {
        middleware: ['preload-client', 'authenticated', 'preload-data'],
        layout: 'administrative',
        data() {
            return {
                cases: undefined,
                datatable: {
                    pagination: {},
                    headers: [
                        { text: "ID", value: "id" },
                        { text: "Klientas", value: "client.profile.name" },
                        { text: "Problema", value: "title" },
                        { text: "Sukūrimo data", value: undefined },
                        { text: "Konsultantas", value: undefined },
                        { text: undefined, value: undefined },
                    ]
                },
                search: ''
            }
        },
        mounted() {
            this.fetch()
        },
        methods: {
            fetch() {
                this.$axios.get('/api/privileged/cases/get').then((response) => {
                    this.cases = response.data
                }).catch((error) => {
                    this.$message.show('Klaida gaunant bylų sąrašą.')
                })
            },
            prettyPrintDate(date) {
                return moment(date).format('YYYY-MM-DD HH:mm')
            },
            prettyPrintClient(profile) {
                if (profile === null || profile === undefined)
                    return `Nenurodyta`
                return `${profile.name} ${profile.surname}`
            },
            consultant(item) {
                const consultant = _.get(item, "support", undefined)
                if (consultant == undefined) {
                    return {
                        fullname: "Nepriskirtas"
                    }
                }

                return { 
                    fullname: this.prettyPrintClient(consultant.profile)
                }
            },
            assign(caseId) {
                const payload = {
                    caseId: caseId,
                    supportId: this.client.id  
                }
                this.$axios.post('/api/privileged/cases/assign', payload).then((response) => {
                    this.$message.show('Sėkimgai prisiskirta.')
                    this.fetch()
                }).catch((error) => {
                    this.$message.show('Prisiskirti prie šios bylos nepavyko.')
                })
            }
        },
        computed: {
            ...mapGetters([
                'client'
            ])
        }
    }

</script>