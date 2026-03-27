import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
    metadataBase: new URL("https://www.effitaxes.com"),
    alternates: {
        canonical: "https://www.effitaxes.com/fr",
    },
};

export default function RootPage() {
    redirect("/fr");
}
