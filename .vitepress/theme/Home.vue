<script setup lang="ts">
import { useData } from "vitepress";
import { data as posts } from "./posts.data";

interface Project {
    name: string;
    description?: string;
    url: string;
}

const { frontmatter } = useData<unknown>();
const projects = (frontmatter.value.projects ?? []) as Project[];
</script>

<template>
    <Content class="prose intro" />

    <section v-if="projects.length" class="section">
        <h2 class="section-title">projects</h2>
        <ul class="post-list">
            <li v-for="project in projects" :key="project.url">
                <a class="post-link" :href="project.url" target="_blank" rel="noopener">
                    <span class="post-link-head">
                        <span class="post-link-title">
                            {{ project.name }}<span class="external" aria-hidden="true">↗</span>
                        </span>
                    </span>
                    <span v-if="project.description" class="post-link-desc">{{
                        project.description
                    }}</span>
                </a>
            </li>
        </ul>
    </section>

    <section class="section">
        <h2 class="section-title">writing</h2>
        <ul v-if="posts.length" class="post-list">
            <li v-for="post in posts" :key="post.url">
                <a class="post-link" :href="post.url">
                    <span class="post-link-head">
                        <span class="post-link-title">{{ post.title }}</span>
                        <time class="post-link-date" :datetime="post.date.iso">{{
                            post.date.short
                        }}</time>
                    </span>
                    <span v-if="post.description" class="post-link-desc">{{
                        post.description
                    }}</span>
                </a>
            </li>
        </ul>
        <p v-else class="muted">Nothing here yet.</p>
    </section>
</template>
