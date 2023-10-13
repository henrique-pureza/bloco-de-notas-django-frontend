import type { Metadata } from "next";
import { Roboto } from "next/font/google";

const roboto = Roboto({ weight: ["300", "400", "500", "700"], subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Home | Bloco de Notas"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={roboto.className} style={{ margin: 0, padding: 0 }}>{children}</body>
        </html>
    );
}
