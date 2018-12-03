<template>
    <v-toolbar flat color="white">
        <v-spacer></v-spacer>
        <v-dialog v-model="options.creation" max-width="500px">
            <v-btn slot="activator" outline color="primary" dark class="mb-2">
                Naujas adresas
            </v-btn>
            <v-card flat>
                <v-card-title>
                    <span class="headline">Naujo adreso kūrimas</span>
                </v-card-title>
                <v-card-text>
                    <v-text-field clearable v-model="fields.label"
                        label="Adreso pavadinimas" required></v-text-field>
                    <v-text-field clearable v-model="fields.addressText"
                        label="Adresas" required></v-text-field>
                    <v-text-field clearable v-model="fields.city"
                        label="Miestas" required></v-text-field>
                    <v-select v-model="fields.countryId" :items="countries" label="Šalis"
                        item-value="id" item-text="nicename" dense></v-select>
                    <v-select v-model="fields.phoneId" :items="numbers" label="Tel. numeris"
                        item-value="id" item-text="label" dense></v-select>
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
        props: {
            countries: {
                required: true
            },
            numbers: {
                required: true
            }
        },
        data() 
        {
            return {
                options: {
                    creation: false
                },
                fields: {
                    label: '',
                    addressText: '',
                    city: '',
                    countryId: '',
                    phoneId: '',
                }
            }
        },
        methods: {
            close() {
                this.options.creation = false
            },
            save() {
                const payload = {
                    label: this.fields.label,
                    addressText: this.fields.addressText,
                    city: this.fields.city,
                    phoneId: this.fields.phoneId,
                    countryId: this.fields.countryId
                }

                this.$axios.post('/api/addresses/create', payload).then((response) => {
                    this.$store.dispatch('retrieve_client_addresses')
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
