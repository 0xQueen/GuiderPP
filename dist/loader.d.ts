import { LoaderContext } from 'webpack';

type GuiderInitConfig = {
    themeConfig: string;
};

interface LoaderOptions {
    type?: 'mdx' | 'virtual';
    guiderConfig?: GuiderInitConfig;
}
declare function cbLoader(this: LoaderContext<LoaderOptions>, source: string, callback: (err: Error | null, content?: string | undefined) => void): void;

export { cbLoader as default };
