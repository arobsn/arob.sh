<script setup lang="ts">
import { computed } from "vue";
import { useData, useRoute } from "vitepress";
import { data as posts } from "./posts.data";

const { frontmatter } = useData();
const route = useRoute();

const index = computed(() => posts.findIndex((p) => p.url === route.path.replace(/\.html$/, "")));
const post = computed(() => posts[index.value]);
const newer = computed(() => posts[index.value - 1]);
const older = computed(() => posts[index.value + 1]);
</script>

<template>
    <article>
        <header class="post-header">
            <h1 class="post-title">{{ frontmatter.title }}</h1>
            <p v-if="frontmatter.description" class="post-description">
                {{ frontmatter.description }}
            </p>
            <p v-if="post" class="post-meta">
                <time :datetime="post.date.iso">{{ post.date.long }}</time>
                <span aria-hidden="true">·</span>
                <span>{{ post.readingTime }} min read</span>
            </p>
        </header>

        <Content class="prose" />

        <nav v-if="post" class="post-nav">
            <a v-if="older" class="post-nav-link" :href="older.url">
                <span class="muted">← older</span>
                <span>{{ older.title }}</span>
            </a>
            <a v-if="newer" class="post-nav-link next" :href="newer.url">
                <span class="muted">newer →</span>
                <span>{{ newer.title }}</span>
            </a>
        </nav>
    </article>
</template>
