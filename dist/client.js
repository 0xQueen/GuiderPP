import {
  __export,
  mergeLayoutSettings
} from "./chunk-II72W3ZY.js";

// src/client/virtuals.ts
import {
  sites as untypedSites,
  metaMap as untypedMetaMap,
  pageMap as untypedPageMap
} from "@neato/guider/shim.guider.virtual.js";
var sites = untypedSites;
var metaMap = untypedMetaMap;
var pageMap = untypedPageMap;

// src/client/page/context.ts
import { createContext } from "react";
var GuiderLayoutContext = createContext(void 0);

// src/client/hooks/use-guider.tsx
import { useMemo as useMemo2 } from "react";
import { useRouter } from "next/router.js";

// src/client/components/utils/activelink.tsx
import Link from "next/link.js";
import { useMemo, useCallback, useState, useEffect } from "react";
import classNames from "classnames";
import { usePathname } from "next/navigation.js";
import { jsx } from "react/jsx-runtime";
function isRouteAtive(link, currentPathname, exact) {
  const linkPathname = new URL(link, "https://example.com").pathname;
  const activePathname = new URL(currentPathname, "https://example.com").pathname;
  const linkPathArr = linkPathname.split("/").filter(Boolean);
  const activePathArr = activePathname.split("/").filter(Boolean);
  if (exact) {
    const exactMatch = linkPathArr.join("/") === activePathArr.join("/");
    return exactMatch;
  }
  let matches = true;
  for (let i = 0; i < linkPathArr.length; i++) {
    if (linkPathArr[i] !== activePathArr[i]) {
      matches = false;
    }
  }
  return matches;
}
function useAreRoutesActive(ops) {
  const pathName = usePathname();
  const isActiveCheck = useCallback(
    (href, exact) => {
      return isRouteAtive(href, pathName, exact);
    },
    [pathName]
  );
  const [actives, setActives] = useState(ops.map(() => false));
  const opsString = JSON.stringify(ops);
  useEffect(() => {
    setActives(ops.map((v) => isActiveCheck(v.href, v.exact)));
  }, [pathName, opsString, isActiveCheck]);
  return actives;
}
function useIsRouteActive(ops) {
  const actives = useAreRoutesActive([ops]);
  return actives[0];
}
var ActiveLink = ({
  activeClassName,
  exact,
  inactiveClassName,
  className,
  ...props
}) => {
  const isActive = useIsRouteActive({ href: props.href, exact });
  const computedClassName = useMemo(() => {
    if (isActive)
      return classNames("neato-guider-active-link", className, activeClassName);
    return classNames(className, inactiveClassName);
  }, [className, activeClassName, inactiveClassName, isActive]);
  const children = typeof props.children === "function" ? props.children({ isActive }) : props.children;
  return /* @__PURE__ */ jsx(Link, { className: computedClassName, ...props, children });
};
var activelink_default = ActiveLink;

// src/client/utils/navigational-buttons.ts
function wrapLink(item, group) {
  return {
    group,
    item
  };
}
function flattenSidebar(items, group) {
  return items.map((item) => {
    if (item.type === "link")
      return wrapLink(item, group);
    if (item.type === "group")
      return flattenSidebar(item.items, item.title);
    if (item.type === "nested-link" && item.to)
      return [wrapLink(item, group), ...flattenSidebar(item.items, group)];
    if (item.type === "nested-link" && !item.to)
      return flattenSidebar(item.items, group);
    return [];
  }).filter((v) => {
    if (Array.isArray(v))
      return true;
    if (v.item.type === "link" || v.item.type === "nested-link")
      return true;
    return false;
  });
}
function getCurrentPageContext(pagePathName, dir) {
  const navMap = flattenSidebar(dir.sidebar).flat(4);
  for (let i = 0; i < navMap.length; i++) {
    const item = navMap[i];
    const isActive = isRouteAtive(
      item.item.to ?? "/",
      pagePathName,
      item.item.exact ?? false
    );
    if (!isActive)
      continue;
    return {
      prev: i > 0 ? navMap[i - 1] : null,
      current: item,
      next: i + 1 < navMap.length ? navMap[i + 1] : null
    };
  }
  return {
    prev: null,
    current: null,
    next: null
  };
}

// src/client/hooks/use-guider.tsx
function getPage(pageUrl) {
  const matches = metaMap.filter((v) => pageUrl.startsWith(v.sitePath)).sort((a, b) => b.sitePath.length - a.sitePath.length);
  const match = matches[0];
  return match ?? null;
}
function getGuiderContext(pageUrl, pageMeta = {}) {
  const page = getPage(pageUrl);
  const siteId = page?.config.site ?? pageMeta?.site ?? sites[0].id;
  const site = sites.find((v) => v.id === siteId);
  if (!site)
    throw new Error("No site found with that id");
  const dirId = page?.config.directory ?? pageMeta?.directory ?? site.directories[0].id;
  const dir = site.directories.find((v) => v.id === dirId);
  if (!dir)
    throw new Error("No directory found with that id");
  const layoutId = page?.config.layout ?? pageMeta?.layout ?? dir.layout;
  const layout = site.layouts.find((v) => v.id === layoutId);
  if (!layout)
    throw new Error("No layout found");
  const settings = mergeLayoutSettings(layout.settings, dir.settings);
  const navContext = getCurrentPageContext(pageUrl, dir);
  return {
    metaMap,
    settings,
    directory: dir,
    layout,
    site,
    navContext
  };
}
function useGuider(pageMeta = {}) {
  const router = useRouter();
  const pageUrl = router.pathname;
  const context = useMemo2(() => {
    return getGuiderContext(pageUrl, pageMeta);
  }, [pageUrl, pageMeta]);
  return context;
}

// src/client/partials/layout/layout.tsx
import classNames13 from "classnames";

// src/client/hooks/use-guider-page.tsx
import { useContext } from "react";
function useGuiderPage() {
  const context = useContext(GuiderLayoutContext);
  const guider = useGuider(context?.meta);
  return {
    ...guider,
    page: context
  };
}

// src/client/components/utils/scrollpageheight.tsx
import { useCallback as useCallback2, useEffect as useEffect2, useRef } from "react";
import { jsx as jsx2 } from "react/jsx-runtime";
function onResize(element) {
  if (!element)
    return;
  const sticky = element.closest(".gd-sticky");
  if (!sticky)
    return;
  sticky.style.top = "initial";
  element.style.height = "auto";
  const top = element.getBoundingClientRect().top + window.scrollY;
  const height = window.innerHeight - top;
  element.style.height = `${height}px`;
  sticky.style.top = `${top}px`;
}
function ScrollPageHeight(props) {
  const elementRef = useRef(null);
  const setRef = useCallback2((node) => {
    onResize(node);
    elementRef.current = node;
  }, []);
  useEffect2(() => {
    function eventHandler() {
      onResize(elementRef.current);
    }
    window.addEventListener("resize", eventHandler);
    eventHandler();
    return () => {
      window.removeEventListener("resize", eventHandler);
    };
  }, [elementRef.current]);
  return /* @__PURE__ */ jsx2("div", { className: "-gd-mt-6 gd-sticky gd-top-0", children: /* @__PURE__ */ jsx2("div", { className: "gd-w-full gd-relative", ref: setRef, children: /* @__PURE__ */ jsx2("div", { className: "gd-absolute gd-inset-0 gd-h-full gd-overflow-y-auto gd-pb-12 gd-pt-6 gd-px-4 -gd-mx-4", children: props.children }) }) });
}

// src/client/partials/sidebar/sidebar.tsx
import { useContext as useContext2 } from "react";

// src/client/utils/make-key.ts
function makeKey(index, item) {
  const link = item.type === "link" || item.type === "nested-link" ? item.to ?? "#" : "#";
  return `${index}-${link}-${item.type}`;
}

// src/client/partials/sidebar/link.tsx
import classNames3 from "classnames";

// src/client/components/icon.tsx
import { Icon as IconifyIcon } from "@iconify-icon/react";
import classNames2 from "classnames";
import { jsx as jsx3 } from "react/jsx-runtime";
function Icon(props) {
  return /* @__PURE__ */ jsx3(
    "span",
    {
      className: classNames2(
        "gd-inline-flex gd-size-[1.1em] gd-items-center gd-justify-center",
        props.inline ? "-gd-mt-[0.125em]" : void 0,
        props.className
      ),
      children: /* @__PURE__ */ jsx3(IconifyIcon, { height: "1em", width: "1em", icon: props.icon })
    }
  );
}

// src/client/partials/sidebar/link.tsx
import { jsx as jsx4, jsxs } from "react/jsx-runtime";
function SidebarLink(props) {
  const link = props.link;
  return /* @__PURE__ */ jsxs(
    activelink_default,
    {
      className: classNames3({
        "gd-flex gd-items-center gd-w-full gd-py-1.5 gd-text-sm gd-px-4 gd-rounded-lg": true,
        "gd-pl-8": props.indent
      }),
      activeClassName: "gd-bg-bgLightest gd-text-primary",
      exact: true,
      inactiveClassName: "hover:gd-text-textLight hover:gd-bg-bgLight",
      href: link.to,
      target: link.newTab ? "_blank" : void 0,
      children: [
        link.icon ? /* @__PURE__ */ jsx4(Icon, { inline: true, className: "gd-inline-block gd-mr-2", icon: link.icon }) : null,
        link.title
      ]
    }
  );
}

// src/client/partials/sidebar/component.tsx
import { Fragment } from "react";
import { jsx as jsx5 } from "react/jsx-runtime";
function SidebarCustomComponent(props) {
  return /* @__PURE__ */ jsx5(Fragment, { children: props.component.component?.() ?? null });
}

// src/client/partials/sidebar/separator.tsx
import { jsx as jsx6 } from "react/jsx-runtime";
function SidebarSeparator() {
  return /* @__PURE__ */ jsx6("hr", { className: "!gd-my-3 gd-h-px gd-w-full gd-border-0 gd-bg-line" });
}

// src/client/partials/sidebar/nested.tsx
import { useEffect as useEffect3, useRef as useRef2, useState as useState2 } from "react";
import classNames4 from "classnames";
import { Fragment as Fragment2, jsx as jsx7, jsxs as jsxs2 } from "react/jsx-runtime";
function MaybeLink(props) {
  const contents = /* @__PURE__ */ jsxs2("span", { className: "gd-flex gd-flex-1 gd-items-center", children: [
    props.link.icon ? /* @__PURE__ */ jsx7(
      Icon,
      {
        inline: true,
        className: "gd-inline-block gd-mr-2",
        icon: props.link.icon
      }
    ) : null,
    /* @__PURE__ */ jsx7("span", { className: "gd-flex-1", children: props.link.title }),
    /* @__PURE__ */ jsx7(
      Icon,
      {
        className: classNames4({
          "gd-hidden": props.open === void 0,
          "gd-transition-transform gd-duration-100": true,
          "gd-rotate-90": props.open
        }),
        icon: "heroicons:chevron-right"
      }
    )
  ] });
  if (props.link.to)
    return /* @__PURE__ */ jsx7(
      activelink_default,
      {
        className: "gd-flex gd-items-center gd-w-full gd-py-1.5 gd-text-sm gd-px-4 gd-rounded-lg",
        activeClassName: "gd-bg-bgLightest gd-text-primary",
        exact: true,
        inactiveClassName: "hover:gd-text-textLight hover:gd-bg-bgLight",
        href: props.link.to,
        target: props.link.newTab ? "_blank" : void 0,
        children: contents
      }
    );
  return /* @__PURE__ */ jsx7(
    "div",
    {
      className: "gd-flex gd-items-center gd-cursor-pointer gd-w-full gd-py-1.5 gd-text-sm gd-px-4 gd-rounded-lg hover:gd-text-textLight hover:gd-bg-bgLight gd-select-none",
      onClick: props.onClick,
      children: contents
    }
  );
}
function SidebarNested(props) {
  const [open, setOpen] = useState2(null);
  const [hasActiveChildren, setHasActiveChildren] = useState2(
    null
  );
  const ref = useRef2(null);
  const isRouteActive = useIsRouteActive({ href: props.link.to ?? "" });
  const isRealLinkOpen = props.link.to ? isRouteActive : false;
  const actuallyOpen = open === null ? isRealLinkOpen || Boolean(hasActiveChildren) : open;
  useEffect3(() => {
    const el = ref.current;
    if (!el)
      return;
    function check() {
      setHasActiveChildren(
        Boolean(el?.querySelector(".neato-guider-active-link"))
      );
    }
    const observer = new MutationObserver(() => {
      check();
    });
    observer.observe(ref.current, {
      attributes: true,
      childList: true,
      subtree: true
    });
    check();
    return () => {
      observer.disconnect();
    };
  }, [ref.current]);
  return /* @__PURE__ */ jsxs2(Fragment2, { children: [
    /* @__PURE__ */ jsx7(
      MaybeLink,
      {
        link: props.link,
        open: hasActiveChildren === null ? void 0 : actuallyOpen,
        onClick: () => {
          setOpen(!actuallyOpen);
        }
      }
    ),
    /* @__PURE__ */ jsx7(
      "div",
      {
        ref,
        className: classNames4({
          "gd-hidden": !actuallyOpen
        }),
        children: props.link.items.map((link, i) => {
          const key = makeKey(i, link);
          if (link.type === "link")
            return /* @__PURE__ */ jsx7(SidebarLink, { link, indent: true }, key);
          if (link.type === "separator")
            return /* @__PURE__ */ jsx7(SidebarSeparator, {}, key);
          return null;
        })
      }
    )
  ] });
}

// src/client/partials/sidebar/group.tsx
import { Fragment as Fragment3, jsx as jsx8, jsxs as jsxs3 } from "react/jsx-runtime";
function SidebarGroup(props) {
  return /* @__PURE__ */ jsxs3(Fragment3, { children: [
    /* @__PURE__ */ jsx8("h3", { className: "gd-text-sm neato-guider-sidebar-group gd-text-textHeading gd-px-4 gd-font-medium !gd-mb-2 !gd-mt-10", children: props.group.title }),
    props.group.items.map((link, i) => {
      const key = makeKey(i, link);
      if (link.type === "link")
        return /* @__PURE__ */ jsx8(SidebarLink, { link }, key);
      if (link.type === "nested-link")
        return /* @__PURE__ */ jsx8(SidebarNested, { link }, key);
      if (link.type === "component")
        return /* @__PURE__ */ jsx8(SidebarCustomComponent, { component: link }, key);
      if (link.type === "separator")
        return /* @__PURE__ */ jsx8(SidebarSeparator, {}, key);
      return null;
    })
  ] });
}

