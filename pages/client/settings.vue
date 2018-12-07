<template>
    <v-content class="content-overlay">
        <v-container fluid fill-height>
            <v-card height="100%" width="100%" class="elevation-2">
                <v-layout row fill-height>
                    <v-flex fill-height>
                        <v-navigation-drawer mobile-break-point="0">
                            <v-toolbar flat color="transparent">
                                <v-list>
                                    <v-list-tile>
                                        <v-list-tile-title class="title font-raleway-elight text-uppercase text-xs-center">
                                            Nustatymai
                                        </v-list-tile-title>
                                    </v-list-tile>
                                </v-list>
                            </v-toolbar>
                            <v-list class="pt-1">
                                <v-list-tile  @click="section = 1">
                                    <v-list-tile-action>
                                        <v-icon>fas fa-user</v-icon>
                                    </v-list-tile-action>
                                    <v-list-tile-content>
                                        Paskyra
                                    </v-list-tile-content>
                                </v-list-tile>
                                <v-list-tile  @click="section = 4">
                                    <v-list-tile-action>
                                        <v-icon>fas fa-fingerprint</v-icon>
                                    </v-list-tile-action>
                                    <v-list-tile-content>
                                        Profilis
                                    </v-list-tile-content>
                                </v-list-tile>
                                <v-list-tile  @click="section = 2">
                                    <v-list-tile-action>
                                        <v-icon>fas fa-lock</v-icon>
                                    </v-list-tile-action>
                                    <v-list-tile-content>
                                        Saugumas
                                    </v-list-tile-content>
                                </v-list-tile>
                                <v-list-tile  @click="section = 3">
                                    <v-list-tile-action>
                                        <v-icon>fas fa-map-marker-alt</v-icon>
                                    </v-list-tile-action>
                                    <v-list-tile-content>
                                        Adresai
                                    </v-list-tile-content>
                                </v-list-tile>
                                <v-list-tile  @click="section = 5">
                                    <v-list-tile-action>
                                        <v-icon>fas fa-address-book</v-icon>
                                    </v-list-tile-action>
                                    <v-list-tile-content>
                                        Telefono numeriai
                                    </v-list-tile-content>
                                </v-list-tile>
                            </v-list>
                        </v-navigation-drawer>
                    </v-flex>
                    <v-flex xs10>
                        <v-container>
                            <template v-if="section === 1">
                                <v-card-title class="headline font-raleway-elight text-uppercase">
                                    Paskyros nustatymai
                                </v-card-title>
                                <v-divider></v-divider>
                                <v-card-text>
                                    <v-text-field append-icon="account_circle" 
                                        label="Vartotojo vardas" v-model="client.username" disabled 
                                        messages="Vartotojo vardo pakeisti negalima."></v-text-field>
                                </v-card-text>
                                <v-subheader>Susisiekimas</v-subheader>
                                <v-card-text>
                                    <v-text-field :rules="email_rules" label="El. paštas" :loading="loaders.mail"
                                            v-model="fields.email" required clearable>

                                        <v-btn slot="append-outer" color="indigo" 
                                            outline class="mx-0" style="top: -12px" @click="modifyMail">
                                            Išsaugoti
                                        </v-btn>
                                    </v-text-field>
                                </v-card-text>
                                <v-subheader class="red--text">
                                    Pavojaus zona
                                </v-subheader>
                                <v-card-text>
                                    <v-btn color="red" class="white--text ml-0">
                                        Ištrinti paskyrą
                                        <v-icon right dark>delete_forever</v-icon>
                                    </v-btn>
                                </v-card-text>
                            </template>
                            <template v-if="section === 4">
                                <v-card-title class="headline font-raleway-elight text-uppercase">
                                    Profilio nustatymai
                                </v-card-title>
                                <v-divider></v-divider>
                                <v-card-text>
                                    <v-form v-model="fields.profile.valid" @keyup.enter.native="modifyProfile">    
                                        <v-text-field :rules="name_rules" label="Vardas" :loading="loaders.name"
                                                v-model="profile.data.name" required clearable></v-text-field>
                                        <v-text-field :rules="surname_rules" label="Pavardė" :loading="loaders.surname"
                                                v-model="profile.data.surname" required clearable></v-text-field>

                                        <v-btn :disabled="!fields.profile.valid" color="indigo" outline @click="modifyProfile" class="ml-0">
                                            Išsaugoti</v-btn>
                                    </v-form>
                                </v-card-text>
                            </template>
                            <template v-if="section === 2">
                                <v-card-title class="headline font-raleway-elight text-uppercase">
                                    Saugumo nustatymai
                                </v-card-title>
                                <v-divider></v-divider>
                                <v-card-text>
                                    <v-form v-model="fields.password.valid" @keyup.enter.native="modifyPassword">   
                                        
                                        <v-text-field type="password" :loading="loaders.passwords"
                                            v-model="fields.password.current" :rules="password_rules" label="Dabartinis slaptažodis" required></v-text-field>

                                        <v-text-field type="password" :loading="loaders.passwords"
                                            v-model="fields.password.new" :rules="password_rules" label="Slaptažodis" required></v-text-field>

                                        <v-text-field type="password" :loading="loaders.passwords"
                                            v-model="fields.password.confirmation" :rules="password_confirmation_rules" label="Pakartokite slaptažodį" required></v-text-field>

                                        <v-btn :disabled="!fields.password.valid" color="indigo" outline @click="modifyPassword" class="ml-0">
                                            Išsaugoti</v-btn>
                                    </v-form>
                                </v-card-text>
                            </template>
                            <template v-if="section === 3">
                                <v-card-title class="headline font-raleway-elight text-uppercase">
                                    Adresai
                                </v-card-title>
                                <v-divider></v-divider>
                                <v-settings-address></v-settings-address>
                            </template>
                            <template v-if="section === 5">
                                <v-card-title class="headline font-raleway-elight text-uppercase">
                                    Telefono numeriai
                                </v-card-title>
                                <v-divider></v-divider>
                                <v-settings-phone></v-settings-phone>
                            </template>
                        </v-container>
                    </v-flex>
                </v-layout>
            </v-card>
        </v-container>
    </v-content>
