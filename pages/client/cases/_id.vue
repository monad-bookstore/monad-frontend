<template>
    <v-content class="content-overlay">
        <v-container fluid v-if="preload != undefined">
            <v-card>
                <v-card-title class="card-title">
                    {{preload.id}}#{{ preload.title }}
                    <v-spacer></v-spacer>
                    <v-btn 
                        flat 
                        outline 
                        color="indigo" 
                        @click="aboutClient"
                        v-if="$client.privileged($AccessLevel.ADMINISTRATOR, $AccessLevel.SUPPORT)"
                    >
                        Informacija
                    </v-btn>
                    <v-btn flat outline color="red" @click="close.dialog = true" v-if="preload.status == 0">
                        Uždaryti bylą
                    </v-btn>
                </v-card-title>
                <v-divider></v-divider>
                <v-card color="grey lighten-3" class="v-card-messaging" flat tile>
                    <v-card-text>
                        <v-layout column>
                            <v-flex v-for="message in messages" :key="message.id">
                                <v-layout :justify-end="message.clientId != client.id">
                                    <v-flex xs4>
                                        <v-list class="py-0 my-3 elevation-2">
                                            <v-list-tile>
                                                <v-list-tile-content>
                                                    <v-subheader class="pl-0">
                                                        <span v-if="message.clientId == client.id">Jūs rašėte</span>
                                                        <span v-else>Jums rašė</span> ({{ prettyDate(message.createdAt) }})
                                                    </v-subheader>
                                                </v-list-tile-content>
                                                <v-list-tile-content class="align-end" v-if="message.attachments.length > 0">
                                                    <v-menu :nudge-right="0" offset-x>
                                                        <v-btn flat slot="activator">
                                                            Prisegta
                                                        </v-btn>
                                                        <v-card>
                                                            <v-card-text>
                                                                <template v-if="message.attachments.length > 0">
                                                                    <a target="blank" 
                                                                        v-for="attachment in message.attachments" 
                                                                        :key="attachment.id" 
                                                                        :href="attachment.attachmentUrl">
                                                                        Prisegta #{{ attachment.id }}
                                                                    </a>
                                                                </template>
                                                                <template v-else>
                                                                    Prisegtų nuorodų nėra.
                                                                </template>
                                                            </v-card-text>
                                                        </v-card>
                                                    </v-menu>
                                                </v-list-tile-content>
                                            </v-list-tile>
                                            <v-divider></v-divider>
                                            <v-list-tile>
                                                <v-list-tile-content>
                                                    {{ message.contents }}
                                                </v-list-tile-content>
                                            </v-list-tile>
                                        </v-list>
                                    </v-flex>
                                </v-layout>
                            </v-flex>
                        </v-layout>
                    </v-card-text>
                </v-card>
                <v-divider></v-divider>
                <template v-if="preload.status == 0">
                    <v-card-text>
                        <v-textarea 
                            label="Nauja žinutė"
                            v-model="message" 
                            class="mb-1"
                            hide-details
                            box>
    
                        </v-textarea>
                    </v-card-text>
                    <v-card-text v-if="attachments.length > 0">
                        <v-text-field 
                            hide-details box v-for="attachment in attachments" 
                            :key="attachment.id" v-model="attachment.field" :label="`Nuoroda į priedą (${attachment.id})`"
                            class="my-2">
                            <v-btn icon flat @click="removeAttachment(attachment.id)" slot="append">
                                <v-icon>remove</v-icon>
                            </v-btn>
                        </v-text-field>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions>
                        <v-btn flat outline color="indigo" @click="addAttachment()">
                            <v-icon>add</v-icon>
                            Prisegti nuorodą
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn flat outline color="red" @click="post">
                            Siųsti
                        </v-btn>
                    </v-card-actions>
                </template>
                <template v-else>
                    <v-card-text>
                        Byla uždaryta ir į ją atsakyti negalima.
                    </v-card-text>
                </template>
            </v-card>
            <v-general-confirmation :visibility="close.dialog" v-bind:visibility.sync="close.dialog" :confirmed="close_confirmed">
                <template slot="body">
                    Ar tikrai norite uždaryti šią bylą?
                </template>
            </v-general-confirmation>
            <v-dialog v-if="$client.privileged($AccessLevel.ADMINISTRATOR, $AccessLevel.SUPPORT)" v-model="about.dialog" width="500px">
                <v-card flat>
                    <v-card-title class="card-title">
                        Kliento informacija
                        <v-spacer></v-spacer>
                        <v-btn flat icon @click="about.dialog = false">
                            <v-icon>close</v-icon>
                        </v-btn>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-list>
                        <v-list-tile>
                            <v-list-tile-content>
                                Klientas:
                            </v-list-tile-content>
                            <v-list-tile-content class="align-end">
                                {{ prettyPrintClient() }}
                            </v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile>
                            <v-list-tile-content>
                                El. paštas:
                            </v-list-tile-content>
                            <v-list-tile-content class="align-end">
                                {{ preload.client.email }}
                            </v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile>
                            <v-list-tile-content>
                                Registracijos data:
                            </v-list-tile-content>
                            <v-list-tile-content class="align-end">
                                {{ prettyDate(preload.client.createdAt) }}
                            </v-list-tile-content>
                        </v-list-tile>
                        <v-divider></v-divider>
                        <v-list-tile>
                            <v-list-tile-content>
                                Užsakymo ID:
                            </v-list-tile-content>
                            <v-list-tile-content class="align-end">
                                {{ preload.order.id }}
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list>
                </v-card>
            </v-dialog>
        </v-container>
    </v-content>
