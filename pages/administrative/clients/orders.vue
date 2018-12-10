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
                                <td class="text-xs-right"> 
                                    <v-btn flat small outline color="red" @click="removeConfirmation(props.item.id)">
                                        Trinti
                                    </v-btn>
                                </td>
                            </tr>
                        </template>
                    </v-data-table>
                </v-card-text>
            </v-card>
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
        // Administrator,Manager
        privileges: [1, 2, 3, 4],
        mixins: [assertPrivilage],
        asyncData(context) {
            return context.$axios.get('/api/privileged/orders/get').then((response) => {
                return { 
                    orders: _.filter(response.data, function(order) {
                        return order.client !== null
                    }) 
                }
            }).catch((error) => {
                return { orders: [] }
            })
        },
        data() {
            return {
                datatable: {
                    pagination: {},
                    headers: [
                        { text: "ID", value: "id" },
                        { text: "Užsakovas", value: ["client.profile.name", "client.profile.surname"] },
                        { text: "Užsakovo el. paštas", value: "client.email", sortable: false },
                        { text: "Būsena", value: undefined },
                        { text: "Data", value: undefined },
                        { text: undefined, value: undefined, sortable: false },
                    ]
                },
                search: '',
                status: {
                    0: 'Apmokėjimas sėkmingas', 
                    1: 'Apmokėjimas patvirtintas', 
                    2: 'Užsakymas vykdomas', 
                    3: 'Užsakymas išsiųstas',  
                    4: 'Užsakymas įvykdytas'
                }
            }
        },
        methods: {
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
            }
        }
    }

</script>