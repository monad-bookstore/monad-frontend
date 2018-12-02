<template>
    <v-content>
        <v-container fill-height>
            <v-layout row justify-center align-center>
                <v-flex xs12 md6>
                    <v-card>
                        <v-card-title class="headline font-raleway-elight text-uppercase">
                            Registracija
                        </v-card-title>
                        <v-divider></v-divider>
                        <v-form v-model="valid" @keyup.enter.native="register">
                            <v-card-text>
                                <v-text-field append-icon="account_circle" 
                                    v-model="username" :rules="username_rules" label="Vartotojo vardas" required></v-text-field>

                                <v-text-field append-icon="fas fa-at" 
                                    v-model="email" :rules="email_rules" label="El. pašto adresas" required></v-text-field>

                                <v-text-field append-icon="fingerprint" type="password" 
                                    v-model="password" :rules="password_rules" label="Slaptažodis" required></v-text-field>

                                <v-text-field append-icon="fingerprint" type="password" 
                                    v-model="password_confirmation" :rules="password_confirmation_rules" label="Pakartokite slaptažodį" required></v-text-field>

                            </v-card-text>
                            <v-btn :disabled="!valid" block color="accent" :class="'rounded-0'" large @click="register">
                                Registruotis
                            </v-btn>
                        </v-form>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
    </v-content>
</template>
<script>

    export default {

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
                requested: false,
                successful: false
            }
        },
        methods: {
            register() {
                let payload = {
                    username: this.username,
                    password: this.password
                }
            }
        }
    }
</script>