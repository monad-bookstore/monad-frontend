<template>
    <v-card-text>
        <template v-if="addresses !== undefined">
            <v-data-table :items="addresses" hide-headers hide-actions>
                <template slot="no-data">
                    Nėra pridėtų adresų.
                </template>
                <template slot="items" slot-scope="props">
                    <tr>
                        <td>{{ props.item.label }}</td>
                        <td>{{ props.item.addressText }}</td>
                        <td class="text-xs-right">
                            <v-btn icon @click="modify_record(props.item)">
                                <v-icon>edit</v-icon>
                            </v-btn>
                            <v-btn icon @click="remove_record(props.item)">
                                <v-icon>delete</v-icon>
                            </v-btn>
                        </td>
                    </tr>
                </template>
            </v-data-table>
            <!-- Modalinis langas adresų kūrimui -->
            <v-settings-address-creation :countries="countries" :numbers="contacts">
                </v-settings-address-creation>
            <!--  Modalinis langas adreso keitimui -->
            <v-settings-address-modification v-if="modify.record !== undefined" :visibility="modify.dialog" :record="modify.record"
                v-bind:visibility.sync="modify.dialog" :countries="countries" :numbers="contacts"></v-settings-address-modification>
            <!-- Modalinis langas adreso trynimo patvirtinimui -->
            <v-general-confirmation :visibility="remove.dialog" v-bind:visibility.sync="remove.dialog" :confirmed="remove_confirmed">
                <template slot="body">
                    Ar tikrai norite ištrinti šį adresą?
                </template>
            </v-general-confirmation>
        </template>
        <template v-else>
            <v-layout fill-height justify-center align-center>
                <v-progress-circular indeterminate></v-progress-circular>
            </v-layout>
        </template>
        <v-snackbar v-model="response.display" bottom>
            {{ response.message }}
            <v-btn color="pink" flat @click="response.display = false">Uždaryti</v-btn>
        </v-snackbar>
    </v-card-text>   
</template>
<script>

    import { mapGetters } from 'vuex';
    export default 
    {
        data() {
            return {
                remove: {
                    record: undefined,
                    dialog: false,
                },
                response: {
                    display: false,
                    message: ''
                },
                modify: {
                    dialog: false,
                    record: undefined
                }
            }
        } ,
        mounted() {
            this.$store.dispatch('request_client_addresses')
            this.$store.dispatch('request_client_contacts')
            this.$store.dispatch('request_country_collection')
        },
        computed: {
            ...mapGetters([
                'client', 'addresses', 'contacts', 'countries'
            ])
        },
        components: {
            "v-settings-address-modification": require('~/components/settings/address/SettingsAddressModification.vue').default,
            "v-settings-address-creation": require('~/components/settings/address/SettingsAddressCreation.vue').default,
            "v-general-confirmation": require('~/components/general/GeneralConfirmationDialog.vue').default
        },
        methods: {
            modify_record(record) {
                this.modify.record = record
                this.modify.dialog = true
            },
            remove_record(record) {
                this.remove.record = record
                this.remove.dialog = true
            },
            remove_confirmed() {
                const removing = _.get(this.remove.record, "id", undefined)
                if (removing == undefined)
                    return

                this.$axios.get(`/api/addresses/remove/${removing}`).then((response) => {
                    this.response.display = true
                    this.response.message = response.data.message
                    this.$store.dispatch('request_client_addresses')
                }).catch((error) => {
                    const message = _.get(error.response, "data.message", "Įvyko klaida trinant įrašą.")
                    this.response.display = true
                    this.response.message = message
                })
            }
        }
    }

</script>
