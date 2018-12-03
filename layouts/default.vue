<template>
	<v-app light id="monad">
		<v-toolbar :clipped-left="true" v-bind:class="getToolbarClass()" app>
			<v-toolbar-title :class="'mr-3 monad-toolbar-logo'">MONAD.LT</v-toolbar-title>
			<v-toolbar-items>
				<v-btn flat :to="'/'">Namų puslapis</v-btn>
			</v-toolbar-items>
			<template v-if="!isAuthenticated">
				<v-spacer></v-spacer>
				<v-toolbar-items>
					<v-btn flat :to="'/signin'">Prisijungimas</v-btn>
					<v-btn flat :to="'/registration'">Registracija</v-btn>
				</v-toolbar-items>
			</template>
			<template v-else>
				<v-toolbar-items>
					<v-btn flat :to="'/store'">Parduotuvė</v-btn>
					<v-btn flat :to="'/orders'">Užsakymai</v-btn>
				</v-toolbar-items>
				<v-spacer></v-spacer>
					<v-btn flat :to="'/client/settings'">Nustatymai</v-btn>
					<v-btn flat @click="cart_drawer = !cart_drawer" class="ma-0">
						Krepšelis
					</v-btn>
					<v-btn flat @click="logout" class="ma-0">
						Atsijungti
					</v-btn>
			</template>
		</v-toolbar>
		<template v-if="isAuthenticated">
			<!-- Dešinysis meniu krepšelio peržiūrai -->
			<v-navigation-drawer width="320" v-model="cart_drawer" fixed right clipped disable-resize-watcher>
				<v-toolbar flat card color="transparent">
					<v-spacer></v-spacer>
					<v-btn icon @click="cart_drawer = !cart_drawer">
						<v-icon>close</v-icon>
					</v-btn>
				</v-toolbar>
			</v-navigation-drawer>
		</template>
		<transition name="component-fade" appear>
			<nuxt/>
		</transition>
		<v-snackbar v-model="logout_complete" bottom>
            Atsijungta
            <v-btn color="pink" flat @click="logout_complete = false">Uždaryti</v-btn>
		</v-snackbar>
		<v-snackbar v-model="snackbar.display" bottom>
            {{ snackbar.message }}
            <v-btn color="pink" flat @click="$store.dispatch('clear_message')">Uždaryti</v-btn>
		</v-snackbar>
	</v-app>
</template>
<script>

	import { mapGetters } from 'vuex'
	import Cookie from 'js-cookie'
	export default {
		data: () => ({
			cart_drawer: false,
			logout_complete: false,
		}),
		computed: {
			...mapGetters([
				'isAuthenticated', 'snackbar'
			]),
		},
		methods: {
			getToolbarClass() {
				const elevation = this.$route.name == "store"
				return {
					"elevation-0": elevation,
					"elevation-1": !elevation,
					"monad-toolbar": true
				}
			},
			logout() {
				this.logout_complete = true
				Cookie.remove('bearer')
				this.$store.commit('CLEAR_CLIENT')
			}
		}
	}

</script>


<style lang="scss">

	.monad-toolbar-logo {
		font-family: 'Raleway';
		font-weight: 300;
	}

</style>
