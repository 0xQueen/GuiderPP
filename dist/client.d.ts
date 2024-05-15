import { S as SiteComponent, M as MetaMapItem, P as PageMapItem, a as MetaConf, b as PopulatedLayoutSettings, D as DirectoryComponent, c as SiteLayoutComponent, L as LinkComponent, N as NestableLinkComponent } from './types-bf396e6b.js';
import * as next from 'next';
import { NextComponentType } from 'next';
import * as react from 'react';
import { ReactElement, ReactNode } from 'react';
import { AppProps } from 'next/app.js';
import * as react_jsx_runtime from 'react/jsx-runtime';
import 'type-fest';
import 'next-seo';

declare const sites: SiteComponent[];
declare const metaMap: MetaMapItem[];
declare const pageMap: PageMapItem[];

type FrontmatterConf = {
    title?: string;
    description?: string;
};
type PageMeta = MetaConf & FrontmatterConf;

type MdxHeadings = {
    depth: number;
    value: string;
    data: {
        id: string;
    };
};

type CreateMdxPageOptions = {
    MDXContent: (props: any) => any;
    pageOpts: {
        meta: PageMeta;
        headings?: MdxHeadings[];
        excerpt?: string;
    };
};
declare function createMdxPage(opts: CreateMdxPageOptions): react.FunctionComponent<{}> & {
    getInitialProps?(context: next.NextPageContext): {} | Promise<{}>;
} & {
    getLayout?: ((content: react.ReactElement<any, string | react.JSXElementConstructor<any>>) => react.ReactNode) | undefined;
};

type GuiderPageWithLayout = NextComponentType & {
    getLayout?: (content: ReactElement) => ReactNode;
};
declare function createGuiderApp(): (props: AppProps) => ReactNode;

type CreateNotFoundPage = {
    content?: ReactNode;
};
declare function createNotFoundPage(opts?: CreateNotFoundPage): react.FunctionComponent<{}> & {
    getInitialProps?(context: next.NextPageContext): {} | Promise<{}>;
} & {
    getLayout?: ((content: react.ReactElement<any, string | react.JSXElementConstructor<any>>) => ReactNode) | undefined;
};

type CreateRedirectOptions = {
    to: string;
};
declare function createRedirect(opts: CreateRedirectOptions): () => react_jsx_runtime.JSX.Element;

declare function useGuiderPage(): {
    page: {
        meta: PageMeta;
        headings: MdxHeadings[];
        excerpt?: string | undefined;
    } | undefined;
    metaMap: MetaMapItem[];
    settings: PopulatedLayoutSettings;
    directory: DirectoryComponent;
    layout: SiteLayoutComponent;
    site: SiteComponent;
    navContext: {
        prev: {
            item: LinkComponent | NestableLinkComponent;
            group?: string | undefined;
        } | null;
        current: {
            item: LinkComponent | NestableLinkComponent;
            group?: string | undefined;
        };
        next: {
            item: LinkComponent | NestableLinkComponent;
            group?: string | undefined;
        } | null;
    } | {
        prev: null;
        current: null;
        next: null;
    };
};

declare function getPage(pageUrl: string): MetaMapItem;
declare function getGuiderContext(pageUrl: string, pageMeta?: MetaConf): {
    metaMap: MetaMapItem[];
    settings: PopulatedLayoutSettings;
    directory: DirectoryComponent;
    layout: SiteLayoutComponent;
    site: SiteComponent;
    navContext: {
        prev: {
            item: LinkComponent | NestableLinkComponent;
            group?: string | undefined;
        } | null;
        current: {
            item: LinkComponent | NestableLinkComponent;
            group?: string | undefined;
        };
        next: {
            item: LinkComponent | NestableLinkComponent;
            group?: string | undefined;
        } | null;
    } | {
        prev: null;
        current: null;
        next: null;
    };
};
declare function useGuider(pageMeta?: MetaConf): {
    metaMap: MetaMapItem[];
    settings: PopulatedLayoutSettings;
    directory: DirectoryComponent;
    layout: SiteLayoutComponent;
    site: SiteComponent;
    navContext: {
        prev: {
            item: LinkComponent | NestableLinkComponent;
            group?: string | undefined;
        } | null;
        current: {
            item: LinkComponent | NestableLinkComponent;
            group?: string | undefined;
        };
        next: {
            item: LinkComponent | NestableLinkComponent;
            group?: string | undefined;
        } | null;
    } | {
        prev: null;
        current: null;
        next: null;
    };
};

