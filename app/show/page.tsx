"use client";

import Header from "@/components/Header";
import { Container, Skeleton, Typography } from "@mui/material";
import Toast from "@/components/Toast";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";



export default function Show() {
    const params = useSearchParams();

    const titulo = params.get("titulo");
    const from = params.get("from");
    const [ nota, setNota ] = useState<{ titulo: string; nota: string; }>({ titulo: "", nota: "" });
    const [ toastOpened, setToastOpened ] = useState<boolean>(false);
    const [ toastMessage, setToastMessage ] = useState<string>("");
    const [ isFetching, setIsFetching ] = useState<boolean>(true);

    useEffect(() => {
        async function getNota(nota: string) {
            try {
                const req = await fetch(
                    `http://localhost:8000/api/notas/${nota}`
                );

                const res: { titulo: string; nota: string; } = await req.json();

                setNota(res);
                setIsFetching(false);

                if (from && from === "newPage") {
                    setToastOpened(true);
                    setToastMessage(`Nota "${titulo}" criada com sucesso!`);
                } else if (from === "editPage") {
                    setToastOpened(true);
                    setToastMessage(`Nota "${titulo}" editada com sucesso!`);
                }
            } catch (e) {
                setNota({ titulo: "", nota: "" });
                setToastOpened(true);
                setToastMessage(String(e));
            }
        }

        if (titulo) getNota(titulo);
    }, [titulo, from]);

    return (
        <>
            <Header
                note={titulo}
                showing
            />

            <Container sx={{ mt: 3 }}>
                {nota && (
                    <>
                        <Typography variant="h4" sx={{ mb: 2 }}>
                            {nota.titulo}
                        </Typography>

                        <Typography sx={{ whiteSpace: "pre" }}>
                            {nota.nota}
                        </Typography>
                    </>
                )}

                {isFetching && (
                    <>
                        <Skeleton variant="rectangular" width={150} height={40} sx={{ mb: 3 }} />
                        <Skeleton variant="rectangular" height={20} sx={{ mb: 1 }} />
                        <Skeleton variant="rectangular" height={20} sx={{ mb: 1 }} />
                        <Skeleton variant="rectangular" height={20} sx={{ mb: 1 }} />
                        <Skeleton variant="rectangular" height={20} sx={{ mb: 1 }} />
                        <Skeleton variant="rectangular" height={20} sx={{ mb: 1 }} />
                        <Skeleton variant="rectangular" height={20} sx={{ mb: 1 }} />
                    </>
                )}
            </Container>

            <Toast opened={toastOpened} message={toastMessage} onClose={() => setToastOpened(false)} />
        </>
    );
}
