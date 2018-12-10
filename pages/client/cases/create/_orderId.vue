<template>
    <v-content class="content-overlay">
        <v-container fluid v-if="order !== undefined">
            <v-card>
                <v-card-title class="card-title">
                    Bylos kūrimas užsakymui #{{ order.id }}
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    <v-select box label="Pasirinkite jūsų problemą atinkančią kategorija." 
                        v-model="selection.title" 
                        :items="selection.titles" 
                        return-object>
                    </v-select>
                </v-card-text>
                <v-card-text>
                    <v-textarea box v-model="message" label="Detalus problemos aprašas">
                        </v-textarea>
                </v-card-text>
                <v-card-text>
                    <v-text-field single-line box v-for="attachment in attachments" :key="attachment.id" v-model="attachment.field" :label="`Nuoroda į priedą (${attachment.id})`">
                        <v-btn icon flat @click="removeAttachment(attachment.id)" slot="append">
                            <v-icon>remove</v-icon>
                        </v-btn>
                    </v-text-field>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-btn flat outline color="indigo" @click="addAttachment()">
                        <v-icon>add</v-icon>
                        Prisegti nuorodą
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn flat outline color="red" @click="save">
                        Pateikti
                    </v-btn>
                </v-card-actions>
            </v-card>
            
        </v-container>
    </v-content>
</template>
<script>

    export default {
        middleware: ['preload-client', 'authenticated', 'preload-data'],
        data() {
            return {
                parameter: this.$route.params.orderId,
                order: undefined,
                message: '',
                attachments: [],
                selection: {
                    title: "",
                    titles: [
                        "Užsakymas įvykdytas, bet knygos neatvyko.", 
                        "Knygos pristatytos, tačiau ne tokios kaip užsakyme.", 
                        "Pristatytos knygos buvo prastos būklės",
                        "Kita problema"
                    ]
                }
            }
        },
        mounted() {
            this.fetch()
        },
        methods: {
            fetch() {
                this.$axios.get(`/api/orders/get/${this.parameter}`).then((response) => {
                    this.order = response.data
                }).catch((error) => {
                    this.$router.push('/client/orders')
                })
            },
            addAttachment() {
                const attachment = {
                    id: this.attachments.length + 1,
                    field: ""
                }
                this.attachments.push(attachment)
            },
            removeAttachment(id) {
                this.attachments = _.filter(this.attachments, function(attachment) {
                    return attachment.id != id
                })
            },
            save() {
                const payload = {
                    title: this.selection.title,
                    messages: [{
                        contents: this.message
                    }],
                    attachments: [],
                    orderId: this.order.id
                }

                this.attachments.forEach(element => {
                    payload.attachments.push({
                        attachmentUrl: element.field
                    })
                });

                this.$axios.post('/api/cases/create', payload).then((response) => {
                    this.$message.show('Nauja byla sukurta.')
                    setTimeout(() => {
                        this.$router.push('/client/cases')
                    }, 700)
                }).catch((error) => {
                    this.$message.show('Klaida kuriant naują bylą. Patikrinkite duomenis.')
                })
            }
        }
    }

</script>