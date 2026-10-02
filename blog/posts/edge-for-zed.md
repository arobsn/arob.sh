---
title: Edge theme for Zed
date: 2026-10-02
description: A port of the Edge color scheme to the Zed editor
---

![Zed editor using the Edge Dark Material theme.](/images/edge-for-zed/edge-zed-screenshot.png)

I love [Zed](https://zed.dev), truly. But I still use [Neovim](https://neovim.io) sometimes, especially when I'm traveling and need to work on my dev box back home. Zed does have remote editing, and it works great until you're in another country and latency kicks in: LSP messages take so long to arrive that it becomes unusable.

Neovim has a lot of cool stuff, and one of my favorites is the [Edge](https://github.com/sainnhe/edge) color scheme: vivid colors, soft contrast, easy on the eyes. So I was surprised there wasn't a port for Zed.

Well, [now we have one](https://github.com/arobsn/edge-zed).

The theme comes with all the original variants plus Material and Blur, which I borrowed from the [Everforest Zed extension](https://github.com/albertsko/zed-everforest).

Edge is available in Zed's extension registry. Open the extensions page (`zed: extensions`), search for **Edge**, and install it. Then pick a variant with `theme selector: toggle`. **Dark Material** is my favorite.

As usual, it's open source and under the MIT license. If something looks out of place, PRs and issues are welcome. ;)
