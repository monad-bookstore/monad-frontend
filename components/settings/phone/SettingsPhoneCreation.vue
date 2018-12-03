<template>
    <v-toolbar flat color="white">
        <v-spacer></v-spacer>
        <v-dialog v-model="options.creation" max-width="500px">
            <v-btn slot="activator" outline color="primary" dark class="mb-2">
                Pridėti tel. numerį
            </v-btn>
            <v-card flat>
                <v-card-title>
                    <span class="headline">Tel. numerio kūrimas</span>
                </v-card-title>
                <v-card-text>
                    <v-form ref="creational">
                        <v-text-field clearable v-model="fields.label"
                            label="Pavadinimas" required></v-text-field>
                        <v-text-field clearable v-model="fields.number"
                            label="Tel. numeris" required></v-text-field>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn flat color="primary" @click="close">
                        Atšaukti
                    </v-btn>
                    <v-btn flat color="indigo" @click="save">
                        Sukurti
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-toolbar>
</template>
<script>

    export default 
    {
        data() 
        {
            return {
                options: {
                    creation: false
                },
                fields: {
                    label: '',
                    number: ''
                },
                response: {
                    display: false,
                    message: ''
                }
            }
        },
        methods: {
            close() {
                this.options.creation = false
                this.$refs.creational.reset()
            },
            save() {
                const payload = {
                    label: this.fields.label,
                    number: this.fields.number
                }

                this.$axios.post('/api/phone/create', payload).then((response) => {
                    this.$store.dispatch('retrieve_client_numbers')
                    this.$store.dispatch('show_message', response.data.message)                    
                    this.close()
                }).catch((error) => {
                    const message = _.get(error.response, "data.message", "Įvyko klaida pridedant naują įrašą.")
                    this.$store.dispatch('show_message', message)                      
                    this.close()
                })
            }
        }
    }

</script>
