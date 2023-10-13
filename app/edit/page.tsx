"use client";

import {
    Container,
    TextField,
    Typography,
    Stack,
} from "@mui/material";
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Toast from "@/components/Toast";

export default function Edit() {
    const title = useSearchParams().get("titulo");
    const [newTitle, setNewTitle] = useState<string>("");
    const [newNote, setNewNote] = useState<string>("");
    const [titleIsValid, setTitleIsValid] = useState<boolean>(true);
    const [noteIsValid, setNoteIsValid] = useState<boolean>(true);
    const router = useRouter();

    const [ toastOpened, setToastOpened ] = useState<boolean>(false);
    const [ toastMessage, setToastMessage ] = useState<string>("");

    useEffect(() => {
        async function getNote() {
            try {
                const req = await fetch(
                    `http://localhost:8000/api/notas/${title}`
                );
                const res = await req.json();

                setNewTitle(res.titulo);
                setNewNote(res.nota);
            } catch (e) {
                console.error(e);
                setToastOpened(true);
                setToastMessage(String(e));
            }
        }

        getNote();
    }, [title]);

    async function editNote() {
        if (newTitle && newNote) {
            const res = await fetch(
                `http://localhost:8000/api/notas/${title}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        titulo: newTitle,
                        nota: newNote
                    })
                }
            );

            if (res.status === 200) {
                router.push(`/show?titulo=${newTitle}&from=editPage`);
            } else {
                const err = await res.json();
                setToastOpened(true);
                setToastMessage(`Error: ${err.titulo || err.nota}`);
            }
        } else if (!newTitle) {
            setTitleIsValid(false);
        } else if (!newNote) {
            setNoteIsValid(false);
        } else {
            setTitleIsValid(false);
            setNoteIsValid(false);
        }
    }

    return (
        <>
            <Header editing onEdit={() => editNote()} note={title} />

            <Container sx={{ mt: 3 }}>
                <Typography variant="h4" sx={{ mb: 3 }}>
                    Editar &quot;{title}&quot;
                </Typography>

                <Stack spacing={2}>
                    <TextField
                        label="Título"
                        placeholder="Dê um título para identificar sua nota (lembre-se que não pode escrever duas notas com o mesmo nome)"
                        value={newTitle}
                        onChange={(event) => {
                            setNewTitle(event.target.value);
                            if (!newTitle) setTitleIsValid(true);
                        }}
                        error={!titleIsValid}
                        helperText={!titleIsValid && "Digite um título."}
                        required
                    />
                    <TextField
                        label="Nota"
                        rows={10}
                        value={newNote}
                        onChange={(event) => {
                            setNewNote(event.target.value);
                            if (!newNote) setNoteIsValid(true);
                        }}
                        error={!noteIsValid}
                        helperText={!noteIsValid && "A nota não pode ser vazia."}
                        placeholder="Escreva aqui seus lembretes, pensamentos ou outras coisas..."
                        multiline
                        required
                    />
                </Stack>
            </Container>

            <Toast opened={toastOpened} message={toastMessage} onClose={() => setToastOpened(false)} />
        </>
    );
}
