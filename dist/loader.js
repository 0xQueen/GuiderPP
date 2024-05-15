// src/webpack/loader/index.ts
import { findPagesDir as findPagesDir2 } from "next/dist/lib/find-pages-dir.js";
import { getGuiderPluginCache } from "@neato/guider";

// src/webpack/plugin/plugin.ts
import { findPagesDir } from "next/dist/lib/find-pages-dir.js";

// src/webpack/plugin/collector.ts
import {
  relative,
  dirname,
  sep,
  normalize,
  extname,
  basename
} from "node:path";
import { readFile } from "node:fs/promises";
import { glob } from "glob";
var pathSeparatorRegex = RegExp(`\\${sep}`, "g");
function normalizePathSeparator(path2) {
  return path2.replace(pathSeparatorRegex, "/");
}
async function filePathToSitePath(filePath) {
  let strippedPath = dirname(relative("./pages", filePath));
  const fileContents = await readFile(filePath, "utf-8");
  const parsedContents = JSON.parse(fileContents);
  strippedPath = normalizePathSeparator(strippedPath);
  return {
    sitePath: `/${strippedPath}`,
    fileContents: parsedContents,
    config: {}
  };
}
async function pagePathToSitePath(filePath) {
  const file = basename(filePath, extname(filePath));
  let dir = dirname(relative("./pages", filePath));
  if (dir === ".")
    dir = "";
  dir = normalizePathSeparator(dir);
  const urlSafeFilePath = normalizePathSeparator(filePath);
  if (file.startsWith("_"))
    return null;
  const strippedPath = file === "index" ? dir : `${dir}/${file}`;
  return {
    sitePath: strippedPath.startsWith("/") ? strippedPath : `/${strippedPath}`,
    filePath,
    urlSafeFilePath
  };
}
function isParent(parent, dir) {
  const normalizedParent = normalize(parent) + sep;
  const normalizedDir = normalize(dir) + sep;
  return normalizedDir.startsWith(normalizedParent);
}
async function collectMetaFiles(_ops) {
  const metaFiles = await glob("pages/**/_meta.json", {
    ignore: "node_modules/**"
  });
  const unfilteredItems = await Promise.all(
    metaFiles.map((v) => filePathToSitePath(v))
  );
  const items = unfilteredItems.filter((v) => Boolean(v));
  for (const item of items) {
    let parents = items.filter(
      (parent) => isParent(parent.sitePath, item.sitePath)
    );
    parents = parents.sort((a, b) => a.sitePath.length - b.sitePath.length);
    const finalConfig = parents.reduce(
      (a, v) => ({ ...a, ...v.fileContents }),
      {}
    );
    item.config = finalConfig;
  }
  const pageFiles = await glob("pages/**/*.{tsx,ts,js,jsx,mdx,md}", {
    ignore: "node_modules/**"
  });
  const unfilteredPageFileList = await Promise.all(
    pageFiles.map((v) => pagePathToSitePath(v))
  );
  const pageFileList = unfilteredPageFileList.filter(
    (v) => Boolean(v)
  );
  return {
    items,
    pageMap: pageFileList
  };
}

// src/webpack/plugin/cache.ts
function makeVirtualCache() {
  const cache = {
    items: [],
    themeFile: "",
    pageMap: []
  };
  return {
    setItems(newItems) {
      cache.items = newItems;
    },
    setPageMap(pageMap) {
      cache.pageMap = pageMap;
    },
    setThemeFile(newThemeFile) {
      cache.themeFile = newThemeFile;
    },
    get() {
      return cache;
    }
  };
}
var virtualCache = makeVirtualCache();

// src/webpack/plugin/theme-resolver.ts
import path from "node:path";
function themeFileResolver(themePath) {
  const url = path.resolve(themePath);
  return url;
}

// src/webpack/plugin/plugin.ts
async function runScanner(config) {
  const directories = findPagesDir(process.cwd());
  if (!directories.pagesDir) {
    return;
  }
  const result = await collectMetaFiles({ dir: directories.pagesDir });
  virtualCache.setPageMap(result.pageMap);
  virtualCache.setItems(result.items);
  virtualCache.setThemeFile(themeFileResolver(config.themeConfig));
}

// src/webpack/loader/md-loader.ts
import { compile } from "@mdx-js/mdx";
import remarkFrontmatter from "remark-frontmatter";
import remarkHeadings from "@vcarl/remark-headings";
import remarkHeadingId from "remark-heading-id";
import grayMatter from "gray-matter";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeExtractExcerpt from "rehype-extract-excerpt";
import remarkLinkRewrite from "remark-link-rewrite";
import { remarkNpm2Yarn } from "@theguild/remark-npm2yarn";
import remarkGfm from "remark-gfm";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationFocus,
  transformerNotationWordHighlight,
  transformerNotationErrorLevel
} from "@shikijs/transformers";

