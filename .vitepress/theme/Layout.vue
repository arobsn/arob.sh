<script setup lang="ts">
import { computed } from "vue";
import { useData } from "vitepress";
import { isExternal, type ThemeConfig } from "./types";
import ContactIcon from "./ContactIcon.vue";
import Home from "./Home.vue";
import Post from "./Post.vue";
import NotFound from "./NotFound.vue";

const { page, frontmatter, site, theme } = useData<ThemeConfig>();

const isHome = computed(() => frontmatter.value.layout === "home");
const isPost = computed(() => page.value.relativePath.startsWith("posts/"));
</script>

<template>
  <div class="shell" :class="{ 'is-home': isHome }">
    <header class="site-header">
      <a class="site-name" href="/">{{ site.title }}</a>
      <nav v-if="isPost || isHome" class="site-nav">
        <a
          v-for="link in theme.links"
          :key="link.href"
          :href="link.href"
          :target="isExternal(link.href) ? '_blank' : undefined"
          :rel="isExternal(link.href) ? 'noopener' : undefined"
          :aria-label="link.text"
        >
          <ContactIcon :name="link.text" />
          <span class="site-nav-text">{{ link.text }}</span>
        </a>
      </nav>
    </header>

    <main>
      <NotFound v-if="page.isNotFound" />
      <Home v-else-if="isHome" />
      <Post v-else-if="isPost" />
      <Content v-else class="prose" />
    </main>

    <footer class="site-footer">
      <span>© {{ new Date().getFullYear() }} {{ site.title }}</span>
      <a :href="`https://github.com/${theme.handle}`" target="_blank" rel="noopener"
        >@{{ theme.handle }}</a
      >
    </footer>
  </div>
</template>
