import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { IMAGE_SOURCES } from "./lib/image-hosts";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: IMAGE_SOURCES.map(({ hostname, pathPrefix }) => ({
      protocol: 'https',
      hostname,
      pathname: pathPrefix ? `${pathPrefix}**` : '/**',
    })),
  },
};

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

export default withNextIntl(nextConfig);
