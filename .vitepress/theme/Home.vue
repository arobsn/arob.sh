<script setup lang="ts">
import { useData } from "vitepress";
import { data as posts } from "./posts.data";
import ContactIcon from "./ContactIcon.vue";
import { contacts, isExternal } from "./site";

interface Project {
  name: string;
  description?: string;
  url: string;
}

const { frontmatter } = useData();
const projects = (frontmatter.value.projects ?? []) as Project[];
</script>

<template>
  <div class="home">
    <Content class="prose intro home-intro" />

    <aside class="home-aside">
      <section v-if="projects.length" class="aside-section">
        <h2 class="section-title">projects</h2>
        <ul class="aside-list">
          <li v-for="project in projects" :key="project.url">
            <a class="aside-link" :href="project.url" target="_blank" rel="noopener">
              <span class="aside-link-title">
                {{ project.name }}<span class="external" aria-hidden="true">↗</span>
              </span>
              <span v-if="project.description" class="aside-link-desc">{{
                project.description
              }}</span>
            </a>
          </li>
        </ul>
      </section>

      <section class="aside-section aside-contacts">
        <h2 class="section-title">contact</h2>
        <ul class="aside-list">
          <li v-for="link in contacts" :key="link.href">
            <a
              class="aside-contact"
              :href="link.href"
              :target="isExternal(link.href) ? '_blank' : undefined"
              :rel="isExternal(link.href) ? 'noopener' : undefined"
              :aria-label="`${link.name}: ${link.label}`"
            >
              <ContactIcon :name="link.name" />
              <span class="aside-contact-value">{{ link.label }}</span>
            </a>
          </li>
        </ul>
      </section>
    </aside>

    <section v-if="posts.length" class="section home-writing">
      <h2 class="section-title">writing</h2>
      <ul class="post-list">
        <li v-for="post in posts" :key="post.url">
          <a class="post-link" :href="post.url">
            <span class="post-link-head">
              <span class="post-link-title">{{ post.title }}</span>
              <time class="post-link-date" :datetime="post.date.iso">{{ post.date.short }}</time>
            </span>
            <span v-if="post.description" class="post-link-desc">{{ post.description }}</span>
          </a>
        </li>
      </ul>
    </section>
  </div>
</template>