// src/webpack/loader/search-data.ts
import { SKIP, visit } from "unist-util-visit";
import { phrasing } from "mdast-util-phrasing";
function remarkSearchData() {
  return (root, vFile) => {
    const sections = [];
    let currentSection;
    let previousParentNode;
    visit(root, (node, _, parent) => {
      var _a;
      if (node.type === "heading") {
        if (currentSection) {
          sections.push(currentSection);
        }
        const heading = node;
        const id = ((_a = heading.data) == null ? void 0 : _a.id) ?? "";
        const depth = heading.depth;
        let text = "";
        visit(heading, ["text", "inlineCode"], (hChild) => {
          text += hChild.value;
        });
        currentSection = {
          heading: {
            id,
            depth,
            text
          },
          content: ""
        };
        return SKIP;
      }
      if (node.type === "text" || node.type === "inlineCode") {
        if (!currentSection) {
          currentSection = {
            heading: void 0,
            content: ""
          };
        }
        if (previousParentNode && previousParentNode !== parent && !phrasing(previousParentNode)) {
          currentSection.content += " ";
        }
        currentSection.content += node.value;
        previousParentNode = parent;
      }
    });
    if (currentSection)
      sections.push(currentSection);
    vFile.data = { ...vFile.data, sections };
  };
}

// src/webpack/loader/md-loader.ts
var EXPORT_FOOTER = "export default ";
async function mdLoader(source) {
  var _a;
  const meta = grayMatter(source);
  const file = await compile(source, {
    jsx: true,
    outputFormat: "program",
    format: "detect",
    providerImportSource: "@neato/guider/client",
    remarkPlugins: [
      remarkFrontmatter,
      [remarkHeadingId, { defaults: true }],
      remarkHeadings,
      [
        remarkNpm2Yarn,
        {
          packageName: "@neato/guider/client",
          tabNamesProp: "items",
          storageKey: "__guider_packageManager"
        }
      ],
      remarkGfm,
      [
        remarkLinkRewrite,
        {
          replacer: (url) => {
            const hasProtocol = Boolean(url.match(/[a-zA-Z]+:/g));
            if (hasProtocol)
              return url;
            const [path2, hash] = url.split("#", 2);
            const pathSections = path2.split("/");
            const lastSectionIndex = pathSections.length - 1;
            const lastDot = pathSections[lastSectionIndex].lastIndexOf(".");
            if (lastDot === -1)
              return url;
            pathSections[lastSectionIndex] = pathSections[lastSectionIndex].slice(0, lastDot);
            const hashPath = hash && hash.length > 0 ? `#${hash}` : "";
            return `${pathSections.join("/")}${hashPath}`;
          }
        }
      ],
      remarkSearchData
    ],
    rehypePlugins: [
      rehypeExtractExcerpt,
      [
        rehypePrettyCode,
        {
          defaultLang: "txt",
          keepBackground: false,
          transformers: [
            transformerNotationDiff(),
            transformerNotationHighlight(),
            transformerNotationFocus(),
            transformerNotationWordHighlight(),
            transformerNotationErrorLevel()
          ]
        }
      ]
    ]
  });
  const mdxCode = file.toString();
  const lastIndexOfFooter = mdxCode.lastIndexOf(EXPORT_FOOTER);
  const finalMdxCode = mdxCode.slice(0, lastIndexOfFooter) + mdxCode.slice(lastIndexOfFooter + EXPORT_FOOTER.length);
  const pageOpts = {
    meta: meta.data,
    headings: file.data.headings,
    excerpt: file.data.excerpt
  };
  const firstHeading = file.data.headings.find(
    (h) => h.depth === 1
  );
  const script = `
    import { createMdxPage } from "@neato/guider/client";

    ${finalMdxCode}

    const __guiderPageOptions = {
      MDXContent,
      pageOpts: ${JSON.stringify(pageOpts)},
    }

    export default createMdxPage(__guiderPageOptions);
  `;
  return {
    script,
    searchData: {
      sections: file.data.sections,
      pageTitle: ((_a = meta.data) == null ? void 0 : _a.title) ?? (firstHeading == null ? void 0 : firstHeading.value) ?? void 0
    }
  };
}

// src/webpack/loader/virtual-loader.ts
function virtualLoader(cacheData) {
  const stringifiedTheme = JSON.stringify(cacheData.themeFile);
  const stringifiedMetaMap = JSON.stringify(cacheData.items);
  const stringifiedPageMap = JSON.stringify(cacheData.pageMap);
  return `
    export { default as sites } from ${stringifiedTheme};
    export const metaMap = ${stringifiedMetaMap};
    export const pageMap = ${stringifiedPageMap};
  `;
}

// src/webpack/loader/index.ts
async function loader(context, source) {
  const { type, guiderConfig } = context.getOptions();
  context.cacheable(true);
  if (guiderConfig)
    await runScanner(guiderConfig);
  const directories = findPagesDir2(process.cwd());
  if (directories.pagesDir)
    context.addContextDependency(directories.pagesDir);
  if (type === "virtual")
    return virtualLoader(getGuiderPluginCache());
  if (type === "mdx")
    return (await mdLoader(source)).script;
  throw new Error(`Loader used with incorrect type (${type})`);
}
function cbLoader(source, callback) {
  loader(this, source).then((result) => {
    callback(null, result);
  }).catch((err) => {
    callback(err);
  });
}

// src/loader.ts
var loader_default = cbLoader;
export {
  loader_default as default
};
