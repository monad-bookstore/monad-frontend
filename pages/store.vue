<template>
    <v-content class="content-overlay">
        <v-toolbar dense class="elevation-1 rounded-0 monad-toolbar store-toolbar" absolute>
            <v-toolbar-side-icon @click="options.drawer = !options.drawer"></v-toolbar-side-icon>
            <v-toolbar-title class="font-raleway-regular">Parduotuvė</v-toolbar-title>
            <template v-if="$client.privileged($AccessLevel.ADMINISTRATOR, $AccessLevel.MANAGER)">
                <v-spacer></v-spacer>
                <v-toolbar-items>
                    <v-btn icon @click="options.administrator.panel = true"> 
                        <v-icon>fas fa-cog</v-icon>
                    </v-btn>
                </v-toolbar-items>
            </template>
        </v-toolbar>
        <div class="v-store-container">
            <div class="v-store-wrapper">
                <v-navigation-drawer v-model="options.drawer" absolute>
                    <v-list>
                        <v-list-tile>
                            <v-list-tile-title class="font-weight-light">
                                Naujausios
                            </v-list-tile-title>
                        </v-list-tile>
                        <v-list-group v-for="category in category_dividers" :key="category.id">
                            <v-list-tile slot="activator">
                                <v-list-tile-title>{{ category.label }}</v-list-tile-title>
                            </v-list-tile>
                            <v-list-tile @click="" v-for="child_category in treeOf(category.id)" :key="child_category.id">
                                <v-list-tile-title class="font-weight-light ml-2">{{ child_category.label }} </v-list-tile-title>
                            </v-list-tile>
                        </v-list-group>
                    </v-list>
                </v-navigation-drawer>
                <v-card height="100%" width="100%" color="transparent">
                    <v-layout wrap class="pa-3" justify-center>
                        <v-flex class="pa-2" shrink>
                            <v-layout justify-center>
                                <v-book :object="{}"></v-book>
                            </v-layout>                           
                        </v-flex>
                    </v-layout>
                </v-card>
            </div>
        </div>
        <v-dialog v-if="$client.privileged($AccessLevel.ADMINISTRATOR, $AccessLevel.MANAGER)"  
            v-model="options.administrator.panel" fullscreen hide-overlay transition="dialog-bottom-transition" scrollable>
            <v-card tile>
                <v-toolbar card color="white">
                    <v-btn icon @click="options.administrator.panel = false">
                        <v-icon>close</v-icon>
                    </v-btn>
                    <v-toolbar-title>Parduotuvės valdymas</v-toolbar-title>
                </v-toolbar>
                <v-privileged-panel :client="client">
                    </v-privileged-panel>
            </v-card>
        </v-dialog>
    </v-content>
</template>
<script>

    import { mapGetters } from 'vuex';
    export default {

        middleware: ['preload-client', 'authenticated'],
        meta: {
            remove_toolbar_elevation: true
        },
        data() {
            return {
                options: {
                    drawer: false,
                    administrator: {
                        panel: false
                    }
                }
            }
        },
        computed: {
            ...mapGetters([
                'client', 'categories'
            ]),
            category_dividers: function() {
                return _.filter(this.categories, function(category) {
                    return category.parentId == null
                })
            }
        },
        methods: {
            treeOf(parent) {
                return _.filter(this.categories, function(category){
                    return category.parentId == parent;
                })
            }
        },
        components: {
            "v-book": require("~/components/store/BookComponent.vue").default,
            "v-privileged-panel": require("~/components/store/panel/PanelComponent.vue").default
        }
    }

</script>
<style lang="scss" scoped>

    .store-toolbar {
        border-top: 1px solid rgba($color: #000000, $alpha: 0.1);
    }

    .v-store-container {
        height: 100%;
        padding-top: 51px;
        .v-store-wrapper {
            height: 100%;  
            position: relative;
        }
    }

    .store-wrapper {
        height: 100% !important;
        width: 100%;
        position: relative;
    }

    .store-container {
        padding-top: 51px !important;
        padding-left: 0px !important;
        padding-right: 0px !important;
    }

</style>
