"use client";

import Header from "./../components/Header";
import {
    Container, Grid, Card, CardContent,
    CardActions, Button, Typography, Alert, Skeleton
} from "@mui/material";
import Toast from "@/components/Toast";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function Index() {
    const [ notas, setNotas ] = useState<{ titulo: string; nota: string; }[]>([]);
    const [ isFetching, setIsFetching ] = useState<boolean>(true);
    const from = useSearchParams().get("from");
    const [ toastOpened, setToastOpened ] = useState<boolean>(false);

    useEffect(() => {
        async function fetchNotes() {
            try {
                const req = await fetch("http://localhost:8000/api/notas");
                const res: { titulo: string; nota: string; }[] = await req.json();

                setIsFetching(false);
                setNotas(res);

                if (from && from === "showPage") {
                    setToastOpened(true);
                }
            } catch (err) {
                console.error(err);
            }
        }

        fetchNotes();
    }, [from]);

    return (
        <>
            <Header home />

            <Container sx={{ mt: 3 }}>
                <Typography variant="h4" sx={{ mb: 4 }}>
                    Notas
                </Typography>

                <Grid
                    container
                    justifyContent="center"
                    alignItems="center"
                    spacing={2}
                >
                    {isFetching && (
                        <>
                            <Grid item xs={12} md={6} lg={6}>
                                <Skeleton variant="rectangular" height={150} />
                            </Grid>
                            <Grid item xs={12} md={6} lg={6}>
                                <Skeleton variant="rectangular" height={150} />
                            </Grid>
                            <Grid item xs={12} md={6} lg={6}>
                                <Skeleton variant="rectangular" height={150} />
                            </Grid>
                            <Grid item xs={12} md={6} lg={6}>
                                <Skeleton variant="rectangular" height={150} />
                            </Grid>
                        </>
                    )}

                    {notas.map((nota, index) => (
                        <Grid item xs={12} md={6} lg={6} key={index}>
                            <Card key={index}>
                                <CardContent>
                                    <Typography variant="h6">
                                        {nota.titulo}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            whiteSpace: "pre",
                                            overflow: "hidden",
                                            maxHeight: "100px"
                                        }}
                                    >
                                        {nota.nota}
                                    </Typography>
                                    [...]
                                </CardContent>
                                <CardActions
                                    sx={{
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}
                                >
                                    <Button href={`/show?titulo=${nota.titulo}`}>
                                        Abrir nota
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {!notas.length && !isFetching && (
                    <Alert severity="info">
                        Está tão vazio por aqui... Que tal criar uma nova nota?
                        Clique no botão <strong>+</strong> para
                        começar.
                    </Alert>
                )}
            </Container>

            <Toast opened={toastOpened} message="Nota deletada com sucesso" onClose={() => setToastOpened(false)} />
        </>
    );
}
