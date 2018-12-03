<template>
    <v-card-text>
        <template v-if="numbers !== undefined">
            <v-data-table :items="numbers" hide-headers hide-actions>
                <template slot="items" slot-scope="props">
                    <tr>
                        <td>{{ props.item.label }}</td>
                        <td>{{ props.item.number }}</td>
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
            <!-- Modalinis langas tel. numerio kūrimui -->
            <v-settings-number-creation></v-settings-number-creation>
            <!-- Modalinis langas tel. numerio keitimui -->
            <v-settings-number-modification v-if="modify.record !== undefined" :visibility="modify.dialog" 
                :record="modify.record" v-bind:visibility.sync="modify.dialog"></v-settings-number-modification>
            <!-- Modalinis langas tel. numerio trynimo patvirtinimui -->
            <v-general-confirmation :visibility="remove.dialog" v-bind:visibility.sync="remove.dialog" :confirmed="remove_confirmed">
                <template slot="body">
                    Ar tikrai norite ištrinti šį tel. numerį?
                </template>
            </v-general-confirmation>
        </template>
        <template v-else>
            <v-layout fill-height justify-center align-center>
                <v-progress-circular indeterminate></v-progress-circular>
            </v-layout>
        </template>
    </v-card-text>   
</template>
<script>

    import { mapGetters } from 'vuex';
    export default 
    {
        data: () => ({
            remove: {
                dialog: false,
                record: undefined,
            },
            modify: {
                dialog: false,
                record: undefined
            }
        }),
        mounted() {
            this.$store.dispatch('retrieve_client_numbers')
        },
        computed: {
            ...mapGetters([
                'client', 'numbers'
            ])
        },
        components: {
            "v-general-confirmation": require('~/components/general/GeneralConfirmationDialog.vue').default,
            "v-settings-number-creation": require('~/components/settings/phone/SettingsPhoneCreation.vue').default,
            "v-settings-number-modification": require('~/components/settings/phone/SettingsPhoneModification.vue').default,
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

                this.$axios.get(`/api/phone/remove/${removing}`).then((response) => {
                    this.$store.dispatch('show_message', response.data.message)
                    this.$store.dispatch('retrieve_client_numbers')
                    this.$store.dispatch('retrieve_client_addresses')
                }).catch((error) => {
                    const message = _.get(error.response, "data.message", "Įvyko klaida trinant įrašą.")
                    this.$store.dispatch('show_message', message)                    
                })
            }
        }
    }

</script>
