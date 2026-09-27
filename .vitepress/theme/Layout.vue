<script setup lang="ts">
import { useData } from "vitepress";
import type { ThemeConfig } from "./types";
import Home from "./Home.vue";
import Post from "./Post.vue";
import NotFound from "./NotFound.vue";

const { page, frontmatter, site, theme } = useData<ThemeConfig>();
</script>

<template>
    <div class="shell">
        <header class="site-header">
            <a class="site-name" href="/">{{ site.title }}</a>
            <nav class="site-nav">
                <a
                    v-for="link in theme.links"
                    :key="link.href"
                    :href="link.href"
                    target="_blank"
                    rel="noopener"
                >
                    {{ link.text }}
                </a>
            </nav>
        </header>

        <main>
            <NotFound v-if="page.isNotFound" />
            <Home v-else-if="frontmatter.layout === 'home'" />
            <Post v-else-if="page.relativePath.startsWith('posts/')" />
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
