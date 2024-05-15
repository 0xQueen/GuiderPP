import { PartialDeep } from 'type-fest';
import { ReactNode } from 'react';
import { NextSeoProps } from 'next-seo';

interface SeparatorComponent {
    type: 'separator';
}
type SeparatorBuilder = () => SeparatorComponent;
declare const separator: SeparatorBuilder;

type NestedLinkComponentChildren = LinkComponent | SeparatorComponent;
interface ExtraLinkOptions {
    icon?: string;
    newTab?: boolean;
    exact?: boolean;
    style?: "star" | "default";
}
interface LinkOptions {
    title: string;
    to: string;
    exact?: boolean;
    icon?: string;
    newTab?: boolean;
}
interface NestedLinkOptions {
    title: string;
    to?: string;
    exact?: boolean;
    icon?: string;
    newTab?: boolean;
    items: LinkComponent[];
}
interface LinkComponent {
    type: "link";
    title: string;
    to: string;
    newTab: boolean;
    exact?: boolean;
    icon?: string;
    style: "star" | "default";
}
interface NestableLinkComponent {
    type: "nested-link";
    title: string;
    to?: string;
    exact?: boolean;
    newTab: boolean;
    icon?: string;
    items: NestedLinkComponentChildren[];
}
interface LinkFunctions {
    (title: string, url: string, ops?: ExtraLinkOptions): LinkComponent;
    (options: LinkOptions): LinkComponent;
}
interface LinkBuilder extends LinkFunctions {
    nested: {
        (title: string, url: string, items: NestedLinkComponentChildren[]): NestableLinkComponent;
        (title: string, items: NestedLinkComponentChildren[]): NestableLinkComponent;
        (options: NestedLinkOptions): NestableLinkComponent;
    };
}
declare const link: LinkBuilder;

interface CustomComponentOptions {
    component: () => ReactNode;
}
interface CustomComponentComponent {
    type: 'component';
    component: () => ReactNode;
}
interface CustomComponentBuilder {
    (component: () => ReactNode): CustomComponentComponent;
    (options: CustomComponentOptions): CustomComponentComponent;
}
declare const component: CustomComponentBuilder;

type GroupComponentChildren = NestableLinkComponent | LinkComponent | SeparatorComponent | CustomComponentComponent;
interface GroupOptions<T> {
    title: string;
    items: T[];
}
interface GroupComponent<T> {
    type: 'group';
    title: string;
    items: T[];
}
interface GroupBuilder {
    <T>(title: string, items: T[]): GroupComponent<T>;
    <T>(options: GroupOptions<T>): GroupComponent<T>;
}
declare const group: GroupBuilder;

type BackgroundPatterns = 'flare';
type ToggleSetting = false | true;
type Partial = () => ReactNode;
type ToggleablePartial = ToggleSetting | Partial;
type LayoutSettings = {
    colors: {
        primary: string;
        primaryLighter: string;
        primaryDarker: string;
        background: string;
        backgroundLighter: string;
        backgroundLightest: string;
        text: string;
        textLighter: string;
        textHighlight: string;
        backgroundDarker: string;
        line: string;
        codeWarning: string;
        codeError: string;
        codeGreen: string;
        codeHighlight: string;
        codeWordHighlight: string;
        semanticTip: string;
        semanticTipLighter: string;
        semanticNote: string;
        semanticNoteLighter: string;
        semanticImportant: string;
        semanticImportantLighter: string;
        semanticWarning: string;
        semanticWarningLighter: string;
        semanticCaution: string;
        semanticCautionLighter: string;
    };
    toc: ToggleablePartial;
    sidebar: ToggleablePartial;
    navigation: ToggleablePartial;
    contentFooter: ToggleablePartial;
    pageFooter: ToggleablePartial;
    pageEnd: ToggleablePartial;
    logo: ToggleablePartial;
    pageLayout?: Partial;
    backgroundPattern: ToggleSetting | BackgroundPatterns;
};
type PopulatedLayoutSettings = {
    colors: {
        primary: string;
        primaryLighter: string;
        primaryDarker: string;
        background: string;
        backgroundLighter: string;
        backgroundLightest: string;
        text: string;
        textLighter: string;
        textHighlight: string;
        backgroundDarker: string;
        line: string;
        codeWarning: string;
        codeError: string;
        codeGreen: string;
        codeHighlight: string;
        codeWordHighlight: string;
        semanticTip: string;
        semanticTipLighter: string;
        semanticNote: string;
        semanticNoteLighter: string;
        semanticImportant: string;
        semanticImportantLighter: string;
        semanticWarning: string;
        semanticWarningLighter: string;
        semanticCaution: string;
        semanticCautionLighter: string;
    };
    backgroundPatternState: ToggleSetting;
    tocState: ToggleSetting;
    sidebarState: ToggleSetting;
    navigationState: ToggleSetting;
    contentFooterState: ToggleSetting;
    pageFooterState: ToggleSetting;
    pageEndState: ToggleSetting;
    logoState: ToggleSetting;
    pageLayoutComponent?: Partial;
    backgroundPatternSetting?: BackgroundPatterns;
    tocComponent?: Partial;
    sidebarComponent?: Partial;
    navigationComponent?: Partial;
    contentFooterComponent?: Partial;
    pageFooterComponent?: Partial;
    logoComponent?: Partial;
    pageEndComponent?: Partial;
};

type DirectoryComponentChildren = NestableLinkComponent | LinkComponent | SeparatorComponent | CustomComponentComponent | GroupComponent<GroupComponentChildren>;
interface DirectoryOptions {
    layout?: string;
    settings?: PartialDeep<LayoutSettings>;
    sidebar?: DirectoryComponentChildren[];
}
interface DirectoryComponent {
    id: string;
    layout: string;
    settings: PartialDeep<LayoutSettings>;
    sidebar: DirectoryComponentChildren[];
}
type DirectoryBuilder = (id: string, options: DirectoryOptions) => DirectoryComponent;
declare const directory: DirectoryBuilder;

