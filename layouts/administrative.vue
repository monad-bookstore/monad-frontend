<template>
	<v-app light id="monad">
        <v-navigation-drawer width="320" v-model="navigator.display" clipped app>
			<v-list>
                <v-list-group v-if="$client.privileged($AccessLevel.ADMINISTRATOR, $AccessLevel.MANAGER)">
                    <v-list-tile slot="activator">
                        <v-list-tile-action>
                            <v-icon>people</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-title>Vartotojai</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile @click="redirect('/administrative/clients')">
                        <v-list-tile-action>
                            <v-icon>list</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            Peržiūrėti sąrašą
                        </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile>
                        <v-list-tile-action>
                            <v-icon>person_add</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            Užregistruoti vartotoją
                        </v-list-tile-content>
                    </v-list-tile>
                    <!-- <v-list-tile>
                        <v-list-tile-action>
                            <v-icon>security</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            Pareigų skyrimas
                        </v-list-tile-content>
                    </v-list-tile> -->
                </v-list-group>
                <v-list-group v-if="$client.privileged($AccessLevel.ADMINISTRATOR, $AccessLevel.MANAGER)">
                    <v-list-tile slot="activator">
                        <v-list-tile-action>
                            <v-icon>book</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-title>Knygos</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile>
                        <v-list-tile-action>
                            <v-icon>list</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            Peržiūrėti sąrašą
                        </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile>
                        <v-list-tile-action>
                            <v-icon>note_add</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            Pridėti knygą
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list-group>
                <v-list-group v-if="$client.privileged($AccessLevel.ADMINISTRATOR, $AccessLevel.MANAGER, $AccessLevel.EMPLOYEE)">
                    <v-list-tile slot="activator">
                        <v-list-tile-action>
                            <v-icon>shopping_basket</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-title>Užsakymai</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile>
                        <v-list-tile-action>
                            <v-icon>list</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            Tvarkyti užsakymus
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list-group>
                <v-list-group v-if="$client.privileged($AccessLevel.ADMINISTRATOR, $AccessLevel.MANAGER, $AccessLevel.SUPPORT)">
                    <v-list-tile slot="activator">
                        <v-list-tile-action>
                            <v-icon>contact_support</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-title>Bylos</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile>
                        <v-list-tile-action>
                            <v-icon>list</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            Tvarkyti bylas
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list-group>
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
                    display: false,
                },
            }
        },
        methods: {
            redirect(to) {
                this.$router.push(to)
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