<template>
    <v-container>
        <v-card flat>
            <v-form v-model="valid" @keyup.enter.native="register">
                <v-card-text>
                    <v-text-field clearable v-model="fields.title"
                        label="Knygos pavadinimas" required></v-text-field>
                    <v-select v-model="fields.authors" :items="authors" label="Knygos autoriai"
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
                    <v-select v-model="fields.category" :items="categories" label="Knygos kategorija"
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
                    <v-text-field clearable v-model="fields.price"
                        label="Knygos kaina" required></v-text-field>
                    <v-text-field clearable v-model="fields.pages"
                        label="Knygos puslapių skaičius" required></v-text-field>
                    <v-textarea clearable v-model="fields.description"
                        label="Knygos aprašymas" required></v-textarea>
                </v-card-text>
            </v-form>
        </v-card>
        <v-panel-author-creation :visibility="dialogs.author_creation" v-bind:visibility.sync="dialogs.author_creation">
            </v-panel-author-creation>
        <v-panel-category-creation :visibility="dialogs.category_creation" v-bind:visibility.sync="dialogs.category_creation">
            </v-panel-category-creation>
    </v-container>
</template>
<script>
    
    export default 
    {
        data: () => ({
            valid: false,
            dialogs: {
                author_creation: false,
                category_creation: false
            },
            fields: {
                title: '',
                authors: [],
                category: 0,
                price: '',
                pages: '',
                description: ''
            }
        }),
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
            } 
        },
        components: {
            "v-panel-author-creation": require('~/components/store/panel/PanelAuthorAddition.vue').default,
            "v-panel-category-creation": require('~/components/store/panel/PanelCategoryAddition.vue').default,
        }
    }

</script>