// src/client/partials/sidebar/star-link.tsx
import classNames5 from "classnames";
import { Fragment as Fragment4, jsx as jsx9, jsxs as jsxs4 } from "react/jsx-runtime";
function SidebarStarLink(props) {
  const link = props.link;
  return /* @__PURE__ */ jsx9(
    activelink_default,
    {
      className: "gd-flex gd-w-full gd-items-center gd-gap-3 gd-py-1.5 gd-text-sm gd-px-4 !gd-my-0 gd-group",
      activeClassName: "gd-text-primary",
      exact: props.link.exact ?? true,
      inactiveClassName: "hover:gd-text-textLight",
      href: link.to,
      target: link.newTab ? "_blank" : void 0,
      children: ({ isActive }) => /* @__PURE__ */ jsxs4(Fragment4, { children: [
        /* @__PURE__ */ jsx9(
          "span",
          {
            className: classNames5({
              "gd-size-7 gd-flex gd-text-sm gd-border-t-2 gd-justify-center gd-items-center gd-rounded-md gd-transition-[background-color,color,border-color] gd-duration-100": true,
              "group-hover:gd-bg-bgLightest group-hover:gd-text-textHeading": true,
              "!gd-border-primary !gd-bg-primaryDark !gd-text-textHeading": isActive,
              "gd-border-bgLightest gd-bg-bgLight": !isActive
            }),
            children: link.icon ? /* @__PURE__ */ jsx9(Icon, { icon: link.icon }) : null
          }
        ),
        /* @__PURE__ */ jsx9("span", { className: "gd-flex-1 gd-transition-colors gd-duration-100", children: link.title })
      ] })
    }
  );
}

// src/client/partials/sidebar/sidebar.tsx
import { jsx as jsx10 } from "react/jsx-runtime";
function SidebarInternal() {
  const ctx = useContext2(GuiderLayoutContext);
  const { directory } = useGuider(ctx?.meta);
  return /* @__PURE__ */ jsx10("div", { className: "gd-flex gd-flex-col", children: /* @__PURE__ */ jsx10("div", { className: "gd-space-y-1 neato-guider-sidebar -gd-mx-4", children: directory.sidebar.map((link, i) => {
    const key = makeKey(i, link);
    if (link.type === "link" && link.style === "star")
      return /* @__PURE__ */ jsx10(SidebarStarLink, { link }, key);
    if (link.type === "link")
      return /* @__PURE__ */ jsx10(SidebarLink, { link }, key);
    if (link.type === "nested-link")
      return /* @__PURE__ */ jsx10(SidebarNested, { link }, key);
    if (link.type === "component")
      return /* @__PURE__ */ jsx10(SidebarCustomComponent, { component: link }, key);
    if (link.type === "separator")
      return /* @__PURE__ */ jsx10(SidebarSeparator, {}, key);
    if (link.type === "group")
      return /* @__PURE__ */ jsx10(SidebarGroup, { group: link }, key);
    return null;
  }) }) });
}

// src/client/partials/sidebar/index.tsx
import { jsx as jsx11 } from "react/jsx-runtime";
function GuiderSidebar() {
  const { settings } = useGuiderPage();
  const enabled = settings.sidebarState;
  if (!enabled)
    return null;
  return /* @__PURE__ */ jsx11(ScrollPageHeight, { children: /* @__PURE__ */ jsx11("div", { className: "gd-pr-4", children: /* @__PURE__ */ jsx11(GuiderSidebarContent, {}) }) });
}
function GuiderSidebarContent() {
  const { settings } = useGuiderPage();
  const enabled = settings.sidebarState;
  const Comp = settings.sidebarComponent ?? SidebarInternal;
  if (!enabled)
    return null;
  return /* @__PURE__ */ jsx11(Comp, {});
}

// src/client/partials/header/header.tsx
import { useContext as useContext3, useEffect as useEffect11, useState as useState8 } from "react";
import classNames10 from "classnames";

// src/client/components/github.tsx
import approx from "approximate-number";
import Link2 from "next/link.js";

// src/client/hooks/use-github-repo-stats.ts
import { useEffect as useEffect4, useState as useState3 } from "react";
var globalRepoCache = {};
function useGithubRepoStats(org, repo) {
  const url = `${org}/${repo}`;
  const [stats, setStats] = useState3(
    globalRepoCache[url] ?? null
  );
  useEffect4(() => {
    void (async () => {
      if (globalRepoCache[url]) {
        setStats(globalRepoCache[url]);
        return;
      }
      const data = await fetch(`https://api.github.com/repos/${url}`);
      const jsonData = await data.json();
      const newStats = {
        forks: jsonData.forks_count,
        stars: jsonData.stargazers_count,
        name: jsonData.full_name
      };
      globalRepoCache[url] = newStats;
      setStats(newStats);
    })();
  }, [url]);
  return {
    stats,
    name: stats ? stats.name : `${org}/${repo}`
  };
}

// src/client/components/github.tsx
import { jsx as jsx12, jsxs as jsxs5 } from "react/jsx-runtime";
function GithubDisplay(props) {
  const { stats, name } = useGithubRepoStats(props.org, props.repo);
  return /* @__PURE__ */ jsxs5(
    Link2,
    {
      href: `https://github.com/${props.org}/${props.repo}`,
      target: "_blank",
      className: "gd-flex gd-py-2 gd-px-4 -gd-my-2 gd-rounded-lg gd-items-center gd-bg-opacity-0 hover:gd-bg-opacity-100 gd-bg-bgLight gd-duration-75 gd-transition-[background-color,transform] active:gd-scale-105",
      children: [
        /* @__PURE__ */ jsx12(
          Icon,
          {
            icon: "radix-icons:github-logo",
            className: "gd-mr-3 gd-text-xl gd-text-textHeading"
          }
        ),
        /* @__PURE__ */ jsxs5("div", { className: "gd-flex-1 gd-text-sm", children: [
          /* @__PURE__ */ jsx12("p", { className: "gd-text-textHeading -gd-mb-1", children: name }),
          /* @__PURE__ */ jsxs5("p", { className: "gd-flex gd-items-center gd-gap-3", children: [
            /* @__PURE__ */ jsxs5("span", { className: "gd-space-x-1 gd-flex gd-items-center", children: [
              /* @__PURE__ */ jsx12(Icon, { inline: true, icon: "mingcute:star-line" }),
              /* @__PURE__ */ jsx12("span", { className: "gd-pt-0.5", children: stats ? approx(stats.stars) : "-" })
            ] }),
            /* @__PURE__ */ jsxs5("span", { className: "gd-space-x-1 gd-inline-flex gd-items-center", children: [
              /* @__PURE__ */ jsx12(Icon, { inline: true, icon: "fe:fork" }),
              /* @__PURE__ */ jsx12("span", { className: "gd-pt-0.5", children: stats ? approx(stats.forks) : "-" })
            ] })
          ] })
        ] })
      ]
    }
  );
}

// src/client/partials/logo/logo.tsx
import Link3 from "next/link.js";
import { jsx as jsx13 } from "react/jsx-runtime";
function LogoInternal() {
  const { site } = useGuiderPage();
  const content = /* @__PURE__ */ jsx13("span", { className: "gd-text-base gd-font-bold gd-text-textHeading", children: site.logo.name ?? "Guider" });
  if (site.logo.to)
    return /* @__PURE__ */ jsx13(
      Link3,
      {
        className: "gd-flex gd-items-center gd-gap-3 hover:gd-bg-bgLightest gd-transition-colors gd-duration-100 gd-py-1.5 gd-px-2 -gd-mx-2 gd-rounded-lg",
        href: site.logo.to,
        children: content
      }
    );
  return /* @__PURE__ */ jsx13("div", { className: "gd-flex gd-items-center gd-gap-3", children: content });
}

// src/client/partials/logo/index.tsx
import { jsx as jsx14 } from "react/jsx-runtime";
function GuiderLogo() {
  const { settings } = useGuiderPage();
  const enabled = settings.logoState;
  const Comp = settings.logoComponent ?? LogoInternal;
  if (!enabled)
    return null;
  return /* @__PURE__ */ jsx14(Comp, {});
}

// src/client/partials/header/tabs.tsx
import { Fragment as Fragment5 } from "react";
import { jsx as jsx15, jsxs as jsxs6 } from "react/jsx-runtime";
function TabLink(props) {
  return /* @__PURE__ */ jsxs6(
    activelink_default,
    {
      className: "gd-inline-block gd-py-4 gd-border-b -gd-mb-px gd-px-1 -gd-ml-1",
      activeClassName: "gd-text-textHeading gd-border-primary",
      inactiveClassName: "gd-border-transparent hover:gd-text-textLight",
      href: props.link.to,
      exact: props.link.exact,
      children: [
        props.link.icon ? /* @__PURE__ */ jsx15(
          Icon,
          {
            inline: true,
            className: "gd-inline-block gd-mr-2",
            icon: props.link.icon
          }
        ) : null,
        props.link.title
      ]
    }
  );
}
function CustomComponentTab(props) {
  return /* @__PURE__ */ jsx15(Fragment5, { children: props.component.component?.() });
}
function HeaderTabs(props) {
  return /* @__PURE__ */ jsx15("div", { className: "gd-border-t gd-border-line gd-px-6 gd-pb-0 -gd-mx-6 gd-space-x-6", children: props.tabs.map((v, i) => {
    const key = makeKey(i, v);
    if (v.type === "component")
      return /* @__PURE__ */ jsx15(CustomComponentTab, { component: v }, key);
    if (v.type === "link")
      return /* @__PURE__ */ jsx15(TabLink, { link: v }, key);
    return null;
  }) });
}

// src/client/partials/header/nav.tsx
import { Fragment as Fragment6 } from "react";
import { Fragment as Fragment7, jsx as jsx16, jsxs as jsxs7 } from "react/jsx-runtime";
function NavLink(props) {
  return /* @__PURE__ */ jsxs7(
    activelink_default,
    {
      className: "hover:gd-text-textHeading gd-p-2 gd-transition-colors gd-duration-100",
      activeClassName: "gd-text-textHeading",
      href: props.link.to,
      exact: props.link.exact,
      children: [
        props.link.icon ? /* @__PURE__ */ jsx16(
          Icon,
          {
            inline: true,
            className: "gd-inline-block gd-mr-2",
            icon: props.link.icon
          }
        ) : null,
        props.link.title
      ]
    }
  );
}
function NavCustomComponent(props) {
  return /* @__PURE__ */ jsx16(Fragment6, { children: props.component.component?.() });
}
function NavSeparator() {
  return /* @__PURE__ */ jsx16("hr", { className: "gd-w-full gd-h-px md:gd-w-px md:gd-h-full gd-border-0 gd-bg-line" });
}
function HeaderNav(props) {
  return /* @__PURE__ */ jsx16(Fragment7, { children: props.items.map((v, i) => {
    const key = makeKey(i, v);
    if (v.type === "component")
      return /* @__PURE__ */ jsx16(NavCustomComponent, { component: v }, key);
    if (v.type === "link")
      return /* @__PURE__ */ jsx16(NavLink, { link: v }, key);
    if (v.type === "separator")
      return /* @__PURE__ */ jsx16(NavSeparator, {}, key);
    return null;
  }) });
}

// src/client/partials/header/dropdown.tsx
import { Menu, Transition } from "@headlessui/react";
import { Fragment as Fragment8, useEffect as useEffect5, useMemo as useMemo3 } from "react";
import classNames6 from "classnames";
import { jsx as jsx17, jsxs as jsxs8 } from "react/jsx-runtime";
function DropdownItem(props) {
  return /* @__PURE__ */ jsxs8(
    "div",
    {
      className: classNames6({
        "gd-py-2 gd-px-3 gd-flex gd-items-center gd-transition-colors gd-duration-100 hover:gd-bg-bgLight gd-rounded": true,
        "gd-text-primary": props.active
      }),
      children: [
        /* @__PURE__ */ jsx17("div", { className: "gd-flex-1", children: props.link.title }),
        props.active ? /* @__PURE__ */ jsx17(Icon, { icon: "ph:check-bold" }) : null
      ]
    }
  );
}
function DropdownLink(props) {
  return /* @__PURE__ */ jsx17(Menu.Item, { children: ({ close }) => /* @__PURE__ */ jsx17("span", { children: /* @__PURE__ */ jsx17(
    activelink_default,
    {
      href: props.link.to,
      exact: props.link.exact,
      onClick: close,
      children: ({ isActive }) => /* @__PURE__ */ jsx17(DropdownItem, { link: props.link, active: isActive })
    }
  ) }) });
}
function DropdownGroup(props) {
  return /* @__PURE__ */ jsxs8("div", { children: [
    /* @__PURE__ */ jsx17("p", { className: "gd-px-3 gd-opacity-50 gd-text-xs gd-font-bold gd-mt-4 gd-pb-1 gd-mb-1 gd-uppercase gd-border-b gd-border-b-line", children: props.group.title }),
    props.group.items.map((item, i) => {
      if (item.type === "link")
        return /* @__PURE__ */ jsx17(DropdownLink, { link: item }, makeKey(i, item));
      return null;
    })
  ] });
}
function UpdateHead(props) {
  useEffect5(() => {
    if (props.active)
      document.body.setAttribute("data-header-dropdown-open", "true");
    return () => {
      document.body.removeAttribute("data-header-dropdown-open");
    };
  });
  return null;
}
function HeaderDropdown(props) {
  const links = props.dropdown.map((v) => v.type === "group" ? v.items : [v]).flat();
  const actives = useAreRoutesActive(
    links.map((v) => ({ href: v.to, exact: v.exact }))
  );
  const activeItem = useMemo3(() => {
    const activeIndex = actives.indexOf(true);
    if (activeIndex === -1)
      return void 0;
    return links[activeIndex];
  }, [actives, links]);
  return /* @__PURE__ */ jsxs8(
    Menu,
    {
      as: "div",
      className: "sm:gd-relative -gd-ml-2 gd-inline-block gd-z-[70]",
      children: [
        /* @__PURE__ */ jsx17(Menu.Button, { children: ({ open }) => /* @__PURE__ */ jsxs8(
          "div",
          {
            className: classNames6({
              "gd-bg-bg gd-border gd-text-left gd-flex gd-items-center gd-transition-colors gd-duration-100 gd-border-bgLightest gd-py-1 gd-rounded-md gd-px-4 hover:gd-bg-bgLight gd-border-opacity-0": true,
              "!gd-border-opacity-100 gd-text-textHeading": open
            }),
            children: [
              /* @__PURE__ */ jsx17("span", { className: "gd-mr-2", children: activeItem?.title ?? "Select site" }),
              /* @__PURE__ */ jsx17(Icon, { icon: "flowbite:chevron-sort-solid", className: "gd-text-text" }),
              /* @__PURE__ */ jsx17(UpdateHead, { active: open })
            ]
          }
        ) }),
        /* @__PURE__ */ jsx17(
          Transition,
          {
            as: Fragment8,
            enter: "gd-transition gd-ease-out gd-duration-100",
            enterFrom: "gd-transform gd-opacity-0 gd-scale-95",
            enterTo: "gd-transform gd-opacity-100 gd-scale-100",
            leave: "gd-transition gd-ease-in gd-duration-75",
            leaveFrom: "gd-transform gd-opacity-100 gd-scale-100",
            leaveTo: "gd-transform gd-opacity-0 gd-scale-95",
            children: /* @__PURE__ */ jsx17(Menu.Items, { className: "gd-absolute gd-p-2 gd-left-5 gd-right-5 sm:gd-left-0 sm:gd-right-auto gd-mt-2 sm:gd-w-72 gd-origin-top-left gd-rounded-md gd-bg-bg gd-border gd-border-bgLightest", children: props.dropdown.map((item, i) => {
              if (item.type === "group")
                return /* @__PURE__ */ jsx17(DropdownGroup, { group: item }, makeKey(i, item));
              if (item.type === "link")
                return /* @__PURE__ */ jsx17(DropdownLink, { link: item }, makeKey(i, item));
              return null;
            }) })
          }
        )
      ]
    }
  );
}

