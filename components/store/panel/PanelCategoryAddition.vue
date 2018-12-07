<template>
    <v-layout>
        <v-snackbar v-model="response.display" :bottom="true" :timeout="timeout">
            {{ response.message }}
            <v-btn color="pink" flat @click="response.display = false">Uždaryti</v-btn>
        </v-snackbar>        
        <v-dialog v-model="visible" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">Kategorijos kūrimas</span>
                </v-card-title>
                <v-card-text>
                    
                    <v-form @keyup.enter.native="create">
                        <v-text-field clearable v-model="fields.label"
                            label="Kategorijos pavadinimas" required></v-text-field>
                        <v-select v-model="fields.parent" :items="subcategories" label="Subkategorija"
                            item-value="id" :item-text="category_label">
                            <v-list-tile slot="prepend-item" @click="fields.parent = 0" ripple>
                                <v-list-tile-avatar color="grey lighten-3">
                                    <v-icon>category</v-icon>
                                </v-list-tile-avatar>
                                <v-list-tile-content>
                                    <v-list-tile-title>
                                        Pažymėti kaip skirtuką
                                    </v-list-tile-title>
                                </v-list-tile-content>
                            </v-list-tile>
                        </v-select>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" flat @click="close()">Uždaryti</v-btn>
                <v-btn color="pink darken-1" flat @click="save()">Išsaugoti</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-layout>
</template>
<script>

    import { mapGetters } from 'vuex'
    export default 
    {
        props: {
            visibility: {
                required: true
            }
        },
        data() {
            return {
                visible: this.visibility,
                timeout: 555555555,
                state: {

                },
                fields: {
                    label: '',
                    parent: 0
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
                    label: this.fields.label,
                    parentId: this.fields.parent
                }

                this.$axios.post('/api/privileged/categories/create', payload).then((response) => {
                    this.response.display = true
                    this.response.message = response.data.message
                    this.$store.dispatch('request_category_collection')
                    this.close()                    
                })
                .catch((error) => {
                    this.response.display = true
                    if (_.has(error.response.data, "message")) {
                        this.response.message = error.response.data.message
                    } else {
                        this.response.message = "Blogai pateikti duomenys."
                    }
                    this.close()
                })
            },
            category_label(category) {
                const label = category.parentId !== null ? 
                    `${category.label}` : ` - ${category.label} (skirtukas)`
                return label
            }
        },
        watch: {
            visibility(changed, _) {
                this.visible = changed
            }
        },
        computed: {
            ...mapGetters([
                'categories'
            ]),
            /**
             * Only categories without parentId can be subcategories 
             */
            subcategories: function() {
                return _.filter(this.categories, function(category) {
                    return category.parentId === null
                })
            }
        }
    }

</script>