type SiteLayoutOptions = {
    id: string;
    settings?: PartialDeep<LayoutSettings>;
};
type SiteLayoutComponent = {
    id: string;
    settings: PopulatedLayoutSettings;
    settingsOverrides: PartialDeep<PopulatedLayoutSettings>;
};
declare function makeLayoutSettings(val: PartialDeep<LayoutSettings>): PartialDeep<PopulatedLayoutSettings>;
declare function mergeLayoutSettings(root: PopulatedLayoutSettings, target: PartialDeep<PopulatedLayoutSettings>): PopulatedLayoutSettings;
declare function mergeWithRoot(settings: PartialDeep<PopulatedLayoutSettings>): PopulatedLayoutSettings;
declare function populateLayout(rootSettings: PopulatedLayoutSettings, layout: SiteLayoutOptions): SiteLayoutComponent;

type SocialTypes = 'slack' | 'mastodon' | 'twitter' | 'discord' | 'github';
interface SocialOptions {
    type: SocialTypes;
    url: string;
}
interface SocialComponent {
    type: SocialTypes;
    url: string;
}
type SocialBuilder = {
    twitter: (url: string) => SocialComponent;
    mastodon: (url: string) => SocialComponent;
    slack: (url: string) => SocialComponent;
    discord: (url: string) => SocialComponent;
    x: (url: string) => SocialComponent;
    github: (url: string) => SocialComponent;
    (options: SocialOptions): SocialComponent;
};
declare const social: SocialBuilder;

type ContentFooterOptions = {
    socials?: SocialComponent[];
    text?: string;
    editRepositoryBase?: string;
};
type PageFooterOptions = {
    text?: string;
};
type ContentFooterComponent = {
    socials?: SocialComponent[];
    text?: string;
    editRepositoryBase?: string;
};
type PageFooterComponent = {
    text?: string;
};
declare function populateContentFooter(ops: ContentFooterOptions): ContentFooterComponent;

type TopNavChildren = LinkComponent | SeparatorComponent | CustomComponentComponent;
type TabsChildren = LinkComponent | CustomComponentComponent;
type DropdownChildren = LinkComponent | GroupComponent<LinkComponent>;
interface SiteOptions {
    navigation?: TopNavChildren[];
    extends?: SiteComponent[];
    tabs?: TabsChildren[];
    meta?: MetaTagComponent;
    dropdown?: DropdownChildren[];
    github?: string;
    layout?: string;
    logo?: {
        to?: string;
        name?: string;
    };
    settings?: PartialDeep<LayoutSettings>;
    directories?: DirectoryComponent[];
    layouts?: SiteLayoutOptions[];
    contentFooter?: ContentFooterOptions;
    pageFooter?: PageFooterOptions;
}
type MetaTagPageMeta = {
    title?: string;
    description?: string;
};
type MetaTagComponent = ((pageMeta: MetaTagPageMeta) => ReactNode) | NextSeoProps;
interface SiteComponent {
    type: 'site';
    id: string;
    navigation: TopNavChildren[];
    tabs: TabsChildren[];
    dropdown: DropdownChildren[];
    github?: string;
    logo: {
        to?: string;
        name?: string;
    };
    layout?: string;
    meta?: MetaTagComponent;
    settingOverrides: PartialDeep<PopulatedLayoutSettings>;
    settings: PopulatedLayoutSettings;
    directories: DirectoryComponent[];
    layouts: SiteLayoutComponent[];
    contentFooter?: ContentFooterComponent;
    pageFooter?: PageFooterComponent;
}
type SiteBuilder = (id: string, options: SiteOptions) => SiteComponent;
declare const site: SiteBuilder;
declare function siteTemplate(ops: SiteOptions): SiteComponent;

type GuiderConfig = SiteOptions | SiteComponent[];
type MetaConf = {
    site?: string;
    directory?: string;
    layout?: string;
};
type MetaMapItem = {
    sitePath: string;
    fileContents: Record<string, any>;
    config: MetaConf;
};
type PageMapItem = {
    sitePath: string;
    filePath: string;
    urlSafeFilePath: string;
};

export { LayoutSettings as $, SiteBuilder as A, site as B, CustomComponentComponent as C, DirectoryComponent as D, ExtraLinkOptions as E, siteTemplate as F, GuiderConfig as G, ContentFooterOptions as H, PageFooterOptions as I, ContentFooterComponent as J, PageFooterComponent as K, LinkComponent as L, MetaMapItem as M, NestableLinkComponent as N, populateContentFooter as O, PageMapItem as P, SiteLayoutOptions as Q, makeLayoutSettings as R, SiteComponent as S, TopNavChildren as T, mergeLayoutSettings as U, mergeWithRoot as V, populateLayout as W, BackgroundPatterns as X, ToggleSetting as Y, Partial as Z, ToggleablePartial as _, MetaConf as a, SocialTypes as a0, SocialComponent as a1, SocialBuilder as a2, social as a3, PopulatedLayoutSettings as b, SiteLayoutComponent as c, CustomComponentBuilder as d, component as e, DirectoryBuilder as f, directory as g, GroupComponentChildren as h, GroupOptions as i, GroupComponent as j, GroupBuilder as k, group as l, NestedLinkComponentChildren as m, LinkOptions as n, NestedLinkOptions as o, LinkFunctions as p, LinkBuilder as q, link as r, SeparatorComponent as s, SeparatorBuilder as t, separator as u, TabsChildren as v, DropdownChildren as w, SiteOptions as x, MetaTagPageMeta as y, MetaTagComponent as z };
