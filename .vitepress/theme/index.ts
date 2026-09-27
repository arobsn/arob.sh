// https://vitepress.dev/guide/custom-theme
import type { Theme } from "vitepress";
import Layout from "./Layout.vue";
import "@fontsource-variable/lora/wght.css";
import "@fontsource-variable/lora/wght-italic.css";
import "./style.css";

export default { Layout } satisfies Theme;
