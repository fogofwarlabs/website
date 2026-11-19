const projectList = document.querySelector(".project-list");
const options = Array.from(projectList.querySelectorAll(".project-option"));
const panels = options.map(option => document.getElementById(option.hash.slice(1)));
const languageLinks = document.querySelectorAll(".languages a");

function selectProject(selectedOption) {
  for (const [index, option] of options.entries()) {
    const selected = option === selectedOption;
    option.setAttribute("aria-selected", String(selected));
    option.tabIndex = selected ? 0 : -1;
    panels[index].hidden = !selected;
  }
}

function restoreLocation() {
  const requestedOption = options.find(option => option.hash === location.hash);
  if (requestedOption) selectProject(requestedOption);
  for (const link of languageLinks) link.hash = location.hash;
}

projectList.setAttribute("role", "tablist");
for (const [index, option] of options.entries()) {
  const panel = panels[index];
  option.setAttribute("role", "tab");
  option.setAttribute("aria-controls", panel.id);
  panel.setAttribute("role", "tabpanel");
  panel.setAttribute("aria-labelledby", option.id);
  panel.tabIndex = 0;

  option.addEventListener("click", event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    history.replaceState(null, "", option.hash);
    restoreLocation();
  });

  option.addEventListener("keydown", event => {
    const previous = (index + options.length - 1) % options.length;
    const next = (index + 1) % options.length;
    const destinations = {ArrowUp: previous, ArrowLeft: previous, ArrowDown: next, ArrowRight: next, Home: 0, End: options.length - 1};
    if (!Object.hasOwn(destinations, event.key)) return;
    event.preventDefault();
    const target = options[destinations[event.key]];
    target.focus();
    target.click();
  });
}

selectProject(document.getElementById("choose-scr"));
restoreLocation();
window.addEventListener("hashchange", restoreLocation);

for (const button of document.querySelectorAll(".copy-address")) {
  const address = button.parentElement.querySelector("input");
  const status = button.parentElement.nextElementSibling;
  button.hidden = false;
  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(address.value);
      status.textContent = button.dataset.copied;
    } catch {
      address.focus();
      address.select();
      status.textContent = button.dataset.manual;
    }
  });
}

for (const strip of document.querySelectorAll(".screenshot-strip")) {
  const gallery = strip.querySelector(".screenshot-gallery");
  const previous = strip.querySelector(".slide-previous");
  const next = strip.querySelector(".slide-next");
  const updateButtons = () => {
    previous.hidden = gallery.scrollLeft <= 1;
    next.hidden = gallery.scrollLeft + gallery.clientWidth >= gallery.scrollWidth - 1;
  };
  previous.addEventListener("click", () => gallery.scrollBy({left: -gallery.clientWidth}));
  next.addEventListener("click", () => gallery.scrollBy({left: gallery.clientWidth}));
  gallery.addEventListener("scroll", updateButtons, {passive: true});
  new ResizeObserver(updateButtons).observe(gallery);
}

const viewer = document.querySelector(".screenshot-viewer");
const viewerImage = viewer.querySelector("img");
const viewerCount = viewer.querySelector(".viewer-count");
let viewerShots = [];
let viewerIndex = 0;

function showScreenshot(index) {
  viewerIndex = (index + viewerShots.length) % viewerShots.length;
  const link = viewerShots[viewerIndex];
  viewerImage.src = link.href;
  viewerImage.alt = link.querySelector("img").alt;
  viewerCount.textContent = `${viewerIndex + 1} / ${viewerShots.length}`;
  const single = viewerShots.length < 2;
  viewer.querySelector(".viewer-previous").hidden = single;
  viewer.querySelector(".viewer-next").hidden = single;
  viewerCount.hidden = single;
}

for (const link of document.querySelectorAll(".screenshot")) {
  link.addEventListener("click", event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    viewerShots = Array.from(link.closest(".screenshot-gallery").querySelectorAll(".screenshot"));
    showScreenshot(viewerShots.indexOf(link));
    viewer.showModal();
  });
}
viewer.querySelector(".viewer-previous").addEventListener("click", () => showScreenshot(viewerIndex - 1));
viewer.querySelector(".viewer-next").addEventListener("click", () => showScreenshot(viewerIndex + 1));
viewer.addEventListener("keydown", event => {
  if (event.key === "ArrowLeft") showScreenshot(viewerIndex - 1);
  if (event.key === "ArrowRight") showScreenshot(viewerIndex + 1);
});
viewer.addEventListener("click", event => {
  if (event.target === viewer || event.target === viewerImage || event.target.closest(".viewer-close")) viewer.close();
});
