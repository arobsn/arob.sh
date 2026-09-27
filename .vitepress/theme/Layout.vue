<script setup lang="ts">
import { computed } from "vue";
import { useData } from "vitepress";
import { contacts, github, isExternal } from "./site";
import ContactIcon from "./ContactIcon.vue";
import Home from "./Home.vue";
import Post from "./Post.vue";
import NotFound from "./NotFound.vue";

const { page, frontmatter, site } = useData();

const isHome = computed(() => frontmatter.value.layout === "home");
const isPost = computed(() => page.value.relativePath.startsWith("posts/"));
</script>

<template>
  <div class="shell" :class="{ 'is-home': isHome }">
    <header class="site-header">
      <component :is="isHome ? 'h1' : 'div'" class="site-title">
        <a class="site-name" href="/">{{ site.title }}</a>
      </component>
      <nav v-if="isPost || isHome" class="site-nav">
        <a
          v-for="link in contacts"
          :key="link.href"
          :href="link.href"
          :target="isExternal(link.href) ? '_blank' : undefined"
          :rel="isExternal(link.href) ? 'noopener' : undefined"
          :aria-label="link.name"
        >
          <ContactIcon :name="link.name" />
          <span class="site-nav-text">{{ link.name }}</span>
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
      <a :href="github.href" target="_blank" rel="noopener">{{ github.label }}</a>
    </footer>
  </div>
</template>
