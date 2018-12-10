<template>
	<v-app light id="monad">
        <v-navigation-drawer width="320" v-model="navigator.display" clipped app>
            <v-list>
                <template v-for="group in navigator.groups">
                    <v-list-group :key="group.text" 
                        v-if="group.subgroup !== undefined && (group.privileges === undefined || privileged(group.privileges))"
                    >
                        <v-list-tile slot="activator">
                            <v-list-tile-action v-if="group.icon !== undefined">
                                <v-icon>{{ group.icon }}</v-icon>
                            </v-list-tile-action>
                            <v-list-tile-title>{{ group.text }}</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile v-for="subgroup in group.subgroup" 
                            :key="subgroup.text" 
                            @click="redirect(subgroup.route)" 
                            v-if="privileged(subgroup.privileges)"
                            active-class="v-drawer-active"
                            :value="isCurrent(subgroup.route)"
                        >
                            <v-list-tile-action v-if="subgroup.icon !== undefined">
                                <v-icon>{{ subgroup.icon }}</v-icon>
                            </v-list-tile-action>
                            <v-list-tile-title>{{ subgroup.text }}</v-list-tile-title>
                        </v-list-tile>
                    </v-list-group>
                    <v-list-tile v-else 
                        @click="redirect(group.route)"
                        active-class="v-drawer-active"
                        :value="isCurrent(group.route)"
                    >
                        <v-list-tile-action v-if="group.icon !== undefined">
                                <v-icon>{{ group.icon }}</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-title>{{ group.text }}</v-list-tile-title>
                    </v-list-tile>
                </template>
            </v-list>
        </v-navigation-drawer>
		<v-toolbar :clipped-left="true" class="monad-toolbar" app>
            <v-toolbar-title :class="'mr-3 monad-toolbar-logo'" @click="$router.push('/')">MONAD.LT</v-toolbar-title>
            <v-toolbar-side-icon @click="navigator.display = !navigator.display"></v-toolbar-side-icon>
		</v-toolbar>
		<transition name="component-fade" appear>
			<nuxt/>
		</transition>
        <v-global-snackbar></v-global-snackbar>
	</v-app>
</template>
<script>

    export default 
    {
        middleware: ['preload-client', 'authenticated'],
		data: function() {
            return {
                navigator: {
                    display: true,
                    groups: [{
                        icon: "people",
                        text: "Klientai",
                        privileges: [1, 2, 3, 4],
                        subgroup: [{
                            text: "Sąrašas",
                            icon: "list",
                            route: "/administrative/clients",
                            privileges: [1, 2]
                        }, {
                            text: "Registravimas",
                            icon: "person_add",
                            route: "/administrative/clients/create",
                            privileges: [1, 2]
                        }, {
                            text: "Užsakymai",
                            icon: "local_mall",
                            route: "/administrative/clients/orders",
                            privileges: [1, 2, 3, 4]
                        }]
                    },  {
                            text: "Parduotuvės valdymas",
                            icon: "store",
                            privileges: [1, 2],
                            subgroup: [{
                                text: "Knygų valdymas",
                                icon: "book",
                                route: "/administrative/store",
                                privileges: [1, 2]
                            }, {
                                text: "Kategorijų valdymas",
                                icon: "category",
                                privileges: [1, 2],
                                route: "/administrative/store/categories"
                            }, {
                                text: "Autorių valdymas",
                                icon: "people",
                                privileges: [1, 2],
                                route: "/administrative/store/authors"
                            }]
                    },  {
                            text: "Bylų valdymas",
                            icon: "contact_support",
                            privileges: [1, 2, 3, 4],
                            route: "/administrative/cases"
                    }]
                },
            }
        },
        methods: {
            redirect(to) {
                this.$router.push(to)
            },
            privileged(prArr) {
                return this.$client.privileged(...prArr)
            },
            isCurrent(route) {
                return this.$route.path === route
            }
        },
        components: {
            "v-global-snackbar":  require('~/components/GlobalSnackbar.vue').default
        }
    }
    
</script>
<style lang="scss">

    .v-list__tile {
        font-family: Raleway;
        font-weight: 400;
    }

</style>