// src/client/partials/header/sidebar-mobile-nav.tsx
import classNames7 from "classnames";
import { Fragment as Fragment9, useEffect as useEffect7, useState as useState4 } from "react";

// src/client/hooks/use-page-switch.ts
import { useRouter as useRouter2 } from "next/router";
import { useCallback as useCallback3, useEffect as useEffect6 } from "react";
function usePageSwitch(cb, deps) {
  const router = useRouter2();
  const func = useCallback3(cb, deps);
  useEffect6(() => {
    return () => {
      func();
    };
  }, [router.pathname, func]);
}

// src/client/partials/header/sidebar-mobile-nav.tsx
import { jsx as jsx18, jsxs as jsxs9 } from "react/jsx-runtime";
function CustomComponentTab2(props) {
  return /* @__PURE__ */ jsx18(Fragment9, { children: props.component.component?.() });
}
function SidebarMobileNav(props) {
  const [navOpen, setNavOpen] = useState4(false);
  usePageSwitch(() => {
    setNavOpen(false);
  }, []);
  const toggleButton = /* @__PURE__ */ jsx18(
    "button",
    {
      type: "button",
      onClick: () => {
        setNavOpen(!navOpen);
      },
      className: "!gd-bg-bgDark gd-gap-2 gd-py-1.5 gd-px-2 gd-text-left md:gd-w-48 hover:!gd-bg-bgLight active:gd-scale-95 hover:gd-text-textHeading gd-transition-[color,transform] gd-border gd-border-bgLightest gd-rounded-md gd-flex gd-items-center",
      children: /* @__PURE__ */ jsx18(Icon, { icon: "mingcute:menu-fill", className: "gd-opacity-50 gd-text-text" })
    }
  );
  useEffect7(() => {
    document.body.setAttribute(
      "data-mobile-stop-overflow",
      navOpen ? "true" : "false"
    );
    return () => {
      document.body.removeAttribute("data-mobile-stop-overflow");
    };
  }, [navOpen]);
  return /* @__PURE__ */ jsxs9("div", { className: "gd-py-1", children: [
    toggleButton,
    /* @__PURE__ */ jsx18(
      "div",
      {
        className: classNames7(
          "gd-fixed gd-top-0 gd-left-0 gd-w-full gd-h-full gd-bg-black gd-bg-opacity-50",
          navOpen ? "gd-opacity-100" : "gd-opacity-0 gd-pointer-events-none"
        ),
        onClick: () => {
          setNavOpen(false);
        }
      }
    ),
    /* @__PURE__ */ jsxs9(
      "aside",
      {
        className: classNames7(
          "gd-fixed gd-w-[350px] gd-max-w-[75vw] gd-top-0 gd-left-0 gd-h-screen !gd-h-[100dvh] gd-bg-bg gd-z-[100] gd-px-6 gd-py-10 gd-transition-transform gd-duration-150 gd-border-r gd-border-line gd-overflow-y-auto gd-space-y-4",
          navOpen ? "gd-translate-x-0" : "-gd-translate-x-full"
        ),
        children: [
          /* @__PURE__ */ jsxs9("div", { className: "-gd-mx-4", children: [
            props.tabs.map((v, i) => {
              const key = makeKey(i, v);
              if (v.type === "component")
                return /* @__PURE__ */ jsx18(CustomComponentTab2, { component: v }, key);
              if (v.type === "link")
                return /* @__PURE__ */ jsx18(
                  SidebarStarLink,
                  {
                    link: {
                      ...v,
                      icon: v.icon ?? "ph:book-open-fill",
                      exact: v.exact ?? false
                    }
                  },
                  key
                );
              return null;
            }),
            props.tabs.length > 0 ? /* @__PURE__ */ jsx18(SidebarSeparator, {}) : null
          ] }),
          /* @__PURE__ */ jsx18("div", { children: /* @__PURE__ */ jsx18(GuiderSidebarContent, {}) })
        ]
      }
    )
  ] });
}

// src/client/partials/header/top-mobile-nav.tsx
import classNames8 from "classnames";
import { useEffect as useEffect8, useState as useState5 } from "react";
import { jsx as jsx19, jsxs as jsxs10 } from "react/jsx-runtime";
function TopMobileNav(props) {
  const [navOpen, setNavOpen] = useState5(false);
  usePageSwitch(() => {
    setNavOpen(false);
  }, []);
  const toggleButton = /* @__PURE__ */ jsx19(
    "button",
    {
      className: "gd-flex gd-items-center gd-p-2 hover:gd-text-textHeading",
      onClick: () => {
        setNavOpen(!navOpen);
      },
      children: /* @__PURE__ */ jsx19(Icon, { icon: "mingcute:more-2-fill" })
    }
  );
  const closeButton = /* @__PURE__ */ jsx19(
    "button",
    {
      className: "gd-flex gd-items-center gd-p-2 hover:gd-text-textHeading",
      onClick: () => {
        setNavOpen(!navOpen);
      },
      children: /* @__PURE__ */ jsx19(Icon, { icon: "mingcute:close-fill" })
    }
  );
  useEffect8(() => {
    document.body.setAttribute(
      "data-mobile-stop-overflow",
      navOpen ? "true" : "false"
    );
    return () => {
      document.body.removeAttribute("data-mobile-stop-overflow");
    };
  }, [navOpen]);
  return /* @__PURE__ */ jsxs10("div", { children: [
    toggleButton,
    /* @__PURE__ */ jsx19(
      "div",
      {
        className: classNames8(
          "gd-fixed gd-top-0 gd-left-0 gd-w-full gd-h-full gd-bg-black gd-bg-opacity-50",
          navOpen ? "gd-opacity-100" : "gd-opacity-0 gd-pointer-events-none"
        ),
        onClick: () => {
          setNavOpen(false);
        }
      }
    ),
    /* @__PURE__ */ jsx19("div", { className: "gd-fixed gd-inset-x-0 gd-top-0 gd-z-[100]", children: /* @__PURE__ */ jsxs10(
      "div",
      {
        className: classNames8(
          "gd-absolute gd-inset-x-0 gd-top-0 gd-bg-bg gd-z-[100] gd-flex gd-flex-col gd-px-6 gd-pb-8 gd-pt-4 gd-transition-transform gd-duration-150 gd-overflow-y-auto gd-space-y-4",
          navOpen ? "gd-translate-y-0" : "-gd-translate-y-full"
        ),
        children: [
          /* @__PURE__ */ jsx19("div", { className: "gd-flex gd-justify-end", children: closeButton }),
          /* @__PURE__ */ jsx19(HeaderNav, { items: props.items }),
          props.github.org && props.github.repo ? /* @__PURE__ */ jsx19(GithubDisplay, { org: props.github.org, repo: props.github.repo }) : null
        ]
      }
    ) })
  ] });
}

// src/client/partials/header/search/index.tsx
import { Fragment as Fragment11, useEffect as useEffect10, useRef as useRef3, useState as useState7 } from "react";
import { Transition as Transition3 } from "@headlessui/react";

// src/client/partials/header/search/button.tsx
import { jsx as jsx20, jsxs as jsxs11 } from "react/jsx-runtime";
function SearchButton(props) {
  return /* @__PURE__ */ jsxs11(
    "button",
    {
      type: "button",
      onClick: props.onClick,
      className: "!gd-bg-bgDark gd-gap-2 gd-py-1.5 gd-px-2 gd-text-left md:gd-w-48 hover:!gd-bg-bgLight active:gd-scale-95 hover:gd-text-textHeading gd-transition-[color,transform] gd-border gd-border-bgLightest gd-rounded-md gd-flex gd-items-center",
      children: [
        /* @__PURE__ */ jsx20(
          Icon,
          {
            icon: "mingcute:search-2-fill",
            className: "gd-opacity-50 gd-text-text"
          }
        ),
        /* @__PURE__ */ jsx20("span", { className: "gd-flex-1 gd-hidden md:gd-inline-block", children: "Search" }),
        /* @__PURE__ */ jsx20("span", { className: "gd-text-right gd-text-xs gd-hidden md:gd-inline-block", children: "Ctrl K" })
      ]
    }
  );
}

// src/client/partials/header/search/modal.tsx
import { Fragment as Fragment10 } from "react";
import { Transition as Transition2 } from "@headlessui/react";

// src/client/partials/header/search/screen.tsx
import Link4 from "next/link";
import { Combobox } from "@headlessui/react";
import { useRouter as useRouter4 } from "next/router";
import { useCallback as useCallback5 } from "react";
import classNames9 from "classnames";

// src/client/partials/header/search/content.ts
import FlexSearch from "flexsearch";
import { useRouter as useRouter3 } from "next/router";
import { useCallback as useCallback4, useEffect as useEffect9, useState as useState6 } from "react";
var contentPromise = null;
var contentDocument = null;
function loadDocument(basePath, key) {
  if (contentPromise)
    return contentPromise;
  const promise = fetchDocument(basePath, key);
  contentPromise = promise;
  return promise;
}
async function fetchDocument(basePath, key) {
  const res = await fetch(
    `${basePath}/_next/static/chunks/guider-data-${key}.json`
  );
  const searchData = await res.json();
  const searchDocument = new FlexSearch.Document({
    cache: 100,
    tokenize: "full",
    document: {
      id: "id",
      index: ["title", "content"],
      store: ["content", "url", "title", "pageTitle"]
    },
    context: {
      resolution: 9,
      depth: 2,
      bidirectional: true
    }
  });
  let pageId = 0;
  for (const [url, data] of Object.entries(searchData)) {
    for (const section of data.sections) {
      pageId++;
      searchDocument.add({
        id: pageId,
        title: section.heading?.text ?? "",
        pageTitle: data.pageTitle,
        url: url + (section.heading ? `#${section.heading.id}` : ""),
        content: section.content
      });
    }
  }
  contentDocument = {
    mainDoc: searchDocument
  };
}
function usePreloadSearch(key) {
  const { basePath } = useRouter3();
  useEffect9(() => {
    void loadDocument(basePath, key);
  }, [basePath, key]);
}
function useSearch(key) {
  const { basePath } = useRouter3();
  const [query, setQuery] = useState6("");
  const [resultLoading, setResultLoading] = useState6(false);
  const [resultLoadingError, setResultLoadingError] = useState6(false);
  const [results, setResults] = useState6(null);
  const doSearch = useCallback4(
    async (contentKey, searchQuery) => {
      setResultLoading(true);
      setResultLoadingError(false);
      try {
        await loadDocument(basePath, contentKey);
        const doc = contentDocument;
        if (!doc)
          throw new Error("Doc not loaded");
        const docResults = doc.mainDoc.search(searchQuery, 5, {
          enrich: true,
          suggest: true
        })?.[0]?.result ?? [];
        setResults(
          docResults.map((res) => {
            return {
              type: "section",
              id: res.id.toString(),
              title: res.doc.title,
              pageTitle: res.doc.pageTitle,
              content: res.doc.content,
              url: res.doc.url
            };
          })
        );
      } catch (err) {
        console.error("Failed to search", err);
        setResultLoadingError(true);
        setResultLoading(false);
        return;
      }
      setResultLoading(false);
    },
    [basePath]
  );
  const setQueryAndSearch = useCallback4(
    (data) => {
      setQuery(data);
      void doSearch(key, data);
    },
    [key, doSearch]
  );
  return {
    query,
    setQuery: setQueryAndSearch,
    results,
    loading: resultLoading,
    error: resultLoadingError
  };
}

