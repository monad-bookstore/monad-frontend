<template>
    <v-layout>
        <!-- <v-snackbar v-model="response.display" :bottom="true" :timeout="timeout">
            {{ response.message }}
            <v-btn color="pink" flat @click="response.display = false">Uždaryti</v-btn>
        </v-snackbar>         -->
        <v-dialog v-model="visible" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">Knygos keitimas</span>
                </v-card-title>
                <v-card-text>
                    <v-form @keyup.enter.native="save">
                        <v-card-text>
                            <v-text-field clearable v-model="modifying.title"
                                label="Knygos pavadinimas" required :error-messages="error.messages['title']"></v-text-field>
                            <v-select v-model="modifying.authors" :items="authors" label="Knygos autoriai" :error-messages="error.messages['authors']"
                                item-value="id" :item-text="s_author_display" multiple dense :menu-props="{ 'closeOnContentClick': true }"></v-select>
                            <v-select v-model="modifying.categoryId" :items="filtered_categories" label="Knygos kategorija" :error-messages="error.messages['categoryid']"
                                item-value="id" item-text="label" :menu-props="{ 'closeOnContentClick': true }"></v-select>
                            <v-text-field clearable v-model="modifying.coverUrl" :error-messages="error.messages['cover']"
                                label="Knygos viršelio adresas" required></v-text-field>
                            <v-text-field clearable v-model="modifying.price" :error-messages="error.messages['price']"
                                label="Knygos kaina" required></v-text-field>
                            <v-text-field clearable v-model="modifying.pages" :error-messages="error.messages['pages']"
                                label="Knygos puslapių skaičius" required></v-text-field>
                            <v-textarea clearable v-model="modifying.description" :error-messages="error.messages['description']"
                                label="Knygos aprašymas" required></v-textarea>
                        </v-card-text>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat @click="close">Uždaryti</v-btn>
                    <v-btn color="pink darken-1" flat >Išsaugoti</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-layout>
</template>
<script>

    import { mapGetters } from 'vuex'
    export default {
        data() {
            return {
                modifying: this.product,
                visible: this.visibility,
                error: {
                    fields: ['title', 'authors', 'categoryid', 'cover', 'price', 'pages', 'description'],
                    messages: {}
                },
                response: {
                    display: false,
                    message: ''
                },
            }
        },
        props: {
            visibility: {
                required: true
            },
            product: {
                required: true
            },
        },
        watch: {
            visibility(changed, _) {
                this.visible = changed
            },
            product(changed, _) {
                this.modifying = this.product
            }
        },
        methods: {
            s_author_display(author) {
                return `${author.name} ${author.surname}`
            },
            close() {
                this.$emit('update:visibility', false)
                this.visible = false
            },
            save() {

            }
        },
        computed: {
            ...mapGetters([
                'authors', 'filtered_categories'
            ])
        }
    }

</script>
