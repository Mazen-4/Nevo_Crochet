import { notFound } from 'next/navigation';

/** Sends unknown localized URLs (`/en/anything`) to the storefront 404, inside the site layout and with translations. */
export default function CatchAllPage() {
  notFound();
}
