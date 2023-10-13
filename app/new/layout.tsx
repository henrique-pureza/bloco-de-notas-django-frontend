import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Nova nota | Bloco de Notas"
};

export default function NewLayout({ children }: { children: React.ReactNode }) {
    return children;
}
