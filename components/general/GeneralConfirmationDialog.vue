<template>
    <v-dialog v-model="visible" persistent max-width="400px">
        <v-card tile>
            <v-card-text>
                <slot name="body"></slot>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn flat color="accent" @click="close">
                    Atšaukti
                </v-btn>
                <v-btn flat color="red" @click="confirm">
                    Patvirtinti
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>

    export default {
        data() { return {
            visible: this.visibility
        }},
        props: {
            visibility: {
                required: true
            },
            confirmed: {
                required: true,
                type: Function
            }
        },
        methods: {
            close() {
                this.$emit('update:visibility', false)
                this.visible = false
            },
            confirm() {
                this.confirmed()
                this.close()
            }
        },
        watch: {
            visibility(changed, _) {
                this.visible = changed
            }
        }
    }

</script>