</template>
<script>

    import { mapGetters } from 'vuex';
    import moment from 'moment'
    export default {
        middleware: ['preload-client', 'authenticated', 'preload-data'],
        data() {
            return {
                parameter: this.$route.params.id,
                preload: undefined,
                message: '',
                attachments: [],
                close: {
                    dialog: false,
                },
                about: {
                    dialog: false
                }
            }
        },
        mounted() {
            this.fetch()
        },
        methods: {
            fetch() {
                const requrl = !this.$client.privileged(this.$AccessLevel.ADMINISTRATOR, this.$AccessLevel.SUPPORT) ?
                    `/api/cases/get/${this.parameter}` : `/api/privileged/cases/get/${this.parameter}`

                this.$axios.get(requrl).then((response) => {
                    this.preload = response.data
                }).catch((error) => {
                    this.$router.push('/client/cases')
                })
            },
            prettyDate(date) {
                return moment(date).format('YYYY-MM-DD HH:mm')
            },
            prettyPrintClient() {
                const profile = this.preload.client.profile
                if (profile == undefined)
                    return "Nenurodyta"
                return profile.name + " " + profile.surname
            },
            addAttachment() {
                const attachment = {
                    id: this.attachments.length + 1,
                    field: ""
                }
                this.attachments.push(attachment)
            },
            removeAttachment(id) {
                this.attachments = _.filter(this.attachments, function(attachment) {
                    return attachment.id != id
                })
            },
            post() {
                if (this.message.length < 1)
                    return

                const payload = {
                    contents: this.message,
                    attachments: [],
                }

                this.attachments.forEach(element => {
                    payload.attachments.push({
                        attachmentUrl: element.field
                    })
                });

                const requrl = !this.$client.privileged(this.$AccessLevel.ADMINISTRATOR, this.$AccessLevel.SUPPORT) ?
                    `/api/cases/post/${this.preload.id}` : `/api/privileged/cases/post/${this.preload.id}`

                this.$axios.post(requrl, payload).then((response) => {
                    this.$message.show('Žinutė įrašyta.')
                    this.fetch()
                }).catch((error) => {
                    this.$message.show('Nenumatyta klaida įrašant žinutę.')
                })
            },
            close_confirmed() {
                const requrl = !this.$client.privileged(this.$AccessLevel.ADMINISTRATOR, this.$AccessLevel.SUPPORT) ?
                    `/api/cases/close/${this.preload.id}` : `/api/privileged/cases/close/${this.preload.id}`

                this.$axios.get(requrl).then((response) => {
                    this.$message.show('Byla uždaryta.')
                    this.fetch()
                }).catch((error) => {
                    this.$message.show('Nenumatyta klaida bandant uždaryti bylą.')
                })
            },
            aboutClient() {
                this.about.dialog = true
            }
        },
        computed: {
            ...mapGetters([
                'client'
            ]),
            messages: function() {
                return _.get(this.preload, "messages", [])
            }
        },
        components: {
            "v-general-confirmation": require('~/components/general/GeneralConfirmationDialog.vue').default
        }
    }

</script>
<style lang="scss">

    .v-list-comment {
        max-width: calc(100% / 3) !important;
        margin: 8px;
    }

    .v-card-messaging {
        max-height: 380px !important;
        overflow-y: auto;
    }

</style>
