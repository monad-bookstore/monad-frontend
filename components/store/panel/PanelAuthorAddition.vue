<template>
    <v-dialog v-model="visible" persistent max-width="600px">
        <v-card>
            <v-card-title>
                <span class="headline">Autoriaus kūrimas</span>
            </v-card-title>
            <v-card-text>
                <v-form @keyup.enter.native="create">
                    <v-text-field clearable v-model="fields.name"
                        label="Autoriaus vardas" required></v-text-field>
                    <v-text-field clearable v-model="fields.surname"
                        label="Autoriaus pavardė" required></v-text-field>
                    <v-text-field v-model="fields.birth" label="Gimimo metai">
                        </v-text-field>
                    <v-text-field  v-model="fields.death" label="Mirties metai">
                        </v-text-field>
                </v-form>
            </v-card-text>
            <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="close()">Uždaryti</v-btn>
            <v-btn color="pink darken-1" flat @click="save()">Išsaugoti</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>

    export default {
        props: {
            visibility: {
                required: true
            }
        },
        data() {
            return {
                visible: this.visibility,
                state: {
                    loading: false,
                    birth_date_picker: false,
                    death_date_picker: false,
                },
                fields: {
                    name: '',
                    surname: '',
                    birth: null,
                    death: null
                },
                response: {
                    display: false,
                    message: ''
                }
            }
        },
        methods: {
            close() {
                this.$emit('update:visibility', false)
                this.visible = false
            },
            save() {
                const payload = {
                    name: this.fields.name,
                    surname: this.fields.surname,
                    birth: this.fields.birth,
                    death: this.fields.death
                }

                this.$axios.post('/api/privileged/authors/create', payload).then((response) => {
                    this.response.display = true
                    this.response.message = response.data.message
                    this.$store.dispatch('request_author_collection')
                    this.close()
                })
                .catch((error) => {
                    this.response.display = true
                    this.response.message = "Blogai pateikti duomenys."
                })
            }
        },
        watch: {
            visibility(changed, _) {
                this.visible = changed
            }
        }
    }

</script>
