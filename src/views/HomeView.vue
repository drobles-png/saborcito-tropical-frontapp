<script setup lang="ts">
import LastOrderStrip from '@/components/menu/LastOrderStrip.vue'
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
import LazyMount from '@/components/ui/LazyMount.vue'
</script>

<template>
  <div class="home">
    <LastOrderStrip />
    <HomeHero />
    <HomeMarquee />
    <LazyMount><HomeCategories /></LazyMount>
    <LazyMount><HomeFeatured /></LazyMount>
    <LazyMount><HomeCollection /></LazyMount>
    <LazyMount><HomeCombos /></LazyMount>
    <LazyMount><HomeYogurt /></LazyMount>
    <LazyMount><HomeHow /></LazyMount>
    <LazyMount><HomeStory /></LazyMount>
    <LazyMount><HomeVisit /></LazyMount>
  </div>
</template>

<style scoped lang="scss">
.home {
  overflow-x: clip;
}
</style>
