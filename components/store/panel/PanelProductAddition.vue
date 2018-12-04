<template>
    <v-container>
        <v-card flat>
            <v-form v-model="valid" @keyup.enter.native="save">
                <v-card-text>
                    <v-text-field clearable v-model="fields.title"
                        label="Knygos pavadinimas" required :error-messages="error.messages['title']"></v-text-field>
                    <v-select v-model="fields.authors" :items="authors" label="Knygos autoriai" :error-messages="error.messages['authors']"
                        item-value="id" :item-text="s_author_display" multiple dense :menu-props="{ 'closeOnContentClick': true }">
                        <v-list-tile slot="append-item" ripple @click="dialogs.author_creation = true">
                            <v-list-tile-avatar color="grey lighten-3">
                                <v-icon>assignment_ind</v-icon>
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                                <v-list-tile-title>
                                    Nėra reikiamo autoriaus?
                                </v-list-tile-title>
                                <v-list-tile-sub-title>
                                    Paspausk ir pridėk.
                                </v-list-tile-sub-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-select>
                    <v-select v-model="fields.category" :items="categories" label="Knygos kategorija" :error-messages="error.messages['categoryid']"
                        item-value="id" item-text="label" :menu-props="{ 'closeOnContentClick': true }">
                        <v-list-tile slot="append-item" ripple @click="dialogs.category_creation = true">
                            <v-list-tile-avatar color="grey lighten-3">
                                <v-icon>category</v-icon>
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                                <v-list-tile-title>
                                    Nėra reikiamos kategorijos?
                                </v-list-tile-title>
                                <v-list-tile-sub-title>
                                    Paspausk ir pridėk.
                                </v-list-tile-sub-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-select>
                    <v-text-field clearable v-model="fields.cover" :error-messages="error.messages['cover']"
                        label="Knygos viršelio adresas" required></v-text-field>
                    <v-text-field clearable v-model="fields.price" :error-messages="error.messages['price']"
                        label="Knygos kaina" required></v-text-field>
                    <v-text-field clearable v-model="fields.pages" :error-messages="error.messages['pages']"
                        label="Knygos puslapių skaičius" required></v-text-field>
                    <v-textarea clearable v-model="fields.description" :error-messages="error.messages['description']"
                        label="Knygos aprašymas" required></v-textarea>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="pink darken-1" flat @click="save()">Išsaugoti</v-btn>
                </v-card-actions>
            </v-form>
        </v-card>
        <v-panel-author-creation :visibility="dialogs.author_creation" v-bind:visibility.sync="dialogs.author_creation">
            </v-panel-author-creation>
        <v-panel-category-creation :visibility="dialogs.category_creation" v-bind:visibility.sync="dialogs.category_creation">
            </v-panel-category-creation>
        <v-snackbar v-model="response.display" bottom>
            {{ response.message }}
            <v-btn color="pink" flat @click="response.display = false">Uždaryti</v-btn>
        </v-snackbar>
    </v-container>
</template>
<script>
    
    export default 
    {
        data() {
            return {
                valid: false,
                dialogs: {
                    author_creation: false,
                    category_creation: false
                },
                fields: {
                    title: '',
                    authors: [],
                    category: 0,
                    cover: '',
                    price: '',
                    pages: '',
                    description: ''
                },
                error: {
                    fields: ['title', 'authors', 'categoryid', 'cover', 'price', 'pages', 'description'],
                    messages: {}
                },
                response: {
                    display: false,
                    message: ''
                }
            }
        },
        computed: {
            authors_empty: function() {
                return this.fields.authors.length < 1
            }
        },
        props: {
            authors: {
                required: true
            },
            categories: {
                required: true
            }
        },
        methods: {
            s_author_display(author) {
                return `${author.name} ${author.surname}`
            },
            save() {
                const payload = {
                    title: this.fields.title,
                    authors: this.fields.authors,
                    categoryId: this.fields.category,
                    cover: this.fields.cover,
                    price: this.fields.price,
                    pages: this.fields.pages,
                    description: this.fields.description
                }

                this.$axios.post('/api/privileged/books/create', payload).then((response) => {
                    this.response.display = true
                    this.response.message = response.data.message
                    this.$store.dispatch('retrieve_products')
                })
                .catch((error) => {
                    const data = _.mapKeys(error.response.data, function(v, k) {
                        return k.toLowerCase()
                    })
                    _.each(error.fields, function(field) {
                        if (_.has(data, field)) {
                            error.messages[field] = data.field
                        }
                    })
                    setTimeout(() => {
                        error.messages = {}
                    }, 2000)
                })
            }
        },
        components: {
            "v-panel-author-creation": require('~/components/store/panel/PanelAuthorAddition.vue').default,
            "v-panel-category-creation": require('~/components/store/panel/PanelCategoryAddition.vue').default,
        }
    }

</script>

