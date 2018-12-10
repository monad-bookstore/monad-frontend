<template>
    <v-content class="content-overlay">
        <v-container fluid>
            <v-card>
                <v-card-title class="card-title">
                    Bylos
                    <v-spacer></v-spacer>
                    <v-menu :nudge-width="200" offset-y>
                        <v-btn outline slot="activator" class="mr-3"flat>
                            <v-icon>more_vert</v-icon>
                            Rūšiavimas
                        </v-btn>
                        <v-card>
                            <v-card-text>
                                <v-list>
                                    <v-list-tile>
                                        <v-checkbox
                                            label="Aktyvios bylos"
                                            v-model="options.filter.active"
                                        ></v-checkbox>
                                    </v-list-tile>
                                </v-list>
                                <v-list>
                                    <v-list-tile>
                                        <v-checkbox
                                            label="Uždartos bylos"
                                            v-model="options.filter.completed"
                                        ></v-checkbox>
                                    </v-list-tile>
                                </v-list>
                            </v-card-text>
                        </v-card>
                    </v-menu>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    <template v-if="filteredCases.length > 0">
                        <v-list two-line>
                            <v-list-tile v-for="cs in filteredCases" :key="cs.id" @click="">
                                <v-list-tile-content class="shrink">
                                    <v-list-tile-title>
                                        #{{ cs.id }} {{ cs.title }} 
                                        
                                    </v-list-tile-title>
                                    <v-list-tile-sub-title>
                                        Sukūrimo data: {{ prettyDate(cs.createdAt) }} | Paskutinį kartą atnaujinta: {{ prettyDate(cs.updatedAt) }}
                                    </v-list-tile-sub-title>
                                </v-list-tile-content>
                                <v-divider vertical class="ml-3"></v-divider>
                                <v-list-tile-content class="align-start ml-3">
                                    <v-chip text-color="white" :color="statusOf(cs.status).color">
                                            {{ statusOf(cs.status).text }}
                                    </v-chip>
                                </v-list-tile-content>
                                <v-list-tile-content class="align-end">
                                    <v-btn icon flat color="primary" @click="$router.push(`/client/cases/${cs.id}`)">
                                        <v-icon>arrow_forward_ios</v-icon>
                                    </v-btn>
                                </v-list-tile-content>
                            </v-list-tile>
                        </v-list>
                    </template>
                    <template v-else>
                        Neturite jokių bylų.
                    </template>
                </v-card-text>
            </v-card>
        </v-container>
    </v-content>
</template>
<script>

    import moment from 'moment'
    import { mapGetters } from 'vuex';
    export default {
        middleware: ['preload-client', 'authenticated', 'preload-data'],
        data() {
            return {
                cases: [],
                options: {
                    filter: {
                        active: true,
                        completed: false
                    }
                },
                status: {
                    0: {
                        text: "Byla aktyvi",
                        color: "info"
                    },
                    1: {
                        text: "Byla uždaryta",
                        color: "red"
                    }
                }
            }
        },
        asyncData(context) {
            return context.$axios.get('/api/cases/get').then((response) => {
                return { cases: response.data }
            }).catch((error) => {
                return { cases: [] }
            })
        },
        computed: {
            filteredCases: function() {
                const active = this.options.filter.active ? [0] : []
                const completed = this.options.filter.completed ? [1] : []
                return _.filter(this.cases, function(caser) {
                    return [...active, ...completed].includes(caser.status)
                })
            }
        },
        methods: {
            prettyDate(date) {
                return moment(date).format('YYYY-MM-DD HH:mm')
            },
            statusOf(status) {
                return this.status[status]
            }
        }
    }

</script>