// src/client/partials/header/search/screen.tsx
import { jsx as jsx21, jsxs as jsxs12 } from "react/jsx-runtime";
var iconMap = {
  page: "tabler:file-filled",
  section: "majesticons:text"
};
function SearchMessage(props) {
  return /* @__PURE__ */ jsxs12("div", { className: "gd-py-12 gd-text-center gd-flex gd-flex-col gd-items-center gd-border-t gd-border-bgLightest", children: [
    /* @__PURE__ */ jsx21("div", { className: "gd-flex gd-flex-none gd-items-center gd-transition-colors gd-duration-100 gd-justify-center gd-h-6 gd-w-6 gd-rounded-md gd-bg-bgLightest group-hover:gd-bg-primaryLight gd-text-textLight group-hover:gd-text-primaryDark", children: /* @__PURE__ */ jsx21(Icon, { icon: props.icon }) }),
    /* @__PURE__ */ jsx21("h2", { className: "gd-text-textHeading gd-text-sm gd-font-bold gd-mt-3 gd-mb-1", children: props.title }),
    /* @__PURE__ */ jsx21("p", { className: "gd-text-text gd-text-sm", children: props.text })
  ] });
}
function SearchResults(props) {
  return /* @__PURE__ */ jsx21("div", { className: "gd-p-2 gd-space-y-2 gd-border-t gd-border-bgLightest gd-max-h-[22rem] gd-overflow-y-auto", children: props.results.map((v) => {
    let title = v.pageTitle ? `${v.pageTitle} / ${v.title}` : v.title;
    if (v.pageTitle === v.title)
      title = v.title;
    return /* @__PURE__ */ jsx21(Combobox.Option, { value: v, as: "article", children: ({ active }) => /* @__PURE__ */ jsxs12(
      Link4,
      {
        href: v.url,
        onClick: props.onClose,
        className: classNames9(
          "gd-p-3 hover:gd-bg-primaryDark gd-group gd-duration-100 gd-transition-colors gd-rounded-lg gd-flex gd-gap-4 gd-items-center gd-relative",
          {
            "!gd-bg-primaryDark": active
          }
        ),
        children: [
          /* @__PURE__ */ jsx21(
            "div",
            {
              className: classNames9(
                "gd-flex gd-flex-none gd-items-center gd-transition-colors gd-duration-100 gd-justify-center gd-h-6 gd-w-6 gd-rounded-md gd-bg-bgLightest group-hover:gd-bg-primaryLight gd-text-textLight group-hover:gd-text-primaryDark",
                {
                  "!gd-bg-primaryLight !gd-text-primaryDark": active
                }
              ),
              children: /* @__PURE__ */ jsx21(Icon, { icon: iconMap[v.type] })
            }
          ),
          /* @__PURE__ */ jsxs12("div", { className: "gd-pr-4", children: [
            /* @__PURE__ */ jsx21("h2", { className: "gd-text-white gd-line-clamp-1 gd-text-sm gd-font-bold", children: title }),
            /* @__PURE__ */ jsx21(
              "p",
              {
                className: classNames9(
                  "group-hover:gd-text-white gd-transition-colors gd-duration-100 gd-text-text gd-line-clamp-1 gd-text-sm",
                  { "!gd-text-white": active }
                ),
                children: v.content
              }
            )
          ] }),
          /* @__PURE__ */ jsx21(
            "div",
            {
              className: classNames9({
                "gd-inset-y-0 gd-absolute gd-right-1 gd-flex gd-translate-x-1 gd-items-center gd-opacity-0 gd-transition-[transform,opacity]": true,
                "group-hover:gd-translate-x-0 group-hover:gd-opacity-100": true,
                "gd-opacity-100 gd-translate-x-0": active
              }),
              children: /* @__PURE__ */ jsx21(
                Icon,
                {
                  icon: "flowbite:chevron-right-outline",
                  className: "gd-text-textHeading gd-text-xl"
                }
              )
            }
          )
        ]
      },
      v.id
    ) }, v.id);
  }) });
}
function SearchScreen(props) {
  const router = useRouter4();
  const { error, loading, results, query, setQuery } = useSearch(
    props.searchKey
  );
  const onChange = useCallback5(
    (e) => {
      if (e)
        void router.push(e.url);
      props.onClose?.();
    },
    [router, props.onClose]
  );
  return /* @__PURE__ */ jsx21(Combobox, { value: null, onChange, children: /* @__PURE__ */ jsxs12("div", { className: "gd-bg-bg gd-border gd-border-bgLightest gd-rounded-lg", children: [
    /* @__PURE__ */ jsxs12("div", { className: "gd-w-full gd-h-14 gd-relative", children: [
      /* @__PURE__ */ jsx21(
        Combobox.Input,
        {
          className: "gd-w-full gd-pl-16 gd-h-full gd-text-textHeading gd-bg-transparent focus:gd-outline-none placeholder:gd-text-text placeholder:gd-text-opacity-75",
          placeholder: "Search for anything you wish to know...",
          value: query,
          onChange: (e) => {
            setQuery(e.target.value);
          },
          type: "text",
          autoFocus: true
        }
      ),
      /* @__PURE__ */ jsx21("div", { className: "gd-absolute gd-left-6 gd-w-4 gd-inset-y-0 gd-flex gd-justify-center gd-items-center", children: /* @__PURE__ */ jsx21(
        Icon,
        {
          icon: "mingcute:search-2-fill",
          className: "gd-text-lg gd-opacity-50"
        }
      ) })
    ] }),
    /* @__PURE__ */ jsx21(Combobox.Options, { static: true, as: "div", children: loading ? /* @__PURE__ */ jsx21("p", { className: "gd-py-12 gd-text-center gd-border-t gd-border-bgLightest", children: "Loading..." }) : error ? /* @__PURE__ */ jsx21(
      SearchMessage,
      {
        icon: "fa6-solid:exclamation",
        title: "Couldn't load search data",
        text: "Try again later"
      }
    ) : query.length > 0 && results && results.length === 0 ? /* @__PURE__ */ jsx21(
      SearchMessage,
      {
        icon: "fa6-solid:question",
        title: "Found no results",
        text: "Try some different keywords"
      }
    ) : query.length > 0 && results ? /* @__PURE__ */ jsx21(SearchResults, { results, onClose: props.onClose }) : null })
  ] }) });
}

// src/client/partials/header/search/modal.tsx
import { jsx as jsx22, jsxs as jsxs13 } from "react/jsx-runtime";
function SearchModal(props) {
  return /* @__PURE__ */ jsxs13("div", { className: "gd-inset-0 gd-fixed gd-z-[75]", children: [
    /* @__PURE__ */ jsx22(
      Transition2.Child,
      {
        as: Fragment10,
        enter: "gd-transition-opacity gd-duration-300",
        enterFrom: "gd-opacity-0",
        enterTo: "gd-opacity-100",
        leave: "gd-duration-100 gd-transition-opacity",
        leaveFrom: "gd-opacity-100",
        leaveTo: "gd-opacity-0",
        children: /* @__PURE__ */ jsx22("div", { className: "gd-inset-0 gd-fixed gd-bg-opacity-75 gd-bg-black" })
      }
    ),
    /* @__PURE__ */ jsx22("div", { className: "gd-inset-0 gd-absolute", onClick: props.onClose }),
    /* @__PURE__ */ jsx22(
      Transition2.Child,
      {
        as: Fragment10,
        enter: "gd-transition-[transform,opacity] gd-duration-300",
        enterFrom: "gd-opacity-0 gd-scale-95",
        enterTo: "gd-opacity-100 gd-scale-100",
        leave: "gd-duration-300 gd-transition-[transform,opacity]",
        leaveFrom: "gd-opacity-100 gd-scale-100",
        leaveTo: "gd-opacity-0 gd-scale-95",
        children: /* @__PURE__ */ jsx22("div", { className: "gd-max-w-[800px] gd-relative gd-mx-auto gd-mt-[25vh]", children: /* @__PURE__ */ jsx22(SearchScreen, { searchKey: props.searchKey, onClose: props.onClose }) })
      }
    )
  ] });
}

