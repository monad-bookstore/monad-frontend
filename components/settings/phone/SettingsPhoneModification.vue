<template>
    <v-dialog v-model="visible" persistent max-width="500px">
        <v-card>
            <v-card-title>
                <v-card-title>
                    <span class="headline">Tel. numerio keitimas</span>
                </v-card-title>
                <v-card-text>
                    <v-form ref="modification">
                        <v-text-field clearable v-model="modifying.label"
                            label="Pavadinimas" required></v-text-field>
                        <v-text-field clearable v-model="modifying.number"
                            label="Tel. numeris" required></v-text-field>
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
        },
        methods: {
            close() {
                this.$emit('update:visibility', false)
                this.visible = false
            },
            save() {
                const payload = {
                    label: this.modifying.label,
                    number: this.modifying.number
                }
                
                this.$axios.post(`/api/phone/modify/${this.modifying.id}`, payload).then((response) => {
                    this.$message.show(response.data.message)
                    this.$store.dispatch('request_client_contacts')                    
                    this.close()
                }).catch((error) => {
                    const message = _.get(error.response, "data.message", "Įvyko klaida keičiant įrašą.")
                    this.$message.show(message)
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
