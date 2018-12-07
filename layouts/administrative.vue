<template>
	<v-app light id="monad">
		<v-toolbar :clipped-left="true" class="monad-toolbar" app>
			<nuxt-link to="/">
                <v-toolbar-title :class="'mr-3 monad-toolbar-logo'">MONAD.LT</v-toolbar-title>
            </nuxt-link>
            <v-toolbar-side-icon></v-toolbar-side-icon>
		</v-toolbar>
		<v-navigation-drawer width="320" v-model="navigator" clipped disable-resize-watcher>
			
		</v-navigation-drawer>
		<transition name="component-fade" appear>
			<nuxt/>
		</transition>
	</v-app>
</template>
<script>

    export default 
    {
        middleware: ['preload-client', 'authenticated'],
		data: function() {
            return {
                navigator: false
            }
        },
        mounted() {
            console.log(this.$nuxt)
        },
    }
    
</script>