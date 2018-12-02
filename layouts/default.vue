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
	</v-app>
</template>
<script>

	import { mapGetters } from 'vuex'
	export default {
		data: () => ({
			cart_drawer: false,
		}),
		computed: {
			...mapGetters([
				'isAuthenticated'
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
