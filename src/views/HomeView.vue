<script setup lang="ts">
import HomeHero from '@/components/home/HomeHero.vue'
import HomeMarquee from '@/components/home/HomeMarquee.vue'
import HomeCategories from '@/components/home/HomeCategories.vue'
import HomeFeatured from '@/components/home/HomeFeatured.vue'
import HomeCollection from '@/components/home/HomeCollection.vue'
import HomeCombos from '@/components/home/HomeCombos.vue'
import HomeYogurt from '@/components/home/HomeYogurt.vue'
import HomeHow from '@/components/home/HomeHow.vue'
import HomeStory from '@/components/home/HomeStory.vue'
import HomeVisit from '@/components/home/HomeVisit.vue'
</script>

<template>
  <div class="home">
    <HomeHero />
    <HomeMarquee />
    <HomeCategories />
    <HomeFeatured />
    <HomeCollection />
    <HomeCombos />
    <HomeYogurt />
    <HomeHow />
    <HomeStory />
    <HomeVisit />
  </div>
</template>

<style scoped lang="scss">
.home {
  overflow-x: clip;
}
</style>
