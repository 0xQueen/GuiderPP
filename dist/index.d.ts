import { NextConfig } from 'next';

type GuiderInitConfig = {
    themeConfig: string;
};

type CollectorItem = {
    sitePath: string;
    fileContents: Record<string, any>;
    config: Record<string, any>;
};
type PageMapItem = {
    sitePath: string;
    filePath: string;
    urlSafeFilePath: string;
};

type VirtualCache = {
    items: CollectorItem[];
    themeFile: string;
    pageMap: PageMapItem[];
};

declare function getGuiderPluginCache(): VirtualCache;

declare function guider(initConfig: GuiderInitConfig): (nextConfig?: NextConfig) => NextConfig;

export { getGuiderPluginCache, guider };
