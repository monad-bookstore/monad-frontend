<template>
    <v-layout fill-height justify-center align-center>
        <v-flex class="text-xs-center no-select">
            <div class="monad-welcome-title font-raleway-thin">MONAD</div>
            <div class="monad-welcome-title-subheader font-raleway-elight">Internetinė knygų ir publikacijų parduotuvė</div>
        </v-flex>
    </v-layout>
</template>
<script>

    export default {
        middleware: ['preload-client']    
    }

</script>

<style lang="scss" scoped>

    @import '~assets/style/helpers/_functions.scss';

    .monad-welcome-title {
        @include adaptive-font-size($minimal-font-size: 64, $maximal-font-size: 122, $line-height: true);
    }

    .monad-welcome-title-subheader {
        @include adaptive-font-size($minimal-font-size: 20, $maximal-font-size: 28, $line-height: true);
    }

</style>
