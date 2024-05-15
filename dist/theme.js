import {
  makeLayoutSettings,
  mergeLayoutSettings,
  mergeWithRoot,
  populateLayout
} from "./chunk-II72W3ZY.js";

// src/theme/components/site.ts
function addDefaultLayouts(layouts) {
  const out = [...layouts];
  if (!layouts.find((v) => v.id === "default"))
    out.push({
      id: "default"
    });
  if (!layouts.find((v) => v.id === "article"))
    out.push({
      id: "article",
      settings: {
        toc: false,
        contentFooter: false
      }
    });
  if (!layouts.find((v) => v.id === "page"))
    out.push({
      id: "page",
      settings: {
        sidebar: false,
        contentFooter: false,
        toc: false
      }
    });
  if (!layouts.find((v) => v.id === "raw"))
    out.push({
      id: "raw",
      settings: {
        sidebar: false,
        contentFooter: false,
        toc: false,
        navigation: false,
        backgroundPattern: false,
        pageFooter: false
      }
    });
  return out;
}
function mergeSites(root, target) {
  const base = { ...root };
  if (target.directories.length > 0)
    base.directories = target.directories;
  if (target.dropdown.length > 0)
    base.dropdown = target.dropdown;
  if (target.navigation.length > 0)
    base.navigation = target.navigation;
  if (target.tabs.length > 0)
    base.tabs = target.tabs;
  if (target.github)
    base.github = target.github;
  if (target.meta)
    base.meta = target.meta;
  if (target.contentFooter)
    base.contentFooter = {
      ...base.contentFooter,
      ...target.contentFooter
    };
  if (target.pageFooter)
    base.pageFooter = {
      ...base.pageFooter,
      ...target.pageFooter
    };
  const newSettings = mergeLayoutSettings(
    base.settings,
    target.settingOverrides
  );
  const newLayoutIds = target.layouts.map((v) => v.id);
  const newLayouts = [
    ...base.layouts.filter((v) => !newLayoutIds.includes(v.id)),
    ...target.layouts
  ];
  base.layouts = newLayouts.map((layout) => {
    layout.settings = mergeLayoutSettings(
      newSettings,
      layout.settingsOverrides
    );
    return layout;
  });
  base.id = target.id;
  base.layout = target.layout;
  base.settings = newSettings;
  base.logo = {
    ...base.logo,
    ...target.logo
  };
  return base;
}
var site = function(id, ops) {
  const settings = mergeWithRoot(makeLayoutSettings(ops.settings ?? {}));
  const layouts = addDefaultLayouts(ops.layouts ?? []);
  const theSite = {
    id,
    directories: ops.directories ?? [],
    dropdown: ops.dropdown ?? [],
    navigation: ops.navigation ?? [],
    settingOverrides: ops.settings ?? {},
    settings,
    tabs: ops.tabs ?? [],
    layouts: layouts.map((v) => populateLayout(settings, v)),
    layout: ops.layout,
    github: ops.github,
    type: "site",
    meta: ops.meta,
    logo: ops.logo ?? {},
    contentFooter: ops.contentFooter,
    pageFooter: ops.pageFooter
  };
  const [firstSite, ...extendables] = [...ops.extends ?? [], theSite];
  return extendables.reduce((a, v) => mergeSites(a, v), firstSite);
};
function siteTemplate(ops) {
  return site("gd:template", ops);
}

// src/theme/index.ts
function defineTheme(obj) {
  let sites = [];
  if (!Array.isArray(obj))
    sites = [site("main", obj)];
  else
    sites = obj;
  if (sites.length === 0)
    throw new Error("Site list may not be empty");
  sites.forEach((siteItem) => {
    if (siteItem.directories.length === 0)
      throw new Error("Site may not have an empty directory list");
  });
  return sites;
}

// src/theme/components/component.ts
var component = (componentOrOptions) => {
  if (typeof componentOrOptions !== "function") {
    return {
      ...componentOrOptions,
      type: "component"
    };
  }
  return {
    component: componentOrOptions,
    type: "component"
  };
};

// src/theme/components/directory.ts
var directory = function(id, ops) {
  return {
    id,
    layout: "default",
    sidebar: ops.sidebar ?? [],
    settings: makeLayoutSettings(ops.settings ?? {})
  };
};

// src/theme/components/group.ts
var group = (titleOrOptions, maybeItems) => {
  if (typeof titleOrOptions !== "string") {
    const options = titleOrOptions;
    return {
      ...options,
      type: "group"
    };
  }
  const items = maybeItems;
  return {
    title: titleOrOptions,
    type: "group",
    items
  };
};

// src/theme/components/link.ts
var nestedLink = function(titleOrOptions, urlOrItems, maybeItems) {
  if (typeof titleOrOptions !== "string") {
    const options = titleOrOptions;
    return {
      newTab: false,
      ...options,
      type: "nested-link"
    };
  }
  if (typeof urlOrItems !== "string") {
    const title2 = titleOrOptions;
    const items2 = urlOrItems;
    return {
      items: items2,
      newTab: false,
      title: title2,
      type: "nested-link"
    };
  }
  const items = maybeItems;
  const title = titleOrOptions;
  const url = urlOrItems;
  return {
    items,
    newTab: false,
    title,
    type: "nested-link",
    to: url
  };
};
var linkFunc = function(titleOrOptions, maybeUrl, maybeOps) {
  if (typeof titleOrOptions !== "string") {
    const options = titleOrOptions;
    return {
      newTab: false,
      style: "default",
      ...options,
      type: "link"
    };
  }
  const title = titleOrOptions;
  const url = maybeUrl;
  const ops = maybeOps;
  return {
    title,
    type: "link",
    style: ops?.style ?? "default",
    to: url,
    exact: ops?.exact,
    icon: ops?.icon,
    newTab: ops?.newTab ?? false
  };
};
linkFunc.nested = nestedLink;
var link = linkFunc;

// src/theme/components/separator.ts
var separator = () => {
  return {
    type: "separator"
  };
};

// src/theme/components/footer.ts
function populateContentFooter(ops) {
  return {
    ...ops,
    socials: ops.socials ?? []
  };
}

// src/theme/components/social.ts
function makeSocialBuilder(type) {
  return (url) => {
    return {
      type,
      url
    };
  };
}
var socialFunc = (ops) => {
  return ops;
};
socialFunc.discord = makeSocialBuilder("discord");
socialFunc.twitter = makeSocialBuilder("twitter");
socialFunc.mastodon = makeSocialBuilder("mastodon");
socialFunc.slack = makeSocialBuilder("slack");
socialFunc.x = makeSocialBuilder("twitter");
socialFunc.github = makeSocialBuilder("github");
var social = socialFunc;
export {
  component,
  defineTheme,
  directory,
  group,
  link,
  makeLayoutSettings,
  mergeLayoutSettings,
  mergeWithRoot,
  populateContentFooter,
  populateLayout,
  separator,
  site,
  siteTemplate,
  social
};