declare function useVisibleIds(contentId: string, ids: string[]): string[];
declare function useToc(ids: string[]): {
    activeId: string | null;
    scrollTo: (id: string) => null | undefined;
};

interface ThemeColorStoreColors {
    primary?: string;
    primaryLighter?: string;
    primaryDarker?: string;
    background?: string;
    backgroundLighter?: string;
    backgroundLightest?: string;
    text?: string;
    textLighter?: string;
    textHighlight?: string;
    backgroundDarker?: string;
    line?: string;
    codeWarning?: string;
    codeError?: string;
    codeGreen?: string;
    codeHighlight?: string;
    codeWordHighlight?: string;
    semanticTip?: string;
    semanticTipLighter?: string;
    semanticNote?: string;
    semanticNoteLighter?: string;
    semanticImportant?: string;
    semanticImportantLighter?: string;
    semanticWarning?: string;
    semanticWarningLighter?: string;
    semanticCaution?: string;
    semanticCautionLighter?: string;
}
interface ThemeColorStore {
    colors: ThemeColorStoreColors;
    setColor: (colors: ThemeColorStoreColors) => void;
    clearColors: () => void;
}

declare function useGuiderTheme(): {
    setColors: (colors: ThemeColorStoreColors) => void;
    clearColors: () => void;
    colors: ThemeColorStoreColors;
};

declare function GuiderHeader(): react_jsx_runtime.JSX.Element | null;

type InternalGuiderLayoutProps = {
    children?: ReactNode;
    meta?: MetaConf;
    headings?: MdxHeadings[];
    excerpt?: string;
};
declare function GuiderLayout(props: InternalGuiderLayoutProps): react_jsx_runtime.JSX.Element;

declare function GuiderSidebar(): react_jsx_runtime.JSX.Element | null;

declare function GuiderToc(): react_jsx_runtime.JSX.Element | null;

declare function GuiderLogo(): react_jsx_runtime.JSX.Element | null;

declare function GuiderContentFooter(): react_jsx_runtime.JSX.Element | null;

declare function GuiderpageFooter(): react_jsx_runtime.JSX.Element | null;

interface TabsProps {
    items: string[];
    storageKey?: string;
    default?: number;
    children?: ReactNode;
}
interface TabsChildProps {
    children?: ReactNode;
}
interface TabsComponent {
    (props: TabsProps): ReactNode;
    Tab: (props: TabsChildProps) => ReactNode;
}
declare const Tabs: TabsComponent;

type CalloutTypes = 'warning' | 'note' | 'caution' | 'important' | 'tip';
interface SpecificCalloutProps {
    children?: ReactNode;
}
interface CalloutProps extends SpecificCalloutProps {
    type?: CalloutTypes;
}
declare function Callout(props: CalloutProps): react_jsx_runtime.JSX.Element;
declare function Tip(props: SpecificCalloutProps): react_jsx_runtime.JSX.Element;
declare function Note(props: SpecificCalloutProps): react_jsx_runtime.JSX.Element;
declare function Important(props: SpecificCalloutProps): react_jsx_runtime.JSX.Element;
declare function Warning(props: SpecificCalloutProps): react_jsx_runtime.JSX.Element;
declare function Caution(props: SpecificCalloutProps): react_jsx_runtime.JSX.Element;

interface ButtonProps {
    to?: string;
    children?: ReactNode;
    className?: string;
    type?: 'primary' | 'secondary';
    onClick?: () => void;
}
declare function Button(props: ButtonProps): react_jsx_runtime.JSX.Element;

interface StepsProps {
    children?: ReactNode;
}
interface SingleStepProp {
    children?: ReactNode;
}
interface StepComponent {
    (props: StepsProps): ReactNode;
    Step: (props: SingleStepProp) => ReactNode;
}
declare function StepsComponent(props: StepsProps): react_jsx_runtime.JSX.Element;
declare const Steps: typeof StepsComponent;

declare function Frame(props: {
    children?: ReactNode;
    plain?: boolean;
}): react_jsx_runtime.JSX.Element;

interface CodeGroupProps {
    default?: number;
    children?: ReactNode;
}
interface CodeGroupChildProps {
    title: string;
    children?: ReactNode;
}
interface CodeGroupComponent {
    (props: CodeGroupProps): ReactNode;
    Code: (props: CodeGroupChildProps) => ReactNode;
}
declare const CodeGroup: CodeGroupComponent;

