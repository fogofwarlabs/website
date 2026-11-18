import json
import shutil
from pathlib import Path

from jinja2 import Environment, FileSystemLoader, StrictUndefined, select_autoescape


root = Path(__file__).resolve().parent
destination = root / "_site"
templates = Environment(
    loader=FileSystemLoader(root / "templates"),
    undefined=StrictUndefined,
    autoescape=select_autoescape(["html"]),
    trim_blocks=True,
    lstrip_blocks=True,
)
template = templates.get_template("index.html")
projects = json.loads((root / "content/projects.json").read_text(encoding="utf-8"))
launcher = json.loads((root / "content/launcher.json").read_text(encoding="utf-8"))
languages = {"ko": "", "en": "en/"}

for language, directory in languages.items():
    content = json.loads((root / f"content/{language}.json").read_text(encoding="utf-8"))
    page = template.render(
        language=language,
        content=content,
        projects=projects,
        launcher=launcher,
        languages=languages,
        prefix="../" if directory else "./",
    )
    output = destination / directory
    output.mkdir(parents=True, exist_ok=True)
    (output / "index.html").write_text(page, encoding="utf-8")

for filename in ("styles.css", "website.js"):
    shutil.copy2(root / filename, destination / filename)
shutil.copytree(root / "assets", destination / "assets", dirs_exist_ok=True)
