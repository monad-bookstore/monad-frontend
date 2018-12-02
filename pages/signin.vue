<template>
    <v-content>
        <v-container fill-height>
            <v-layout row justify-center align-center>
                <v-flex xs12 md6>
                    <v-card>
                        <v-card-title class="headline font-raleway-elight text-uppercase">
                            Prisijungimas
                        </v-card-title>
                        <v-divider></v-divider>
                        <v-form v-model="valid" @keyup.enter.native="authorize">
                            <v-card-text>
                                <v-text-field append-icon="account_circle" :loading="loading" 
                                    v-model="username" :rules="username_rules" label="Vartotojo vardas" required></v-text-field>
        
                                <v-text-field append-icon="fingerprint" type="password" :loading="loading"
                                    v-model="password" :rules="password_rules" label="Slaptažodis" required></v-text-field>

                                <nuxt-link to="/registration">
                                    <span class="right mb-3">
                                        Naujos paskyros registracija
                                    </span>
                                </nuxt-link>
                            </v-card-text>
                            <v-btn :disabled="!valid" block color="accent" :class="'rounded-0'" large @click="authorize">
                                Prisijungti
                            </v-btn>
                        </v-form>
                    </v-card>
                    <v-snackbar v-model="error_occured" bottom multi-line>
                        Neteisingas slaptažodis arba vartotojas šiuo prisijungimo vardu neregistruotas.
                        <v-btn color="pink" flat @click="error_occured = false">Uždaryti</v-btn>
                    </v-snackbar>
                </v-flex>
            </v-layout>
        </v-container>
    </v-content>
</template>
<script>

    import Cookie from 'js-cookie'
    export default
    {
        middleware: ['redirect-authorized'],
        data: () => ({
            loading: false,
            valid: false,
            username: '',
            username_rules: [
                v => !!v || "Įveskite vartotojo vardą.",
            ],
            password: '',
            password_rules: [
                v => !!v || 'Įveskite slaptažodį.'
            ],
            error_occured: false,
        }),
        methods: 
        {
            authorize() 
            {
                this.loading = true
                let payload = {
                    username: this.username,
                    password: this.password
                }

                this.$axios.post('/api/authentication/validate', payload).then((response) => {
                    this.loading = false
                    const key = _.get(response.data, 'authorizationKey', undefined)
                    if (key !== undefined) {
                        Cookie.set('bearer', key, { expires: 7 })
                        this.$router.push('/')
                    }

                    this.error_occured = true
                
                }).catch((e) => {
                    this.loading = false
                    this.error_occured = true
                });
            }
        }
    }

</script>