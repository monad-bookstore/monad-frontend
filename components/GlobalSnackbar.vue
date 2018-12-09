<template>
    <v-snackbar v-model="snackbar.display" bottom :multi-line="snackbar.message.length > 45">
        {{ snackbar.message }}
        <v-btn color="pink" flat @click="$store.dispatch('clear_message')">Uždaryti</v-btn>
	</v-snackbar>
</template>
<script>
    
    import { mapGetters } from 'vuex';
    export default {
        computed: {
            ...mapGetters([
                'snackbar'
            ])
        }
    }

</script>