type HeroBuilder = {
    (props: {
        children: React.ReactNode;
    }): ReactNode;
    Title: (props: {
        children: React.ReactNode;
    }) => ReactNode;
    Subtitle: (props: {
        children: React.ReactNode;
    }) => ReactNode;
    Actions: (props: {
        children: React.ReactNode;
    }) => ReactNode;
    Badge: (props: {
        title: string;
        children: React.ReactNode;
        to?: string;
    }) => ReactNode;
};
declare const Hero: HeroBuilder;

type CardProps = {
    icon?: string;
    title: string;
    children?: ReactNode;
};
declare function Card(props: CardProps): react_jsx_runtime.JSX.Element;
declare function CardGrid(props: {
    children?: ReactNode;
}): react_jsx_runtime.JSX.Element;

interface FieldProps {
    type?: string;
    required?: boolean;
    title?: string;
    children?: ReactNode;
}
interface FieldPropertiesProps {
    text?: string | {
        show?: string;
        hide?: string;
    };
    defaultOpen?: boolean;
    children?: ReactNode;
}
interface FieldComponent {
    (props: FieldProps): ReactNode;
    Properties: (props: FieldPropertiesProps) => ReactNode;
}
declare const Field: FieldComponent;

declare function Icon(props: {
    icon: string;
    className?: string;
    inline?: boolean;
}): react_jsx_runtime.JSX.Element;

type ElementProps = Record<string, string>;

declare function useMDXComponents(): {
    h1(props: ElementProps): react_jsx_runtime.JSX.Element;
    h2(props: ElementProps): react_jsx_runtime.JSX.Element;
    h3(props: ElementProps): react_jsx_runtime.JSX.Element;
    h4(props: ElementProps): react_jsx_runtime.JSX.Element;
    h5(props: ElementProps): react_jsx_runtime.JSX.Element;
    h6(props: ElementProps): react_jsx_runtime.JSX.Element;
    p(props: ElementProps): react_jsx_runtime.JSX.Element;
    figure(props: ElementProps): react_jsx_runtime.JSX.Element;
    pre(props: ElementProps): react_jsx_runtime.JSX.Element;
    em(props: ElementProps): react_jsx_runtime.JSX.Element;
    del(props: ElementProps): react_jsx_runtime.JSX.Element;
    strong(props: ElementProps): react_jsx_runtime.JSX.Element;
    ul(props: ElementProps): react_jsx_runtime.JSX.Element;
    li(props: ElementProps): react_jsx_runtime.JSX.Element;
    ol(props: ElementProps): react_jsx_runtime.JSX.Element;
    table(props: ElementProps): react_jsx_runtime.JSX.Element;
    thead(props: ElementProps): react_jsx_runtime.JSX.Element;
    tbody(props: ElementProps): react_jsx_runtime.JSX.Element;
    tr(props: ElementProps): react_jsx_runtime.JSX.Element;
    td(props: ElementProps): react_jsx_runtime.JSX.Element;
    th(props: ElementProps): react_jsx_runtime.JSX.Element;
    blockquote(props: ElementProps): react_jsx_runtime.JSX.Element;
    a(props: ElementProps): react_jsx_runtime.JSX.Element;
    hr(props: ElementProps): react_jsx_runtime.JSX.Element;
    section(props: ElementProps): react_jsx_runtime.JSX.Element;
    img(props: ElementProps): react_jsx_runtime.JSX.Element;
};

export { Button, ButtonProps, Callout, CalloutProps, CalloutTypes, Card, CardGrid, CardProps, Caution, CodeGroup, CodeGroupChildProps, CodeGroupComponent, CodeGroupProps, CreateMdxPageOptions, CreateNotFoundPage, CreateRedirectOptions, Field, FieldComponent, FieldPropertiesProps, FieldProps, Frame, GuiderContentFooter, GuiderHeader, GuiderLayout, GuiderLogo, GuiderPageWithLayout, GuiderSidebar, GuiderToc, GuiderpageFooter, Hero, HeroBuilder, Icon, Important, Note, SingleStepProp, SpecificCalloutProps, StepComponent, Steps, StepsProps, Tabs, TabsChildProps, TabsComponent, TabsProps, ThemeColorStore, ThemeColorStoreColors, Tip, Warning, createGuiderApp, createMdxPage, createNotFoundPage, createRedirect, getGuiderContext, getPage, metaMap, pageMap, sites, useGuider, useGuiderPage, useGuiderTheme, useMDXComponents, useToc, useVisibleIds };
