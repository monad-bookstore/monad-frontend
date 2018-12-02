<template>
    <v-card width="300px">
        <v-img :src="require('@/static/books/__1.png')" aspect-ratio="1.2"></v-img>
        <v-card-title primary-title>
            <div>
                <div class="headline">Antanas Škėma</div>
                <span class="grey--text">Balta drobulė</span>
            </div>
        </v-card-title>
        <v-card-actions>
            <v-btn flat>Pirkti</v-btn>
            <v-btn flat color="purple">Plačiau</v-btn>
            <v-spacer></v-spacer>
            <v-btn flat>11.99&euro;</v-btn>
        </v-card-actions>
    </v-card>
</template>
<script>

    export default 
    {
        props: {
            object: {
                type: Object,
                required: true
            }
        }
    }

</script>
