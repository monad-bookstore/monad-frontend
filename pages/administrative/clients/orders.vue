<template>
    <v-content class="content-overlay">
        <v-container fluid>
            <v-card>
                <v-card-title class="card-title font-raleway-regular">
                    Užsakymų sąrašas
                    <v-spacer></v-spacer>
                    <v-text-field 
                        v-model="search" 
                        append-icon="search" 
                        label="Užsakymo paieška" 
                        single-line 
                        hide-details
                    >
                        
                    </v-text-field>
                </v-card-title> 
                <v-divider></v-divider>
                <v-card-text>
                    <v-data-table :items="orders" :search="search" :custom-filter="searchFilter" :headers="datatable.headers" :pagination.sync="datatable.pagination">
                        <template slot="no-results">
                            Pagal paieškos terminą rezultatų nerasta.
                        </template>
                        <template slot="items" slot-scope="props">
                            <tr @click="props.expanded = !props.expanded">
                                <td> {{ props.item.id }} </td>
                                <td> {{ prettyPrintClient(props.item.client.profile) }} </td>
                                <td> {{ props.item.client.email }} </td>
                                <td> {{ status[props.item.status] }} </td>
                                <td> {{ prettyPrintDate(props.item.createdAt) }} </td>
                                <td class="text-xs-right" v-if="$client.privileged($AccessLevel.ADMINISTRATOR, $AccessLevel.MANAGER)"> 
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
                                        Užsakymo būsena
                                    </v-tab>
                                    <v-tab>
                                        Informacija
                                    </v-tab>
                                    <v-tab-item>
                                        <v-card flat>
                                            <v-card-text>
                                                <v-select 
                                                    box
                                                    hide-details
                                                    label="Užsakymo statuso atnaujinimas"
                                                    v-model="modify.status" 
                                                    :items="statuses()"
                                                    item-text="text"
                                                    item-value="value">
                                                </v-select>
                                            </v-card-text>
                                            <v-card-actions>
                                                <v-btn block color="primary" @click="changeStatus(props.item.id)">
                                                    Išsaugoti pakeitimus
                                                </v-btn>
                                            </v-card-actions>
                                        </v-card>
                                    </v-tab-item>
                                    <v-tab-item>
                                        <v-card flat>
                                            <v-card-text>
                                                <v-list>
                                                    <v-list-tile>
                                                        <v-list-tile-content class="shrink">
                                                            Pasirinktas adresas:
                                                        </v-list-tile-content>
                                                        <v-list-tile-content class="align-start ml-3">
                                                            {{ props.item.address.label }}
                                                        </v-list-tile-content>
                                                    </v-list-tile>
                                                    <v-list-tile>
                                                        <v-list-tile-content class="shrink">
                                                            Adresas:
                                                        </v-list-tile-content>
                                                        <v-list-tile-content class="align-start ml-3">
                                                            {{ findCountryById(props.item.address.countryId).nicename }}, {{ props.item.address.city }}, {{ props.item.address.addressText }}
                                                        </v-list-tile-content>
                                                    </v-list-tile>
                                                </v-list>
                                            </v-card-text>
                                        </v-card>
                                    </v-tab-item>
                                </v-tabs>
                            </v-card>
                        </template>
                    </v-data-table>
                </v-card-text>
            </v-card>
            <v-general-confirmation :visibility="remove.dialog" v-bind:visibility.sync="remove.dialog" :confirmed="removeConfirmed">
                <template slot="body">
                    Ar tikrai norite ištrinti šį užsakymą?
                </template>
            </v-general-confirmation>
        </v-container>
    </v-content>
</template>
<script>

    import { mapGetters } from 'vuex'
    import assertPrivilage from '@/plugins/mixins/assert-privilege'
    import moment from 'moment'
    export default {
        layout: 'administrative',
        middleware: ['preload-client', 'authenticated', 'preload-data'],
        // Administrator,Manager,Support,Employee
        privileges: [1, 2, 3, 4],
        mixins: [assertPrivilage],
        mounted() {
            this.fetch()
        },
        computed: {
            ...mapGetters([
                'countries'
            ])
        },
        data() {
            return {
                datatable: {
                    pagination: {},
                    headers: [
                        { text: "ID", value: "id" },
                        { text: "Užsakovas", value: undefined },
                        { text: "Užsakovo el. paštas", value: "client.email", sortable: false },
                        { text: "Būsena", value: undefined, sortable: false },
                        { text: "Data", value: "createdAt" },
                        { text: undefined, value: undefined, sortable: false },
                    ]
                },
                orders: [],
                search: '',
                status: {
                    0: 'Apmokėjimas sėkmingas', 
                    1: 'Apmokėjimas patvirtintas', 
                    2: 'Užsakymas vykdomas', 
                    3: 'Užsakymas išsiųstas',  
                    4: 'Užsakymas įvykdytas'
                },
                modify: {
                    status: undefined,
                },
                remove: {
                    dialog: undefined,
                    orderId: -1
                }
            }
        },
        methods: {
            fetch() {
                this.$axios.get('/api/privileged/orders/get').then((response) => {
                    this.orders = _.filter(response.data, function(order) {
                            return order.client !== null
                    }) 
                }).catch((error) => {})
            },
            prettyPrintDate(date) {
                return moment(date).format('YYYY-MM-DD HH:mm')
            },
            prettyPrintClient(profile) {
                if (profile === null || profile === undefined)
                    return `Nenurodyta`
                return `${profile.name} ${profile.surname}`
            },
            searchFilter(items, search, filter) {
                return _.filter(items, function(item) {

                    if (search === ":payment:successful") { return item.status == 0 }
                    else if(search === ":payment:verified") { return item.status == 1 }
                    else if(search === ":processing") { return item.status == 2 }
                    else if(search === ":shipped") { return item.status == 3 }
                    else if(search === ":completed") { return item.status == 4 }
                    else if(search === ":today") { return moment(item.createdAt).isSame(moment(), 'd') }

                    let searchArray = []
                    if (!!item.client) {
                        searchArray.push(`${item.client.email}`)
                        if (!!item.client.profile) {
                            searchArray.push(`${item.client.profile.name} ${item.client.profile.surname}`)
                        }
                    }

                    searchArray.push(item.createdAt)
                    const searchString = searchArray.join(' ')
                    return searchString.toLowerCase().indexOf(search) > -1
                })
            },
            statuses() {
                return _.map(this.status, function(k, v) {
                    return { value: v, text: k }
                })
            },
            findCountryById(countryId) {
                return _.find(this.countries, function(country) {
                    return country.id == countryId
                })
            },
            removeConfirmation(orderId) {
                this.remove.dialog = true
                this.remove.orderId = orderId
            },
            removeConfirmed() {
                this.$axios.get(`/api/privileged/orders/remove/${this.remove.orderId}`).then((response) => {
                    this.$message.show("Užsakymas panaikintas.")
                    this.fetch()
                }).catch((error) => {
                    this.$message.show("Klaida trinant užsakymą.")
                })
            },
            changeStatus(orderId) {
                const status = this.modify.status
                if (status > 4 || status < 0)
                    return
                    
                this.$axios.post(`/api/privileged/orders/status/${orderId}`, { status: status }).then((response) => {
                    this.$message.show("Užsakymo būsena pakeista.")
                    this.fetch()
                }).catch((error) => {
                    this.$message.show("Nepavyko pakeisti užsakymo būsenos.")
                })
            }
        },
        components: {
            "v-general-confirmation": require('~/components/general/GeneralConfirmationDialog.vue').default
        },
    }

</script>