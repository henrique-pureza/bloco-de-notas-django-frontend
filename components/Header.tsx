"use client";

import {
    AppBar, Toolbar, IconButton,
    Typography, Button, Dialog,
    DialogTitle, DialogActions
} from "@mui/material";
import { ArrowBack, Add, Edit, Delete } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Toast from "./Toast";
import Link from "next/link";

export default function Header({
    home,
    showing,
    note,
    creating,
    onCreate,
    editing,
    onEdit
}: {
    home?: boolean;
    showing?: boolean;
    note?: string | null;
    creating?: boolean;
    editing?: boolean;
    onCreate?: () => void;
    onEdit?: () => void;
}) {
    const router = useRouter();
    const [ isDeleting, setIsDeleting ] = useState<boolean>(false);
    const [ toastOpened, setToastOpened ] = useState<boolean>(false);
    const [ toastMessage, setToastMessage ] = useState<string>("");

    async function deleteNote() {
        try {
            const res = await fetch(
                `http://localhost:8000/api/notas/${note}`,
                { method: "DELETE" }
            );

            if (res.status === 204) {
                router.push("/?from=showPage");
            }
        } catch (e) {
            console.error(e);
            setToastOpened(true);
            setToastMessage(String(e));
        }
    }

    return (
        <>
            <AppBar position="relative" color="primary">
                <Toolbar>
                    {(showing || creating || (editing && note)) && (
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={() => editing ? router.push(`/show?titulo=${note}`) : router.push("/")}
                            sx={{ mr: 2 }}
                        >
                            <ArrowBack />
                        </IconButton>
                    )}
                    <Link href="/" style={{ display: "flex", flexGrow: 1, color: "white", textDecoration: "none" }} passHref>
                        <Typography variant="h6">
                            Bloco de Notas
                        </Typography>
                    </Link>
                    {home && (
                        <IconButton color="inherit" onClick={() => router.push("/new")}>
                            <Add />
                        </IconButton>
                    )}
                    {showing && note && (
                        <>
                            <IconButton
                                color="inherit"
                                onClick={() => router.push(`/edit?titulo=${note}`)}
                                sx={{ mr: 2 }}
                            >
                                <Edit />
                            </IconButton>
                            <IconButton color="inherit" onClick={() => setIsDeleting(true)}>
                                <Delete />
                            </IconButton>
                        </>
                    )}
                    {creating && onCreate && (
                        <Button color="inherit" onClick={() => onCreate()}>
                            Criar
                        </Button>
                    )}
                    {editing && onEdit && (
                        <Button color="inherit" onClick={() => onEdit()}>
                            Editar
                        </Button>
                    )}
                </Toolbar>
            </AppBar>

            <Dialog open={isDeleting} onClose={() => setIsDeleting(false)}>
                <DialogTitle>
                    Tem certeza de que deseja deletar esta nota?
                </DialogTitle>
                <DialogActions>
                    <Button
                        color="primary"
                        onClick={() => setIsDeleting(false)}
                    >
                        Cancelar
                    </Button>
                    <Button color="error" onClick={() => deleteNote()}>
                        Deletar
                    </Button>
                </DialogActions>
            </Dialog>

            <Toast opened={toastOpened} message={toastMessage} onClose={() => setToastOpened(false)} />
        </>
    );
}
