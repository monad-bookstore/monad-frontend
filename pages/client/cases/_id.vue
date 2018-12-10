<template>
    <v-content class="content-overlay">
        <v-container fluid v-if="caseData != undefined">
            <v-card>
                <v-card-title class="card-title">
                    {{caseData.id}}#{{ caseData.title }}
                </v-card-title>
               
            </v-card>
        </v-container>
    </v-content>
</template>
<script>

    export default {
        middleware: ['preload-client', 'authenticated', 'preload-data'],
        data() {
            return {
                parameter: this.$route.params.id,
                caseData: undefined
            }
        },
        mounted() {
            this.fetch()
        },
        methods: {
            fetch() {
                this.$axios.get(`/api/cases/get/${this.parameter}`).then((response) => {
                    this.caseData = response.data
                }).catch((error) => {
                    this.$router.push('/client/cases')
                })
            }
        }
    }

</script>