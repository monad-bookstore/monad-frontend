<template>
    <v-content class="content-overlay">
        <v-container fluid>
            <v-card>
                <v-card-title class="card-title font-raleway-regular">
                    Kliento registracija
                </v-card-title>
                <v-form v-model="valid" @keyup.enter.native="register">
                    <v-card-text>

                        <v-text-field append-icon="account_circle" 
                            v-model="username" :rules="username_rules" :error-messages="error.messages['username']" 
                            label="Vartotojo vardas" required></v-text-field>

                        <v-text-field append-icon="fas fa-at" 
                            v-model="email" :rules="email_rules" :error-messages="error.messages['email']" 
                            label="El. pašto adresas" required></v-text-field>

                        <v-text-field append-icon="fingerprint" type="password" 
                            v-model="password" :rules="password_rules" :error-messages="error.messages['password']" 
                            label="Slaptažodis" required></v-text-field>

                        <v-text-field append-icon="fingerprint" type="password" 
                            v-model="password_confirmation" :rules="password_confirmation_rules" label="Pakartokite slaptažodį" required></v-text-field>

                    </v-card-text>
                    <v-card-actions>
                        <v-btn :disabled="!valid" block color="accent" :class="'rounded-0'" large @click="register">
                                Registruoti
                        </v-btn>
                    </v-card-actions>
                </v-form>
            </v-card>
        </v-container>
    </v-content>
</template>
<script>

    export default {
        middleware: ['preload-client', 'authenticated'],
        layout: 'administrative',
        data() 
        {
            return {
                valid: false,
                username: '',
                username_rules: [
                    v => !!v || "Įveskite vartotojo vardą.",
                ],
                email: '',
                email_rules: [
                    v => !!v || "Įveskite el. paštą.",
                    v => /.+@.+/.test(v) || 'Klaidingas el. pašto formatas'
                ],
                password: '',
                password_rules: [
                    v => !!v || 'Įveskite slaptažodį.'
                ],
                password_confirmation: '',
                password_confirmation_rules: [
                    v => !!v || 'Įveskite slaptažodį antrą kartą.',
                    v => v == this.password || 'Slaptažodžiai privalo sutapti.'
                ],
                errors: {
                    username: [],
                    password: [],
                    mail: [],
                },
                error: {
                    fields: ['username', 'password', 'email'],
                    messages: []
                }
            }
        },        
         methods: {
            register() {
                let payload = {
                    username: this.username,
                    password: this.password,
                    mail: this.email
                }

                this.$axios.post("/api/client/register", payload).then((response) => {
                    const data = response.data
                    if(_.has(data, "message")) {
                        this.$message.show("Paskyra klientui sėkmingai sukurta.")
                    }
                }).catch((e) => {
                    const data = _.mapKeys(e.response.data, function(v, k) {
                        return k.toLowerCase()
                    })

                    _.each(this.error.fields, function(field) {
                        if (_.has(data, field)) {
                            this.error.messages[field] = data.field
                        }
                    })

                    setTimeout(() => {
                        this.error.messages = []
                    }, 2500)
                })
            }
        }
    }

</script>