</template>
<script>

    import { mapGetters } from 'vuex'
    export default {
        middleware: ['preload-client', 'authenticated'],
        data() {
            return {
                section: 1,
                email_rules: [
                    v => /.+@.+/.test(v) && v.length > 0 || 'Klaidingas el. pašto formatas'
                ],
                name_rules: [
                    v => !!v || 'Įveskite vardą.'
                ],
                surname_rules: [
                    v => !!v || 'Įveskite pavardę.'
                ],
                password_rules: [
                    v => !!v || 'Įveskite slaptažodį.'
                ],
                password_confirmation_rules: [
                    v => !!v || 'Įveskite slaptažodį antrą kartą.',
                    v => v == this.fields.password.new || 'Slaptažodžiai privalo sutapti.'
                ],
                fields: {
                    email: this.$store.getters.client.email,
                    profile: {
                        valid: false,
                        name: '',
                        surname: ''
                    },
                    password: {
                        valid: false,
                        current: "",
                        new: "",
                        confirmation: ""
                    },
                    address: {

                    }
                },
                loaders: {
                    mail: false,
                    name: false,
                    surname: false,
                    passwords: false,
                },
            }
        },
        asyncData(context) {
            return context.$axios.get('/api/profile/get').then((response) => {
                return { profile: response.data }
            }).catch((e) => {
                return { 
                    profile: { 
                        success: false, 
                        data: {
                            name: "",
                            surname: ""
                        }
                    } 
                }
            })
        },
        computed: {
            ...mapGetters([
                'client'
            ])
        },
        methods: {
            modifyMail() {
                const mail = this.fields.email
                if (mail == this.client.email)
                    return
                
                this.loaders.mail = true
                const payload = {
                    email: mail
                }

                this.$axios.post('/api/client/modify/mail', payload).then((response) => {
                    this.$message.show('El. pašto adresas pakeistas.')
                    this.$store.dispatch('request_client_data')
                    this.loaders.mail = false
                }).catch((e) => {
                    this.$message.show('Klaida keičiant el. pašto adresą.')
                    this.loaders.mail = false
                })
            },
            modifyProfile() {
                const payload = {
                    name: this.profile.data.name || "",
                    surname: this.profile.data.surname || ""
                }

                this.loaders.name = true
                this.loaders.surname = true
                this.$axios.post('/api/profile/modify', payload).then((response) => {
                    this.$message.show('Profilio nustatymai atnaujinti.')
                    this.loaders.name = false
                    this.loaders.surname = false
                }).catch((e) => {
                    this.$message.show('Klaida keičiant profilio nustatymus.')
                    this.loaders.name = false
                    this.loaders.surname = false
                })
            },
            modifyPassword() {
                const payload = {
                    currentPassword: this.fields.password.current || "",
                    password: this.fields.password.new || ""
                }

                this.loaders.passwords = true
                this.$axios.post('/api/client/modify/password', payload).then((response) => {
                    this.$message.show(response.data.message)
                    this.loaders.passwords = false
                }).catch((e) => {
                    this.$message.show(e.response.data.message)
                    this.loaders.passwords = false
                })
            }
        },
        components: {
            "v-settings-address": require('~/components/settings/address/SettingsAddressComponent.vue').default,
            "v-settings-phone": require('~/components/settings/phone/SettingsPhoneComponent.vue').default,
        }
    }

</script>
<style lang="scss">

    .v-list__tile {
        font-family: Raleway;
        font-weight: 300;
        font-size: 16px !important;
    }

</style>
