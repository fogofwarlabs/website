# Fog of War Labs website

Project library and launcher installation guide for SC4J. Korean is served at `/` and English at `/en/`. Both pages are generated as static HTML.

Edit mod repository addresses in `content/projects.json`, the downloadable Windows release in `content/launcher.json`, and the copy in `content/ko.json` and `content/en.json`. Build and preview from the repository root:

```sh
python -m pip install -r requirements.txt
python build.py
python -m http.server 4173 --bind 127.0.0.1 --directory _site
```

GitHub Actions publishes the static site to GitHub Pages when changes are pushed to `main`. The custom domain `fogofwarlabs.org` is configured in the repository’s Pages settings.

Branding comes from the [SC4J](https://github.com/fogofwarlabs/sc4j/tree/main/docs/branding) and [SC:R](https://github.com/fogofwarlabs/sc4j-scr/tree/main/docs/branding) repositories. SC:R CrossOver shares the SC:R mark. The guide illustrates the Mods tab with an image from the [SC4J v0.1.5 release announcement](https://www.moddb.com/mods/sc4j/news/sc4j-v015-released).