// src/client/partials/header/search/index.tsx
import { jsx as jsx23, jsxs as jsxs14 } from "react/jsx-runtime";
function UpdateHead2(props) {
  useEffect10(() => {
    if (props.active)
      document.body.setAttribute("data-header-search-open", "true");
    return () => {
      document.body.removeAttribute("data-header-search-open");
    };
  });
  return null;
}
function HeaderSearch() {
  const [open, setOpen] = useState7(false);
  const openRef = useRef3(open);
  const searchKey = "default";
  usePreloadSearch(searchKey);
  useEffect10(() => {
    openRef.current = open;
  }, [open]);
  useEffect10(() => {
    const listener = (e) => {
      if (openRef.current && e.key === "Escape") {
        setOpen(false);
        e.preventDefault();
        return;
      }
      if (e.key === "k" && e.ctrlKey) {
        setOpen(true);
        e.preventDefault();
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, []);
  return /* @__PURE__ */ jsxs14("div", { className: "gd-ml-2", children: [
    /* @__PURE__ */ jsx23(
      SearchButton,
      {
        onClick: () => {
          setOpen(true);
        }
      }
    ),
    /* @__PURE__ */ jsx23(UpdateHead2, { active: open }),
    /* @__PURE__ */ jsx23(Transition3, { as: Fragment11, show: open, children: /* @__PURE__ */ jsx23("div", { children: /* @__PURE__ */ jsx23(
      SearchModal,
      {
        searchKey,
        onClose: () => {
          setOpen(false);
        }
      }
    ) }) })
  ] });
}

// src/client/partials/header/header.tsx
import { Fragment as Fragment12, jsx as jsx24, jsxs as jsxs15 } from "react/jsx-runtime";
function HeaderInternal() {
  const ctx = useContext3(GuiderLayoutContext);
  const { site, settings } = useGuider(ctx?.meta);
  const [isScrolledFromTop, setIsScrolledFromTop] = useState8(false);
  useEffect11(() => {
    const handleScroll = () => {
      setIsScrolledFromTop(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return /* @__PURE__ */ jsx24(
    "div",
    {
      className: classNames10(
        "gd-sticky gd-z-50 gd-top-0 gd-bg-bg gd-transition-colors gd-duration-300 gd-mb-8",
        isScrolledFromTop ? "gd-bg-opacity-100" : "gd-bg-opacity-0"
      ),
      children: /* @__PURE__ */ jsxs15(
        "header",
        {
          className: classNames10(
            "gd-max-w-[1480px] gd-mx-auto",
            "gd-p-6 gd-pb-0 gd-border-b gd-border-line",
            isScrolledFromTop ? "gd-bg-opacity-100" : "gd-bg-opacity-0"
          ),
          children: [
            /* @__PURE__ */ jsx24("div", { className: "gd-fixed neato-guider-overlay gd-transition-opacity gd-duration-150 gd-opacity-0 gd-inset-0 gd-bg-gradient-to-b gd-from-black/80 gd-to-transparent gd-z-[60] gd-pointer-events-none" }),
            /* @__PURE__ */ jsxs15("div", { className: "gd-flex gd-justify-between gd-mb-6", children: [
              /* @__PURE__ */ jsxs15("div", { className: "gd-flex gd-items-center", children: [
                /* @__PURE__ */ jsx24(GuiderLogo, {}),
                /* @__PURE__ */ jsx24("div", { className: "gd-block md:gd-hidden", children: site.tabs.length > 0 || settings.sidebarState ? /* @__PURE__ */ jsx24(SidebarMobileNav, { tabs: site.tabs }) : null }),
                site.dropdown.length > 0 ? /* @__PURE__ */ jsxs15(Fragment12, { children: [
                  /* @__PURE__ */ jsx24("div", { className: "gd-w-px gd-h-6 gd-bg-line gd-rotate-12 gd-mx-4" }),
                  /* @__PURE__ */ jsx24(HeaderDropdown, { dropdown: site.dropdown })
                ] }) : null,
                /* @__PURE__ */ jsx24(HeaderSearch, {})
              ] }),
              /* @__PURE__ */ jsxs15("div", { className: "gd-hidden md:gd-flex gd-items-center gd-space-x-3", children: [
                /* @__PURE__ */ jsx24(HeaderNav, { items: site.navigation }),
                site.github ? /* @__PURE__ */ jsx24(
                  GithubDisplay,
                  {
                    org: site.github.split("/")[0],
                    repo: site.github.split("/", 2)[1]
                  }
                ) : null
              ] }),
              /* @__PURE__ */ jsx24("div", { className: "gd-flex md:gd-hidden gd-items-center", children: site.navigation.length > 0 || site.github ? /* @__PURE__ */ jsx24(
                TopMobileNav,
                {
                  items: site.navigation,
                  github: {
                    org: site.github?.split("/")[0],
                    repo: site.github?.split("/", 2)[1]
                  }
                }
              ) : null })
            ] }),
            /* @__PURE__ */ jsx24("div", { className: "gd-hidden md:gd-block", children: site.tabs.length > 0 ? /* @__PURE__ */ jsx24(HeaderTabs, { tabs: site.tabs }) : null })
          ]
        }
      )
    }
  );
}

// src/client/partials/header/index.tsx
import { jsx as jsx25 } from "react/jsx-runtime";
function GuiderHeader() {
  const { settings } = useGuiderPage();
  const enabled = settings.navigationState;
  const Comp = settings.navigationComponent ?? HeaderInternal;
  if (!enabled)
    return null;
  return /* @__PURE__ */ jsx25(Comp, {});
}

// src/client/partials/toc/toc.tsx
import classNames11 from "classnames";
import { useContext as useContext4, useMemo as useMemo4 } from "react";

// src/client/hooks/use-toc.ts
import { useCallback as useCallback6, useEffect as useEffect12, useState as useState9 } from "react";
function useVisibleIds(contentId, ids) {
  const [finalList, setFinalList] = useState9(ids);
  const check = useCallback6(
    (idList) => {
      const newList = [];
      idList.forEach((id) => {
        const el = document.getElementById(id);
        if (!el)
          return;
        if (el.offsetParent === null)
          return;
        newList.push(id);
      });
      setFinalList(newList);
    },
    [ids]
  );
  useEffect12(() => {
    const targetNode = document.getElementById(contentId);
    if (!targetNode)
      return;
    const observer = new MutationObserver(() => {
      check(ids);
    });
    observer.observe(targetNode, {
      childList: true,
      subtree: true
    });
    check(ids);
    return () => {
      observer.disconnect();
    };
  }, [contentId, check, JSON.stringify(ids)]);
  return finalList;
}
function useToc(ids) {
  const [activeId, setActiveId] = useState9(null);
  useEffect12(() => {
    function recheck() {
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const centerTarget = windowHeight / 4;
      const viewList = ids.map((id) => {
        const el = document.getElementById(id);
        if (!el)
          return { distance: Infinity, id };
        const rect = el.getBoundingClientRect();
        const distanceTop = Math.abs(centerTarget - rect.top);
        const distanceBottom = Math.abs(centerTarget - rect.bottom);
        const distance = Math.min(distanceBottom, distanceTop);
        return { distance, id };
      }).sort((a, b) => a.distance - b.distance);
      if (viewList.length === 0) {
        setActiveId(null);
        return;
      }
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        setActiveId(viewList[0].id);
      } else {
        setActiveId(viewList[0]?.id ?? "");
      }
    }
    document.addEventListener("scroll", recheck);
    recheck();
    return () => {
      document.removeEventListener("scroll", recheck);
    };
  });
  const scrollTo = useCallback6((id) => {
    const el = document.getElementById(id);
    if (!el)
      return null;
    const y = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: y - 180,
      behavior: "smooth"
    });
  }, []);
  return { activeId, scrollTo };
}

// src/client/partials/toc/toc.tsx
import { jsx as jsx26 } from "react/jsx-runtime";
function TocLink(props) {
  return /* @__PURE__ */ jsx26(
    "p",
    {
      style: {
        paddingLeft: `${Math.max(0, (props.heading.depth - 2) * 8)}px`
      },
      children: /* @__PURE__ */ jsx26(
        "a",
        {
          onClick: (e) => {
            e.preventDefault();
            const url = new URL(window.location.href.toString());
            url.hash = props.heading.data.id;
            history.pushState({}, "", url);
            props.onClick?.();
          },
          href: `#${props.heading.data.id}`,
          className: classNames11({
            "hover:gd-text-textLight gd-transition-colors gd-duration-100": true,
            "gd-text-primary": props.active
          }),
          children: props.heading.value
        }
      )
    }
  );
}
function TocInternal() {
  const ctx = useContext4(GuiderLayoutContext);
  const headings = useMemo4(
    () => [...ctx?.headings ?? []].slice(1).filter((v) => v.depth <= 3),
    [ctx?.headings]
  );
  const ids = useMemo4(() => headings.map((v) => v.data.id), [headings]);
  const visibleIds = useVisibleIds("guider-content", ids);
  const { activeId, scrollTo } = useToc(visibleIds);
  return /* @__PURE__ */ jsx26(ScrollPageHeight, { children: /* @__PURE__ */ jsx26("div", { className: "gd-flex gd-flex-col", children: /* @__PURE__ */ jsx26("div", { className: "gd-space-y-2.5", children: headings.map((heading) => {
    if (!visibleIds.includes(heading.data.id))
      return null;
    return /* @__PURE__ */ jsx26(
      TocLink,
      {
        active: heading.data.id === activeId,
        heading,
        onClick: () => scrollTo(heading.data.id)
      },
      heading.data.id
    );
  }) }) }) });
}

// src/client/partials/toc/index.tsx
import { jsx as jsx27 } from "react/jsx-runtime";
function GuiderToc() {
  const { settings } = useGuiderPage();
  const enabled = settings.tocState;
  const Comp = settings.tocComponent ?? TocInternal;
  if (!enabled)
    return null;
  return /* @__PURE__ */ jsx27(Comp, {});
}

// src/client/partials/content-footer/content-footer.tsx
import Link6 from "next/link.js";

// src/client/partials/content-footer/github-edit-link.tsx
import Link5 from "next/link.js";
import gitUrlParse, { stringify } from "git-url-parse";

// src/client/hooks/use-guider-filepath.tsx
import { useRouter as useRouter5 } from "next/router.js";
import { useMemo as useMemo5 } from "react";
function getFilePath(pageUrl) {
  const matches = pageMap.filter((v) => pageUrl === v.sitePath);
  const match = matches[0];
  return match ?? null;
}
function useGuiderFilePath() {
  const router = useRouter5();
  const pageUrl = router.pathname;
  const filePath = useMemo5(() => {
    return getFilePath(pageUrl);
  }, [pageUrl, pageMap]);
  return filePath;
}

// src/client/partials/content-footer/github-edit-link.tsx
import { jsx as jsx28 } from "react/jsx-runtime";
function useEditLink(baseUrl) {
  const file = useGuiderFilePath();
  if (!baseUrl)
    return null;
  if (!file)
    return null;
  const parsed = gitUrlParse(baseUrl);
  let filePath = parsed.filepath;
  filePath += filePath.length > 0 ? "/" : "";
  filePath += file.urlSafeFilePath;
  parsed.filepath = "";
  const ref = parsed.ref.length > 0 ? parsed.ref : "main";
  return `${stringify(parsed)}/blob/${ref}/${filePath}`;
}
function GithubEditLink(props) {
  return /* @__PURE__ */ jsx28(
    Link5,
    {
      href: props.href,
      target: "_blank",
      rel: "noopener noreferrer",
      className: "hover:gd-opacity-50",
      children: "Edit this page on GitHub"
    }
  );
}

// src/client/partials/content-footer/content-footer.tsx
import { Fragment as Fragment13, jsx as jsx29, jsxs as jsxs16 } from "react/jsx-runtime";
var guiderDocumentationLink = "https://neatojs.com/docs/guider";
var iconMap2 = {
  discord: "ic:twotone-discord",
  github: "mdi:github",
  slack: "mdi:slack",
  mastodon: "fa6-brands:mastodon",
  twitter: "fa6-brands:x-twitter"
};
function FooterSocial(props) {
  return /* @__PURE__ */ jsx29(
    Link6,
    {
      href: props.url,
      target: "_blank",
      rel: "noopener noreferrer",
      className: "gd-size-7 gd-flex gd-items-center gd-justify-center hover:gd-bg-bgLight gd-rounded",
      children: /* @__PURE__ */ jsx29(Icon, { icon: props.icon, className: "gd-text-[1.1rem]" })
    }
  );
}
function ContentFooterInternal() {
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  const { site } = useGuiderPage();
  const editUrl = useEditLink(site?.contentFooter?.editRepositoryBase);
  const copyright = /* @__PURE__ */ jsxs16(Fragment13, { children: [
    "Copyright \xA9 ",
    year
  ] });
  const socials = site.contentFooter?.socials ?? [];
  return /* @__PURE__ */ jsxs16("footer", { className: "gd-py-3 gd-border-t gd-border-line gd-mt-12 gd-text-text gd-text-sm gd-flex gd-justify-between", children: [
    /* @__PURE__ */ jsxs16("div", { className: "gd-flex gd-gap-2 md:gd-gap-4 md:gd-items-center md:gd-flex-row gd-flex-col", children: [
      socials.length > 0 ? /* @__PURE__ */ jsx29("div", { className: "gd-flex gd-items-center gd-space-x-0.5", children: (site.contentFooter?.socials ?? []).map((v) => /* @__PURE__ */ jsx29(FooterSocial, { icon: iconMap2[v.type], url: v.url }, v.type)) }) : null,
      /* @__PURE__ */ jsxs16("div", { children: [
        site.contentFooter?.text ?? copyright,
        " ",
        /* @__PURE__ */ jsx29("span", { className: "gd-text-line gd-mx-1", children: "\u2014" }),
        " ",
        /* @__PURE__ */ jsx29(
          Link6,
          {
            href: guiderDocumentationLink,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "hover:gd-opacity-50",
            children: "Powered by Guider++"
          }
        )
      ] })
    ] }),
    editUrl ? /* @__PURE__ */ jsx29("div", { className: "gd-w-40 gd-text-right", children: /* @__PURE__ */ jsx29(GithubEditLink, { href: editUrl }) }) : null
  ] });
}

// src/client/partials/content-footer/index.tsx
import { jsx as jsx30 } from "react/jsx-runtime";
function GuiderContentFooter() {
  const { settings } = useGuiderPage();
  const enabled = settings.contentFooterState;
  const Comp = settings.contentFooterComponent ?? ContentFooterInternal;
  if (!enabled)
    return null;
  return /* @__PURE__ */ jsx30(Comp, {});
}

// src/client/partials/page-footer/page-footer.tsx
import { jsx as jsx31, jsxs as jsxs17 } from "react/jsx-runtime";
function PageFooterInternal() {
  const { site } = useGuiderPage();
  return /* @__PURE__ */ jsxs17("footer", { className: "gd-py-6 gd-gap-8 gd-border-t gd-border-line gd-mt-6 gd-text-text gd-flex-col md:gd-flex-row gd-flex gd-items-start md:gd-items-center gd-justify-between", children: [
    /* @__PURE__ */ jsx31("div", { children: /* @__PURE__ */ jsx31(GuiderLogo, {}) }),
    site.pageFooter?.text ? /* @__PURE__ */ jsx31("p", { className: "md:gd-text-right", children: site.pageFooter.text }) : null
  ] });
}

// src/client/partials/page-footer/index.tsx
import { jsx as jsx32 } from "react/jsx-runtime";
function GuiderpageFooter() {
  const { settings } = useGuiderPage();
  const enabled = settings.pageFooterState;
  const Comp = settings.pageFooterComponent ?? PageFooterInternal;
  if (!enabled)
    return null;
  return /* @__PURE__ */ jsx32(Comp, {});
}

// src/client/partials/page-end/page-end.tsx
import Link7 from "next/link";
import classNames12 from "classnames";
import { jsx as jsx33, jsxs as jsxs18 } from "react/jsx-runtime";
function PageEndLink(props) {
  return /* @__PURE__ */ jsxs18(
    Link7,
    {
      href: props.to,
      className: classNames12(
        "gd-font-bold gd-text-textHeading gd-flex gd-items-center hover:gd-opacity-75 gd-group gd-transition-opacity",
        {
          "gd-text-right -gd-mr-1.5": props.flip,
          "-gd-ml-1.5": !props.flip
        }
      ),
      children: [
        !props.flip ? /* @__PURE__ */ jsx33(
          Icon,
          {
            icon: "flowbite:chevron-left-outline",
            className: "gd-text-lg gd-mt-0.5 gd-mr-1 gd-transition-transform group-hover:-gd-translate-x-1"
          }
        ) : null,
        props.title,
        props.flip ? /* @__PURE__ */ jsx33(
          Icon,
          {
            icon: "flowbite:chevron-right-outline",
            className: "gd-text-lg gd-mt-0.5 gd-ml-1 gd-transition-transform group-hover:gd-translate-x-1"
          }
        ) : null
      ]
    }
  );
}
function PageEndInternal() {
  const { navContext } = useGuiderPage();
  const hasContent = navContext.prev || navContext.next;
  if (!hasContent)
    return null;
  return /* @__PURE__ */ jsxs18("div", { className: "gd-flex gd-justify-between gd-mt-12", children: [
    /* @__PURE__ */ jsx33("div", { children: navContext.prev ? /* @__PURE__ */ jsx33(
      PageEndLink,
      {
        title: navContext.prev.item.title,
        to: navContext.prev.item.to ?? "#"
      }
    ) : null }),
    /* @__PURE__ */ jsx33("div", { children: navContext.next ? /* @__PURE__ */ jsx33(
      PageEndLink,
      {
        title: navContext.next.item.title,
        to: navContext.next.item.to ?? "#",
        flip: true
      }
    ) : null })
  ] });
}

// src/client/partials/page-end/index.tsx
import { jsx as jsx34 } from "react/jsx-runtime";
function GuiderPageEnd() {
  const { settings } = useGuiderPage();
  const enabled = settings.pageEndState;
  const Comp = settings.pageEndComponent ?? PageEndInternal;
  if (!enabled)
    return null;
  return /* @__PURE__ */ jsx34(Comp, {});
}

// src/client/partials/layout/breadcrumb.tsx
import { jsx as jsx35 } from "react/jsx-runtime";
function Breadcrumb() {
  const { navContext } = useGuiderPage();
  if (!navContext.current?.group)
    return null;
  return /* @__PURE__ */ jsx35("p", { className: "gd-font-bold gd-mb-2 gd-text-primary gd-text-sm", children: navContext.current.group });
}

// src/client/partials/layout/layout.tsx
import { jsx as jsx36, jsxs as jsxs19 } from "react/jsx-runtime";
function LayoutInternal(props) {
  const { settings } = useGuiderPage();
  return /* @__PURE__ */ jsxs19("div", { className: "gd-flex gd-flex-col gd-min-h-screen", children: [
    /* @__PURE__ */ jsx36(GuiderHeader, {}),
    /* @__PURE__ */ jsxs19("div", { className: "gd-w-full gd-px-6 gd-max-w-[1480px] gd-flex-1 gd-flex gd-flex-col gd-mx-auto", children: [
      /* @__PURE__ */ jsxs19(
        "div",
        {
          className: classNames13({
            "gd-grid gd-flex-1 gd-gap-16": true,
            "gd-grid-cols-[1fr] md:gd-grid-cols-[280px,1fr]": !settings.tocState && settings.sidebarState,
            "gd-grid-cols-[1fr]": !settings.tocState && !settings.sidebarState,
            "gd-grid-cols-[1fr] md:gd-grid-cols-[280px,1fr] xl:gd-grid-cols-[280px,1fr,280px]": settings.tocState && settings.sidebarState,
            "gd-grid-cols-[1fr] md:gd-grid-cols-[1fr]": settings.tocState && !settings.sidebarState
          }),
          children: [
            /* @__PURE__ */ jsx36(
              "div",
              {
                className: classNames13({
                  "gd-hidden md:gd-block": true,
                  "!gd-hidden": !settings.sidebarState
                }),
                children: /* @__PURE__ */ jsx36(GuiderSidebar, {})
              }
            ),
            /* @__PURE__ */ jsxs19("article", { className: "gd-mb-16 gd-break-words", children: [
              /* @__PURE__ */ jsx36(Breadcrumb, {}),
              props.children,
              /* @__PURE__ */ jsx36(GuiderPageEnd, {}),
              /* @__PURE__ */ jsx36(GuiderContentFooter, {})
            ] }),
            /* @__PURE__ */ jsx36(
              "div",
              {
                className: classNames13({
                  "gd-hidden xl:gd-block": true,
                  "!gd-hidden": !settings.tocState
                }),
                children: /* @__PURE__ */ jsx36(GuiderToc, {})
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsx36(GuiderpageFooter, {})
    ] })
  ] });
}

// src/client/partials/layout/theme.tsx
import Color from "color";
import { useContext as useContext5, useMemo as useMemo6 } from "react";
import { Helmet, HelmetData } from "react-helmet-async";

// src/client/stores/colors.ts
import { create } from "zustand";
var useThemeColorsStore = create((set) => ({
  colors: {},
  setColor: (colors) => {
    set((state) => ({ colors: { ...state.colors, ...colors } }));
  },
  clearColors: () => {
    set({ colors: {} });
  }
}));

// src/client/partials/layout/theme.tsx
import { jsx as jsx37 } from "react/jsx-runtime";
var helmetData = new HelmetData({});
function convertColor(color) {
  return Color(color).rgb().array().join(" ");
}
function ThemeProvider() {
  const ctx = useContext5(GuiderLayoutContext);
  const { settings } = useGuider(ctx?.meta);
  const serializedSettings = JSON.stringify(settings.colors);
  const overwrittenColors = useThemeColorsStore((s) => s.colors);
  const style = useMemo6(() => {
    const colors = { ...settings.colors, ...overwrittenColors };
    return {
      "--colors-primary": convertColor(colors.primary),
      "--colors-primaryDark": convertColor(colors.primaryDarker),
      "--colors-primaryLight": convertColor(colors.primaryLighter),
      "--colors-text": convertColor(colors.text),
      "--colors-textLight": convertColor(colors.textLighter),
      "--colors-textHeading": convertColor(colors.textHighlight),
      "--colors-bg": convertColor(colors.background),
      "--colors-bgLight": convertColor(colors.backgroundLighter),
      "--colors-bgLightest": convertColor(colors.backgroundLightest),
      "--colors-bgDark": convertColor(colors.backgroundDarker),
      "--colors-line": convertColor(colors.line),
      "--colors-codeWarning": convertColor(colors.codeWarning),
      "--colors-codeError": convertColor(colors.codeError),
      "--colors-codeGreen": convertColor(colors.codeGreen),
      "--colors-codeHighlight": convertColor(colors.codeHighlight),
      "--colors-codeWordHighlight": convertColor(colors.codeWordHighlight),
      "--colors-semanticTip": convertColor(colors.semanticTip),
      "--colors-semanticTipLighter": convertColor(colors.semanticTipLighter),
      "--colors-semanticNote": convertColor(colors.semanticNote),
      "--colors-semanticNoteLighter": convertColor(colors.semanticNoteLighter),
      "--colors-semanticImportant": convertColor(colors.semanticImportant),
      "--colors-semanticImportantLighter": convertColor(
        colors.semanticImportantLighter
      ),
      "--colors-semanticWarning": convertColor(colors.semanticWarning),
      "--colors-semanticWarningLighter": convertColor(
        colors.semanticWarningLighter
      ),
      "--colors-semanticCaution": convertColor(colors.semanticCaution),
      "--colors-semanticCautionLighter": convertColor(
        colors.semanticCautionLighter
      )
    };
  }, [serializedSettings, overwrittenColors]);
  return /* @__PURE__ */ jsx37(Helmet, { helmetData, children: /* @__PURE__ */ jsx37(
    "body",
    {
      style: Object.entries(style).map((v) => v.join(": ")).join(";")
    }
  ) });
}

// src/client/partials/layout/head.tsx
import Head from "next/head.js";

// src/client/components/head.tsx
import { NextSeo } from "next-seo";
import { jsx as jsx38 } from "react/jsx-runtime";
function GuiderMetaComponent(props) {
  if (typeof props.meta === "function")
    return props.meta(props.pageMeta);
  return /* @__PURE__ */ jsx38(
    NextSeo,
    {
      title: props.pageMeta?.title,
      description: props.pageMeta?.description,
      ...props.meta
    }
  );
}
function GuiderMeta() {
  const { page, site } = useGuiderPage();
  const pageMeta = {
    title: page?.meta?.title ?? page?.headings[0]?.value,
    description: page?.meta?.description ?? page?.excerpt
  };
  return /* @__PURE__ */ jsx38(GuiderMetaComponent, { meta: site.meta ?? pageMeta, pageMeta });
}

// src/client/partials/layout/head.tsx
import { Fragment as Fragment14, jsx as jsx39, jsxs as jsxs20 } from "react/jsx-runtime";
function LayoutHead() {
  return /* @__PURE__ */ jsxs20(Fragment14, { children: [
    /* @__PURE__ */ jsx39(GuiderMeta, {}),
    /* @__PURE__ */ jsx39(Head, { children: /* @__PURE__ */ jsx39(
      "meta",
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1.0"
      },
      "gd-viewport"
    ) })
  ] });
}

// src/client/partials/layout/background.tsx
import { jsx as jsx40, jsxs as jsxs21 } from "react/jsx-runtime";
function Shard() {
  return /* @__PURE__ */ jsxs21("div", { className: "gd-opacity-25 gd-absolute gd-inset-0 gd-overflow-hidden gd-pointer-events-none", children: [
    /* @__PURE__ */ jsx40("div", { className: "gd-absolute -gd-top-[50vh] gd-right-1/3 gd-bg-primary gd-w-[270px] gd-h-[750px] gd-rotate-[-50deg] gd-blur-[200px]" }),
    /* @__PURE__ */ jsx40("div", { className: "gd-opacity-50 gd-absolute -gd-top-[25vh] gd-right-1/4 gd-bg-primaryDark gd-w-[214px] gd-h-[884px] gd-rotate-[-22.1deg] gd-blur-[200px]" })
  ] });
}
function LayoutBackground() {
  const { settings } = useGuiderPage();
  if (!settings.backgroundPatternState)
    return null;
  if (settings.backgroundPatternSetting === "flare")
    return /* @__PURE__ */ jsx40(Shard, {});
  return null;
}

// src/client/partials/layout/index.tsx
import { jsx as jsx41, jsxs as jsxs22 } from "react/jsx-runtime";
function GuiderLayout(props) {
  const { settings } = useGuider(props.meta);
  const Comp = settings.pageLayoutComponent ?? LayoutInternal;
  return /* @__PURE__ */ jsxs22(
    GuiderLayoutContext.Provider,
    {
      value: {
        meta: props.meta ?? {},
        headings: props.headings ?? [],
        excerpt: props.excerpt
      },
      children: [
        /* @__PURE__ */ jsx41(LayoutHead, {}),
        /* @__PURE__ */ jsx41(LayoutBackground, {}),
        /* @__PURE__ */ jsx41(ThemeProvider, {}),
        /* @__PURE__ */ jsx41(Comp, { children: /* @__PURE__ */ jsx41("div", { id: "guider-content", children: props.children }) })
      ]
    }
  );
}

// src/client/components/public/index.ts
var public_exports = {};
__export(public_exports, {
  Button: () => Button,
  Callout: () => Callout,
  Card: () => Card,
  CardGrid: () => CardGrid,
  Caution: () => Caution,
  CodeGroup: () => CodeGroup,
  Field: () => Field,
  Frame: () => Frame,
  Hero: () => Hero,
  Important: () => Important,
  Note: () => Note,
  Steps: () => Steps,
  Tabs: () => Tabs,
  Tip: () => Tip,
  Warning: () => Warning
});

// src/client/components/public/tabs.tsx
import { Tab } from "@headlessui/react";
import classNames14 from "classnames";

// src/client/hooks/use-localstorage.ts
import { useCallback as useCallback7, useEffect as useEffect13, useState as useState10 } from "react";
function useLocalStorage(defaultData, key) {
  const [data, setData] = useState10(defaultData);
  const storageKey = `__guider::${key}`;
  const set = useCallback7((newData) => {
    if (key)
      localStorage.setItem(storageKey, JSON.stringify(newData));
    setData(newData);
  }, []);
  useEffect13(() => {
    if (!key)
      return;
    const item = localStorage.getItem(`__guider::${key}`);
    if (!item) {
      setData(defaultData);
      return;
    }
    setData(JSON.parse(item));
  }, [key]);
  return [data, set];
}

// src/client/components/public/tabs.tsx
import { jsx as jsx42, jsxs as jsxs23 } from "react/jsx-runtime";
var TabsContainer = (props) => {
  const [activeTab, setActiveTab] = useLocalStorage(
    props.default ?? 0,
    props.storageKey
  );
  return /* @__PURE__ */ jsxs23(Tab.Group, { selectedIndex: activeTab, onChange: setActiveTab, children: [
    /* @__PURE__ */ jsx42(Tab.List, { className: "gd-relative", children: /* @__PURE__ */ jsx42("div", { className: "gd-grid gd-grid-cols-1 gd-whitespace-nowrap gd-text-nowrap gd-overflow-x-auto", children: /* @__PURE__ */ jsxs23("div", { className: "gd-flex gd-flex-items-end", children: [
      /* @__PURE__ */ jsx42("div", { className: "gd-absolute gd-inset-x-0 gd-bottom-px gd-border-b gd-border-line" }),
      props.items.map((v) => /* @__PURE__ */ jsx42(Tab, { className: "focus:gd-outline-none", children: ({ selected }) => /* @__PURE__ */ jsx42(
        "div",
        {
          className: classNames14({
            "gd-inline-block gd-relative gd-z-10 gd-py-2 gd-mx-1.5 hover:gd-text-textLight gd-border-transparent gd-border-b gd-mb-px gd-px-2": true,
            "!gd-text-textHeading !gd-border-primary": selected
          }),
          children: v
        }
      ) }, v))
    ] }) }) }),
    /* @__PURE__ */ jsx42(Tab.Panels, { className: "gd-mt-4 gd-mb-8", children: props.children })
  ] });
};
var TabsChild = (props) => {
  return /* @__PURE__ */ jsx42(Tab.Panel, { children: props.children });
};
var Tabs = TabsContainer;
Tabs.Tab = TabsChild;

// src/client/components/public/callout.tsx
import classNames15 from "classnames";
import { jsx as jsx43, jsxs as jsxs24 } from "react/jsx-runtime";
var styleMap = {
  caution: "gd-bg-semanticCaution gd-border-semanticCaution gd-text-semanticCautionLighter",
  important: "gd-bg-semanticImportant gd-border-semanticImportant gd-text-semanticImportantLighter",
  tip: "gd-bg-semanticTip gd-border-semanticTip gd-text-semanticTipLighter",
  note: "gd-bg-semanticNote gd-border-semanticNote gd-text-semanticNoteLighter",
  warning: "gd-bg-semanticWarning gd-border-semanticWarning gd-text-semanticWarningLighter"
};
var iconStyleMap = {
  caution: "gd-text-semanticCaution",
  important: "gd-text-semanticImportant",
  tip: "gd-text-semanticTip",
  note: "gd-text-semanticNote",
  warning: "gd-text-semanticWarning"
};
var iconMap3 = {
  caution: "ph:warning-octagon",
  important: "ph:chat-centered-text",
  tip: "ph:lightbulb",
  note: "ph:info",
  warning: "ph:warning"
};
function Callout(props) {
  const type = props.type ?? "note";
  const classes = styleMap[type];
  const iconClasses = iconStyleMap[type];
  return /* @__PURE__ */ jsxs24(
    "div",
    {
      className: classNames15(
        classes,
        "gd-p-4 gd-rounded-md gd-my-6 gd-text-sm gd-bg-opacity-[7%] gd-border gd-border-opacity-50",
        "gd-flex"
      ),
      children: [
        /* @__PURE__ */ jsx43(
          "div",
          {
            className: classNames15(
              iconClasses,
              "gd-text-lg gd-flex items-center gd-mr-3"
            ),
            children: /* @__PURE__ */ jsx43(Icon, { icon: iconMap3[type] })
          }
        ),
        /* @__PURE__ */ jsx43("div", { className: "gd-flex-1 neato-guider-callout-child", children: props.children })
      ]
    }
  );
}
function Tip(props) {
  return /* @__PURE__ */ jsx43(Callout, { type: "tip", children: props.children });
}
function Note(props) {
  return /* @__PURE__ */ jsx43(Callout, { type: "note", children: props.children });
}
function Important(props) {
  return /* @__PURE__ */ jsx43(Callout, { type: "important", children: props.children });
}
function Warning(props) {
  return /* @__PURE__ */ jsx43(Callout, { type: "warning", children: props.children });
}
function Caution(props) {
  return /* @__PURE__ */ jsx43(Callout, { type: "caution", children: props.children });
}

// src/client/components/public/button.tsx
import classNames16 from "classnames";
import Link8 from "next/link.js";
import { jsx as jsx44 } from "react/jsx-runtime";
var buttonStyles = {
  primary: "gd-from-primary gd-to-primaryDark gd-text-textHeading gd-border-primary hover:gd-from-primaryDark hover:gd-to-primaryDark",
  secondary: "gd-from-bgLight gd-to-bg gd-text-textLight hover:gd-text-textHeading gd-border-line hover:gd-from-bg hover:gd-to-bg"
};
function Button(props) {
  const classes = classNames16(
    buttonStyles[props.type ?? "primary"],
    "gd-bg-gradient-to-b gd-text-opacity-80 gd-px-7 gd-py-2.5 gd-rounded-xl gd-border",
    "gd-transition-[background-image,transform]",
    "active:gd-scale-105 gd-inline-block gd-text-center",
    props.className
  );
  if (props.to)
    return /* @__PURE__ */ jsx44(Link8, { href: props.to, className: classes, children: props.children });
  return /* @__PURE__ */ jsx44("button", { className: classes, onClick: props.onClick, children: props.children });
}

// src/client/components/public/steps.tsx
import { jsx as jsx45, jsxs as jsxs25 } from "react/jsx-runtime";
function StepsComponent(props) {
  return /* @__PURE__ */ jsx45("div", { className: "neato-guider-steps gd-mt-8 gd-mb-12 gd-relative", children: props.children });
}
function Step(props) {
  return /* @__PURE__ */ jsxs25("div", { className: "gd-flex neato-guider-steps-step", children: [
    /* @__PURE__ */ jsx45("div", { className: "neato-guider-steps-step-bubble gd-bg-bgLightest gd-rounded-full gd-relative gd-z-10 gd-text-white gd-size-8 gd-flex gd-justify-center gd-items-center gd-mr-4" }),
    /* @__PURE__ */ jsx45("div", { className: "gd-flex-1 neato-guider-steps-step-content gd-mb-12", children: props.children })
  ] });
}
StepsComponent.Step = Step;
var Steps = StepsComponent;

// src/client/components/public/frame.tsx
import { jsx as jsx46, jsxs as jsxs26 } from "react/jsx-runtime";
function Frame(props) {
  const content = /* @__PURE__ */ jsx46("div", { className: "gd-relative gd-p-6 gd-min-h-44 gd-flex gd-items-center gd-justify-center", children: props.children });
  if (props.plain) {
    return /* @__PURE__ */ jsxs26("div", { className: "neato-guider-frame gd-bg-bgLight/50 gd-mb-5 gd-relative gd-border gd-border-line gd-rounded-2xl gd-overflow-hidden", children: [
      /* @__PURE__ */ jsx46("div", { className: "gd-bg-gradient-to-b gd-from-transparent gd-to-bg/90 gd-absolute gd-inset-0" }),
      content
    ] });
  }
  return /* @__PURE__ */ jsxs26("div", { className: "neato-guider-frame gd-bg-text/5 gd-mb-5 gd-relative gd-border gd-border-line gd-rounded-2xl gd-overflow-hidden", children: [
    /* @__PURE__ */ jsx46("div", { className: "neato-guider-frame-grid gd-absolute gd-inset-0" }),
    /* @__PURE__ */ jsx46("div", { className: "gd-bg-gradient-to-b gd-from-transparent gd-to-bg/90 gd-absolute gd-inset-0" }),
    content
  ] });
}

// src/client/components/public/code-group.tsx
import {
  useRef as useRef4,
  useEffect as useEffect14,
  useState as useState11,
  useCallback as useCallback8
} from "react";
import { Tab as Tab2 } from "@headlessui/react";
import classNames17 from "classnames";
import { jsx as jsx47, jsxs as jsxs27 } from "react/jsx-runtime";
var CodeGroupContainer = (props) => {
  const panelsRef = useRef4(null);
  const [tabs, setTabs] = useState11([]);
  const collectTabs = useCallback8(() => {
    const el = panelsRef.current;
    if (!el) {
      setTabs([]);
      return;
    }
    const groups = [...el.querySelectorAll("[data-code-group-title]")];
    setTabs(
      groups.map((v) => v.getAttribute("data-code-group-title")).filter((v) => Boolean(v))
    );
  }, [panelsRef]);
  useEffect14(() => {
    const el = panelsRef.current;
    collectTabs();
    if (!el)
      return;
    const observer = new MutationObserver(() => {
      collectTabs();
    });
    observer.observe(el, { attributes: true, childList: true, subtree: true });
    return () => {
      observer.disconnect();
    };
  }, [panelsRef, collectTabs]);
  return /* @__PURE__ */ jsx47("div", { className: "gd-rounded-lg gd-overflow-hidden gd-mt-4 gd-mb-8", children: /* @__PURE__ */ jsxs27(Tab2.Group, { children: [
    /* @__PURE__ */ jsx47(Tab2.List, { className: "gd-bg-bgDark gd-grid gd-grid-cols-1 gd-whitespace-nowrap gd-text-nowrap gd-overflow-x-auto", children: /* @__PURE__ */ jsx47("div", { className: "gd-flex gd-flex-items-end gd-py-2", children: tabs.map((v) => /* @__PURE__ */ jsx47(Tab2, { className: "focus:gd-outline-none", children: ({ selected }) => /* @__PURE__ */ jsx47(
      "div",
      {
        className: classNames17({
          "gd-text-textLight gd-py-1 gd-mx-2 gd-px-3 gd-text-sm gd-rounded-md hover:gd-bg-bgLightest gd-transition-colors gd-duration-100": true,
          "!gd-text-textHeading !gd-bg-bgLightest": selected
        }),
        children: v
      }
    ) }, v)) }) }),
    /* @__PURE__ */ jsx47(Tab2.Panels, { className: "neato-guider-codegroup", ref: panelsRef, children: props.children })
  ] }) });
};
var CodeGroupChild = (props) => {
  return /* @__PURE__ */ jsx47(
    Tab2.Panel,
    {
      unmount: false,
      "data-code-group-title": props.title,
      className: "neato-guider-codegroup-child",
      children: props.children
    }
  );
};
var CodeGroup = CodeGroupContainer;
CodeGroup.Code = CodeGroupChild;

// src/client/components/public/hero.tsx
import Link9 from "next/link.js";
import classNames18 from "classnames";
import { jsx as jsx48, jsxs as jsxs28 } from "react/jsx-runtime";
function Title(props) {
  return /* @__PURE__ */ jsx48("h1", { className: "gd-max-w-[476px] gd-text-2xl gd-text-center gd-font-bold gd-text-white", children: props.children });
}
function Subtitle(props) {
  return /* @__PURE__ */ jsx48("h1", { className: "gd-max-w-[476px] gd-mt-4 gd-text-[1.125rem] gd-text-center", children: props.children });
}
function Badge(props) {
  const content = /* @__PURE__ */ jsxs28(
    "div",
    {
      className: classNames18(
        "gd-bg-primaryDark gd-text-xs gd-bg-opacity-15 gd-py-1 gd-px-4 gd-text-primaryLight gd-text-opacity-75 gd-rounded-full gd-text-center gd-flex gd-items-center gd-gap-3 gd-mb-3",
        props.to ? "hover:gd-bg-opacity-25 gd-transition-[background-color,transform] active:gd-scale-105" : void 0
      ),
      children: [
        /* @__PURE__ */ jsx48("span", { className: "gd-text-primaryLight gd-text-opacity-100 gd-font-bold", children: props.title }),
        " ",
        props.children,
        props.to ? /* @__PURE__ */ jsx48(
          Icon,
          {
            className: "gd-inline-block gd-font-bold gd-text-[1rem] gd-translate-x-2",
            icon: "lucide:chevron-right"
          }
        ) : null
      ]
    }
  );
  if (props.to)
    return /* @__PURE__ */ jsx48(Link9, { href: props.to, children: content });
  return /* @__PURE__ */ jsx48("div", { children: content });
}
function Actions(props) {
  return /* @__PURE__ */ jsx48("div", { className: "gd-mt-12 gd-w-full gd-gap-5 gd-flex gd-flex-col sm:gd-justify-center sm:gd-flex-row", children: props.children });
}
function HeroFunc(props) {
  return /* @__PURE__ */ jsx48("div", { className: "gd-flex gd-my-24 gd-mb-36 gd-flex-col gd-w-full gd-items-center", children: props.children });
}
var Hero = HeroFunc;
Hero.Actions = Actions;
Hero.Subtitle = Subtitle;
Hero.Badge = Badge;
Hero.Title = Title;

// src/client/components/public/card.tsx
import { jsx as jsx49, jsxs as jsxs29 } from "react/jsx-runtime";
function Card(props) {
  return /* @__PURE__ */ jsxs29("div", { className: "gd-bg-bgLight gd-border hover:gd-border-primaryDark gd-transition-colors gd-duration-100 gd-border-line gd-rounded-xl gd-p-6 gd-pt-8", children: [
    props.icon ? /* @__PURE__ */ jsx49(Icon, { icon: props.icon, className: "gd-text-[2rem] gd-text-primary" }) : null,
    /* @__PURE__ */ jsx49("h2", { className: "gd-text-[20px] gd-my-2 gd-text-white gd-font-bold", children: props.title }),
    props.children
  ] });
}
function CardGrid(props) {
  return /* @__PURE__ */ jsx49("div", { className: "gd-grid gd-grid-cols-1 lg:gd-grid-cols-3 md:gd-mx-16 gd-my-6 gd-gap-6", children: props.children });
}

// src/client/components/public/field.tsx
import { Disclosure, Transition as Transition4 } from "@headlessui/react";
import classNames19 from "classnames";
import { jsx as jsx50, jsxs as jsxs30 } from "react/jsx-runtime";
function FieldFunc(props) {
  return /* @__PURE__ */ jsxs30("div", { className: "neato-guider-field gd-py-5", children: [
    /* @__PURE__ */ jsxs30("h3", { className: "gd-space-x-2 gd-mb-4", children: [
      /* @__PURE__ */ jsx50("span", { className: "gd-text-textHeading", children: props.title }),
      props.type ? /* @__PURE__ */ jsx50("span", { className: "gd-text-text gd-text-sm gd-text-opacity-75", children: props.type }) : null,
      props.required ? /* @__PURE__ */ jsx50("span", { className: "gd-text-primary gd-text-sm", children: "required" }) : null
    ] }),
    props.children
  ] });
}
function Properties(props) {
  const texts = typeof props.text === "string" ? { hide: props.text, show: props.text } : props.text;
  const showText = texts?.show ?? "Show properties";
  const hideText = texts?.hide ?? "Hide properties";
  return /* @__PURE__ */ jsx50(Disclosure, { as: "div", className: "gd-my-4", defaultOpen: props.defaultOpen, children: ({ open }) => /* @__PURE__ */ jsxs30(
    "div",
    {
      className: classNames19(
        "gd-border gd-rounded-2xl gd-inline-flex gd-overflow-hidden gd-flex-col gd-border-line",
        {
          "!gd-flex": open
        }
      ),
      children: [
        /* @__PURE__ */ jsx50(Disclosure.Button, { className: "gd-relative gd-transition-[color] gd-duration-100 gd-text-text gd-text-sm hover:gd-text-textHeading", children: /* @__PURE__ */ jsxs30("div", { className: "gd-flex gd-items-center gd-py-2 gd-px-4 gd-space-x-2", children: [
          /* @__PURE__ */ jsx50(
            Icon,
            {
              icon: "mingcute:close-fill",
              inline: true,
              className: open ? "gd-transition-[color,transform]" : "gd-transition-[color,transform] gd-rotate-45"
            }
          ),
          /* @__PURE__ */ jsx50("span", { children: open ? hideText : showText })
        ] }) }),
        /* @__PURE__ */ jsx50(
          Transition4,
          {
            enter: "gd-transition-transform gd-transform gd-duration-[50ms] gd-ease-out",
            enterFrom: "-gd-translate-y-5 gd-opacity-0",
            enterTo: "gd-opacity-100 gd-translate-y-0",
            leave: "gd-transition-transform gd-transform gd-duration-[50ms] gd-ease-out",
            leaveFrom: "gd-opacity-100 gd-translate-y-0",
            leaveTo: "-gd-translate-y-5 gd-opacity-0",
            children: /* @__PURE__ */ jsxs30(Disclosure.Panel, { className: "gd-relative", children: [
              /* @__PURE__ */ jsx50(
                "hr",
                {
                  className: classNames19({
                    "gd-h-px gd-bg-line gd-border-none gd-inset-x-0 gd-absolute gd-transition-opacity gd-duration-100 gd-top-0 gd-opacity-0": true,
                    "!gd-opacity-100": open
                  })
                }
              ),
              /* @__PURE__ */ jsx50("div", { className: "gd-px-4 neato-guider-field-props-children", children: props.children })
            ] })
          }
        )
      ]
    }
  ) });
}
var Field = FieldFunc;
Field.Properties = Properties;

// src/client/page/create-mdx-page.tsx
import { jsx as jsx51 } from "react/jsx-runtime";
function createMdxPage(opts) {
  const Content = opts.MDXContent;
  const page = () => /* @__PURE__ */ jsx51(Content, { components: { ...public_exports } });
  page.getLayout = (content) => {
    return /* @__PURE__ */ jsx51(
      GuiderLayout,
      {
        meta: opts.pageOpts.meta,
        headings: opts.pageOpts.headings,
        excerpt: opts.pageOpts.excerpt,
        children: content
      }
    );
  };
  return page;
}

// src/client/page/create-guider-app.tsx
import { jsx as jsx52 } from "react/jsx-runtime";
function createGuiderApp() {
  return function GuiderApp(props) {
    const Comp = props.Component;
    const getLayout = Comp.getLayout ?? ((page) => page);
    return getLayout(/* @__PURE__ */ jsx52(Comp, { ...props.pageProps }));
  };
}

// src/client/page/create-404-page.tsx
import { jsx as jsx53, jsxs as jsxs31 } from "react/jsx-runtime";
function createNotFoundPage(opts) {
  const content = /* @__PURE__ */ jsx53("div", { className: "gd-flex gd-min-h-[70vh] gd-flex-col gd-items-center gd-justify-center", children: /* @__PURE__ */ jsxs31("div", { className: "gd-flex gd-flex-col gd-items-center gd-justify-center gd-text-center gd-relative", children: [
    /* @__PURE__ */ jsxs31("div", { className: "gd-absolute -gd-top-48 -gd-z-10 gd-overflow-hidden", children: [
      /* @__PURE__ */ jsx53("p", { className: "gd-font-bold gd-text-[15rem] gd-text-bgLightest gd-tracking-tighter", children: "404" }),
      /* @__PURE__ */ jsx53("div", { className: "gd-absolute gd-inset-0 gd-bg-gradient-to-t gd-from-bg gd-from-40% gd-to-60% gd-to-transparent" })
    ] }),
    /* @__PURE__ */ jsx53("p", { className: "gd-text-sm gd-font-bold gd-text-primary", children: "Not found" }),
    /* @__PURE__ */ jsx53("h1", { className: "gd-text-xl gd-font-bold gd-my-2 gd-text-textHeading", children: "We couldn't find that page" }),
    /* @__PURE__ */ jsx53("p", { className: "gd-text-base gd-mb-8 gd-text-text gd-max-w-56", children: "Maybe you can find your way on the home page?" }),
    /* @__PURE__ */ jsx53(Button, { to: "/", children: "Back to home" })
  ] }) });
  return createMdxPage({
    MDXContent: () => opts?.content ?? content,
    pageOpts: {
      meta: {
        layout: "page"
      }
    }
  });
}

// src/client/page/redirect.tsx
import { useRouter as useRouter6 } from "next/navigation.js";
import { useEffect as useEffect15 } from "react";
import { jsx as jsx54 } from "react/jsx-runtime";
function Redirect(props) {
  const router = useRouter6();
  useEffect15(() => {
    router.replace(props.to);
  }, []);
  return props.children;
}
function createRedirect(opts) {
  return () => /* @__PURE__ */ jsx54(Redirect, { to: opts.to });
}

// src/client/hooks/use-guider-theme.tsx
function useGuiderTheme() {
  const setColors = useThemeColorsStore((s) => s.setColor);
  const clearColors = useThemeColorsStore((s) => s.clearColors);
  const colors = useThemeColorsStore((s) => s.colors);
  return {
    setColors,
    clearColors,
    colors
  };
}

// src/client/components/markdown/code.tsx
import { useCallback as useCallback9, useRef as useRef5, useState as useState12 } from "react";
import { jsx as jsx55, jsxs as jsxs32 } from "react/jsx-runtime";
function useCopy() {
  const timeoutRef = useRef5(null);
  const [copied, setCopied] = useState12(false);
  const copy = useCallback9((contents) => {
    navigator.clipboard.writeText(contents).then(() => {
      setCopied(true);
      if (timeoutRef.current !== null)
        clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setCopied(false);
      }, 2e3);
    }).catch((err) => {
      console.error("Failed to copy to clipboard", err);
    });
  }, []);
  return { copied, copy };
}
function CopyButton(props) {
  return /* @__PURE__ */ jsx55(
    "button",
    {
      type: "button",
      onClick: props.onClick,
      className: "gd-rounded neato-guider-copy gd-text-text gd-text-opacity-50 hover:gd-bg-text hover:gd-text-white hover:gd-text-opacity-100 hover:gd-bg-opacity-25 gd-text-lg gd-size-8 gd-flex gd-items-center gd-justify-center active:gd-scale-110 gd-transition-transform gd-duration-150 gd-py-2 gd-px-4",
      children: props.copied ? /* @__PURE__ */ jsx55(
        Icon,
        {
          icon: "ph:check-bold",
          className: "gd-text-semanticTipLighter gd-mr-2"
        }
      ) : /* @__PURE__ */ jsx55(Icon, { icon: "mingcute:copy-2-fill", className: "gd-mr-2" })
    }
  );
}
function MarkdownCodeBlock(props) {
  const ref = useRef5(null);
  const { copy, copied } = useCopy();
  const copyCode = useCallback9(() => {
    const el = ref.current;
    if (!el)
      return;
    const code = el.querySelector("code");
    if (!code)
      return;
    copy(code.innerText);
  }, [copy]);
  if (props.attrs["data-theme"])
    return props.children;
  return /* @__PURE__ */ jsxs32("figure", { className: "neato-guider-codeblock", ref, ...props.attrs, children: [
    /* @__PURE__ */ jsx55(CopyButton, { copied, onClick: copyCode }),
    props.children
  ] });
}

// src/client/components/markdown/hr.tsx
import classNames20 from "classnames";
import { jsx as jsx56 } from "react/jsx-runtime";
function MarkdownHr(props) {
  return /* @__PURE__ */ jsx56(
    "hr",
    {
      ...props.attrs,
      className: classNames20(
        "gd-my-4 gd-border-0 gd-h-px gd-bg-line",
        props.attrs.className
      )
    }
  );
}

// src/client/components/markdown/footnotes.tsx
import { jsx as jsx57, jsxs as jsxs33 } from "react/jsx-runtime";
function MarkdownFootnotes(props) {
  return /* @__PURE__ */ jsxs33("section", { ...props.attrs, className: "neato-guider-footnotes", children: [
    /* @__PURE__ */ jsx57(MarkdownHr, { attrs: { className: "!gd-my-6" } }),
    props.children
  ] });
}
function MarkdownFootnoteLink(props) {
  return /* @__PURE__ */ jsx57(
    "a",
    {
      ...props.attrs,
      className: "gd-text-primary gd-translate-y-1 gd-inline-block gd-no-underline gd-font-bold hover:gd-text-primaryDark gd-transition-colors gd-duration-100",
      children: /* @__PURE__ */ jsx57(
        Icon,
        {
          inline: true,
          icon: "fluent:arrow-hook-down-left-16-filled",
          className: " gd-text-lg"
        }
      )
    }
  );
}
function MarkdownFootnoteNumber(props) {
  return /* @__PURE__ */ jsx57(
    "a",
    {
      ...props.attrs,
      className: "gd-inline-block gd-no-underline gd-font-bold gd-px-1 hover:gd-text-primaryDark gd-transition-colors gd-duration-100",
      children: props.children
    }
  );
}

// src/client/components/markdown/headings.tsx
import classNames21 from "classnames";
import { jsx as jsx58, jsxs as jsxs34 } from "react/jsx-runtime";
var headingClasses = "gd-relative neato-guider-heading gd-group gd-scroll-m-48";
function HeadingAnchor(props) {
  if (!props.attrs.id)
    return null;
  return /* @__PURE__ */ jsx58(
    "a",
    {
      href: `#${props.attrs.id}`,
      className: "neato-guider-heading-anchor gd-top-0 group-hover:gd-opacity-50 gd-hidden md:gd-inline gd-text-textLight gd-transition-opacity gd-duration-100 gd-select-none gd-absolute gd-left-0 gd-opacity-0 gd-pr-[.3em] -gd-ml-[1em] hover:!gd-opacity-75 gd-font-normal",
      children: "#"
    }
  );
}
function MarkdownH1(props) {
  return /* @__PURE__ */ jsxs34(
    "h1",
    {
      ...props.attrs,
      className: classNames21(
        "gd-font-bold gd-text-textHeading gd-mt-12 gd-text-2xl gd-mb-3",
        props.attrs.class,
        headingClasses
      ),
      children: [
        props.children,
        /* @__PURE__ */ jsx58(HeadingAnchor, { attrs: props.attrs })
      ]
    }
  );
}
function MarkdownH2(props) {
  return /* @__PURE__ */ jsxs34(
    "h2",
    {
      ...props.attrs,
      className: classNames21(
        "gd-font-bold gd-text-textHeading gd-text-xl gd-mt-10 gd-mb-4",
        props.attrs.class,
        headingClasses
      ),
      children: [
        props.children,
        /* @__PURE__ */ jsx58(HeadingAnchor, { attrs: props.attrs })
      ]
    }
  );
}
function MarkdownH3(props) {
  return /* @__PURE__ */ jsxs34(
    "h3",
    {
      ...props.attrs,
      className: classNames21(
        "gd-font-bold gd-text-textHeading gd-text-lg gd-mt-10 gd-mb-4",
        props.attrs.class,
        headingClasses
      ),
      children: [
        props.children,
        /* @__PURE__ */ jsx58(HeadingAnchor, { attrs: props.attrs })
      ]
    }
  );
}
function MarkdownH4(props) {
  return /* @__PURE__ */ jsxs34(
    "h3",
    {
      ...props.attrs,
      className: classNames21(
        "gd-font-bold gd-text-textHeading gd-text-lg gd-mt-10 gd-mb-4",
        props.attrs.class,
        headingClasses
      ),
      children: [
        props.children,
        /* @__PURE__ */ jsx58(HeadingAnchor, { attrs: props.attrs })
      ]
    }
  );
}
function MarkdownH5(props) {
  return /* @__PURE__ */ jsxs34(
    "h3",
    {
      ...props.attrs,
      className: classNames21(
        "gd-font-bold gd-text-textHeading gd-text-lg gd-mt-10 gd-mb-4",
        props.attrs.class,
        headingClasses
      ),
      children: [
        props.children,
        /* @__PURE__ */ jsx58(HeadingAnchor, { attrs: props.attrs })
      ]
    }
  );
}
function MarkdownH6(props) {
  return /* @__PURE__ */ jsxs34(
    "h3",
    {
      ...props.attrs,
      className: classNames21(
        "gd-font-bold gd-text-textHeading gd-text-lg gd-mt-10 gd-mb-4",
        props.attrs.class,
        headingClasses
      ),
      children: [
        props.children,
        /* @__PURE__ */ jsx58(HeadingAnchor, { attrs: props.attrs })
      ]
    }
  );
}

// src/client/components/markdown/image.tsx
import classNames22 from "classnames";
import { useRouter as useRouter7 } from "next/router";
import { jsx as jsx59 } from "react/jsx-runtime";
function MarkdownImage(props) {
  const router = useRouter7();
  const srcInput = props.attrs.src;
  const src = srcInput?.startsWith("/") ? router.basePath + srcInput : srcInput;
  return /* @__PURE__ */ jsx59(
    "img",
    {
      ...props.attrs,
      src,
      className: classNames22("gd-rounded-lg", props.attrs.className)
    }
  );
}

// src/client/components/markdown/inline.tsx
import classNames23 from "classnames";
import { jsx as jsx60 } from "react/jsx-runtime";
function MarkdownStrong(props) {
  return /* @__PURE__ */ jsx60(
    "strong",
    {
      ...props.attrs,
      className: classNames23(
        "gd-font-semibold gd-text-textHeading gd-text-opacity-85",
        props.attrs.class
      ),
      children: props.children
    }
  );
}
function MarkdownItalic(props) {
  return /* @__PURE__ */ jsx60("em", { ...props.attrs, className: classNames23("gd-italic", props.attrs.class), children: props.children });
}
function MarkdownStrike(props) {
  return /* @__PURE__ */ jsx60(
    "del",
    {
      ...props.attrs,
      className: classNames23("gd-line-through", props.attrs.class),
      children: props.children
    }
  );
}

// src/client/components/markdown/lists.tsx
import classNames24 from "classnames";
import { jsx as jsx61, jsxs as jsxs35 } from "react/jsx-runtime";
function MarkdownUl(props) {
  return /* @__PURE__ */ jsx61(
    "ul",
    {
      ...props.attrs,
      className: classNames24(
        "gd-pl-7 neato-guider-list gd-mb-3 gd-relative",
        props.attrs.class
      ),
      children: props.children
    }
  );
}
function MarkdownLi(props) {
  return /* @__PURE__ */ jsxs35("li", { ...props.attrs, className: classNames24("gd-mb-3", props.attrs.class), children: [
    /* @__PURE__ */ jsx61("span", { className: "gd-absolute neato-guider-list-line gd-opacity-75 gd-whitespace-nowrap gd-inline-block gd-left-0 gd-mt-3 gd-h-px gd-w-3 gd-bg-text" }),
    /* @__PURE__ */ jsx61("span", { className: "gd-absolute gd-text-[.7rem] neato-guider-task gd-hidden gd-border gd-border-line gd-left-0 gd-mt-1 gd-size-4 gd-rounded-[5px] gd-text-textHeading gd-items-center gd-justify-center", children: /* @__PURE__ */ jsx61(
      Icon,
      {
        icon: "ph:check-bold",
        className: "neato-guider-task-icon gd-hidden"
      }
    ) }),
    props.children
  ] });
}
function MarkdownOl(props) {
  return /* @__PURE__ */ jsx61(
    "ol",
    {
      ...props.attrs,
      className: classNames24(
        "gd-pl-7 neato-guider-list gd-mb-3 gd-relative",
        props.attrs.class
      ),
      children: props.children
    }
  );
}

// src/client/components/markdown/paragraph.tsx
import Link10 from "next/link.js";
import { jsx as jsx62 } from "react/jsx-runtime";
function MarkdownParagraph(props) {
  return /* @__PURE__ */ jsx62("p", { className: "gd-mb-3 gd-leading-relaxed", ...props.attrs, children: props.children });
}
function MarkdownLink(props) {
  return /* @__PURE__ */ jsx62(
    Link10,
    {
      ...props.attrs,
      href: props.attrs.href ?? "#",
      className: "gd-text-textHeading gd-text-opacity-90 gd-border-b gd-border-primary gd-font-semibold hover:gd-text-opacity-100 hover:gd-border-b-2 gd-transition-colors gd-duration-100",
      children: props.children
    }
  );
}

// src/client/components/markdown/quote.tsx
import { jsx as jsx63 } from "react/jsx-runtime";
function MarkdownQuote(props) {
  return /* @__PURE__ */ jsx63(
    "blockquote",
    {
      ...props.attrs,
      className: "neato-guider-blockquote gd-border-l-4 gd-border-bgLightest gd-p-1 gd-pl-4 gd-mb-3",
      children: props.children
    }
  );
}

// src/client/components/markdown/table.tsx
import classNames25 from "classnames";
import { jsx as jsx64 } from "react/jsx-runtime";
function MarkdownTable(props) {
  return /* @__PURE__ */ jsx64(
    "div",
    {
      className: classNames25(
        "gd-rounded-xl gd-border gd-border-line gd-overflow-x-auto gd-grid gd-grid-cols-1 gd-my-8",
        props.attrs.class
      ),
      children: /* @__PURE__ */ jsx64(
        "table",
        {
          className: "gd-text-sm neato-guider-table gd-w-full gd-border-hidden",
          ...props.attrs,
          children: props.children
        }
      )
    }
  );
}
function MarkdownTHead(props) {
  return /* @__PURE__ */ jsx64(
    "thead",
    {
      className: classNames25(
        "gd-bg-bgLight gd-text-textHeading gd-font-semibold",
        props.attrs.class
      ),
      ...props.attrs,
      children: props.children
    }
  );
}
function MarkdownTBody(props) {
  return /* @__PURE__ */ jsx64("tbody", { ...props.attrs, children: props.children });
}
function MarkdownTR(props) {
  return /* @__PURE__ */ jsx64("tr", { ...props.attrs, children: props.children });
}
function MarkdownTH(props) {
  return /* @__PURE__ */ jsx64(
    "th",
    {
      className: classNames25(
        "gd-px-4 gd-py-3 gd-border gd-border-line gd-text-left",
        props.attrs.class
      ),
      ...props.attrs,
      children: props.children
    }
  );
}
function MarkdownTD(props) {
  return /* @__PURE__ */ jsx64(
    "td",
    {
      className: classNames25(
        "gd-px-4 gd-py-3 gd-border gd-border-line",
        props.attrs.class
      ),
      ...props.attrs,
      children: props.children
    }
  );
}

// src/client/components/markdown/index.tsx
import { jsx as jsx65 } from "react/jsx-runtime";
function useMDXComponents() {
  return {
    h1(props) {
      return /* @__PURE__ */ jsx65(MarkdownH1, { attrs: props, children: props.children });
    },
    h2(props) {
      return /* @__PURE__ */ jsx65(MarkdownH2, { attrs: props, children: props.children });
    },
    h3(props) {
      return /* @__PURE__ */ jsx65(MarkdownH3, { attrs: props, children: props.children });
    },
    h4(props) {
      return /* @__PURE__ */ jsx65(MarkdownH4, { attrs: props, children: props.children });
    },
    h5(props) {
      return /* @__PURE__ */ jsx65(MarkdownH5, { attrs: props, children: props.children });
    },
    h6(props) {
      return /* @__PURE__ */ jsx65(MarkdownH6, { attrs: props, children: props.children });
    },
    p(props) {
      return /* @__PURE__ */ jsx65(MarkdownParagraph, { attrs: props, children: props.children });
    },
    figure(props) {
      if (props["data-rehype-pretty-code-figure"] !== void 0)
        return /* @__PURE__ */ jsx65(MarkdownCodeBlock, { attrs: props, children: props.children });
      return /* @__PURE__ */ jsx65("figure", { ...props });
    },
    pre(props) {
      return /* @__PURE__ */ jsx65("pre", { children: props.children });
    },
    em(props) {
      return /* @__PURE__ */ jsx65(MarkdownItalic, { attrs: props, children: props.children });
    },
    del(props) {
      return /* @__PURE__ */ jsx65(MarkdownStrike, { attrs: props, children: props.children });
    },
    strong(props) {
      return /* @__PURE__ */ jsx65(MarkdownStrong, { attrs: props, children: props.children });
    },
    ul(props) {
      return /* @__PURE__ */ jsx65(MarkdownUl, { attrs: props, children: props.children });
    },
    li(props) {
      return /* @__PURE__ */ jsx65(MarkdownLi, { attrs: props, children: props.children });
    },
    ol(props) {
      return /* @__PURE__ */ jsx65(MarkdownOl, { attrs: props, children: props.children });
    },
    table(props) {
      return /* @__PURE__ */ jsx65(MarkdownTable, { attrs: props, children: props.children });
    },
    thead(props) {
      return /* @__PURE__ */ jsx65(MarkdownTHead, { attrs: props, children: props.children });
    },
    tbody(props) {
      return /* @__PURE__ */ jsx65(MarkdownTBody, { attrs: props, children: props.children });
    },
    tr(props) {
      return /* @__PURE__ */ jsx65(MarkdownTR, { attrs: props, children: props.children });
    },
    td(props) {
      return /* @__PURE__ */ jsx65(MarkdownTD, { attrs: props, children: props.children });
    },
    th(props) {
      return /* @__PURE__ */ jsx65(MarkdownTH, { attrs: props, children: props.children });
    },
    blockquote(props) {
      return /* @__PURE__ */ jsx65(MarkdownQuote, { attrs: props, children: props.children });
    },
    a(props) {
      if (props["data-footnote-ref"])
        return /* @__PURE__ */ jsx65(MarkdownFootnoteNumber, { attrs: props, children: props.children });
      if (props["data-footnote-backref"] !== void 0)
        return /* @__PURE__ */ jsx65(MarkdownFootnoteLink, { attrs: props, children: props.children });
      return /* @__PURE__ */ jsx65(MarkdownLink, { attrs: props, children: props.children });
    },
    hr(props) {
      return /* @__PURE__ */ jsx65(MarkdownHr, { attrs: props });
    },
    section(props) {
      if (props["data-footnotes"])
        return /* @__PURE__ */ jsx65(MarkdownFootnotes, { attrs: props, children: props.children });
      return /* @__PURE__ */ jsx65("section", { ...props, children: props.children });
    },
    img(props) {
      return /* @__PURE__ */ jsx65(MarkdownImage, { attrs: props });
    }
  };
}
export {
  Button,
  Callout,
  Card,
  CardGrid,
  Caution,
  CodeGroup,
  Field,
  Frame,
  GuiderContentFooter,
  GuiderHeader,
  GuiderLayout,
  GuiderLogo,
  GuiderSidebar,
  GuiderToc,
  GuiderpageFooter,
  Hero,
  Icon,
  Important,
  Note,
  Steps,
  Tabs,
  Tip,
  Warning,
  createGuiderApp,
  createMdxPage,
  createNotFoundPage,
  createRedirect,
  getGuiderContext,
  getPage,
  metaMap,
  pageMap,
  sites,
  useGuider,
  useGuiderPage,
  useGuiderTheme,
  useMDXComponents,
  useToc,
  useVisibleIds
};
