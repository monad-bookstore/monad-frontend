<template>
    <v-dialog v-model="visible" persistent max-width="500px">
        <v-card>
            <v-card-title>
                <v-card-title>
                    <span class="headline">Adreso keitimas</span>
                </v-card-title>
                <v-card-text>
                    <v-form ref="modification">
                        <v-text-field clearable v-model="modifying.label"
                            label="Adreso pavadinimas" required></v-text-field>
                        <v-text-field clearable v-model="modifying.addressText"
                            label="Adresas" required></v-text-field>
                        <v-text-field clearable v-model="modifying.city"
                            label="Miestas" required></v-text-field>
                        <v-select v-model="modifying.countryId" :items="countries" label="Šalis"
                            item-value="id" item-text="nicename" dense></v-select>
                        <v-select v-model="modifying.phoneId" :items="numbers" label="Tel. numeris"
                            item-value="id" item-text="label" dense></v-select>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn flat color="primary" @click="close">
                        Atšaukti
                    </v-btn>
                    <v-btn flat color="indigo" @click="save">
                        Išsaugoti
                    </v-btn>
                </v-card-actions>
            </v-card-title>
        </v-card>
    </v-dialog>
</template>
<script>

    export default 
    {
        data() { return {
            visible: this.visibility,
            modifying: this.record
        }},
        props: {
            visibility: {
                required: true
            },
            record: {
                required: true
            },
            countries: {
                required: true,
            },
            numbers: {
                required: true
            }
        },
        mounted() {
            console.log(this.modifying)
        },
        methods: {
            close() {
                this.$emit('update:visibility', false)
                this.visible = false
            },
            save() {
                const payload = {
                    label: this.modifying.label,
                    addressText: this.modifying.addressText,
                    city: this.modifying.city,
                    phoneId: this.modifying.phoneId,
                    countryId: this.modifying.countryId
                }
                
                this.$axios.post(`/api/addresses/modify/${this.modifying.id}`, payload).then((response) => {
                    this.$store.dispatch('show_message', response.data.message)
                    this.$store.dispatch('retrieve_client_addresses')                    
                    this.close()
                }).catch((error) => {
                    const message = _.get(error.response, "data.message", "Įvyko klaida keičiant įrašą.")
                    this.$store.dispatch('show_message', message)
                    this.close()
                })
            }
        },
        watch: {
            visibility(changed, _) {
                this.visible = changed
            },
            record(changed, _) {
                this.modifying = record
            }
        }
    }

</script>
