import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Phase G: Next 16 requires every `quality` value used anywhere in the
    // app to be explicitly allow-listed here (default is just [75]) — any
    // value not in this list silently snaps to the closest one, which is
    // exactly why the Phase F hero could never actually render sharper than
    // quality=75 even though nothing in the component code said so. 92 is
    // the hero's explicit quality; 75 stays available as the sane default
    // for every other `next/image` instance in the app that doesn't set one.
    qualities: [75, 92],
  },
};

export default nextConfig;
