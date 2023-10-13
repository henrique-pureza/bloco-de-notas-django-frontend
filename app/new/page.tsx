"use client";

import Header from "@/components/Header";
import {
    Container,
    TextField,
    Typography,
    Stack
} from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Toast from "@/components/Toast";

export default function New() {
    const [title, setTitle] = useState<string>("");
    const [note, setNote] = useState<string>("");
    const [titleIsValid, setTitleIsValid] = useState<boolean>(true);
    const [noteIsValid, setNoteIsValid] = useState<boolean>(true);
    const router = useRouter();

    const [ toastOpened, setToastOpened ] = useState<boolean>(false);
    const [ toastMessage, setToastMessage ] = useState<string>("");

    async function createNote() {
        if (title && note) {
            const res = await fetch("http://localhost:8000/api/notas", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    titulo: title,
                    nota: note
                })
            });

            if (res.status === 201) {
                router.push(`/show/?titulo=${title}&from=newPage`);
            } else {
                const err = await res.json();
                console.log(err);
                setToastOpened(true);
                setToastMessage(`Error: ${err.titulo || err.nota}`);
            }
        } else if (!title) {
            setTitleIsValid(false);
        } else if (!note) {
            setNoteIsValid(false);
        } else {
            setTitleIsValid(false);
            setNoteIsValid(false);
        }
    }

    return (
        <>
            <Header onCreate={() => createNote()} creating />

            <Container sx={{ mt: 3 }}>
                <Typography variant="h4" sx={{ mb: 3 }}>
                    Criar nota
                </Typography>

                <Stack spacing={2}>
                    <TextField
                        label="Título"
                        value={title}
                        onChange={(event) => {
                            setTitle(event.target.value);
                            if (!title) setTitleIsValid(true);
                        }}
                        placeholder="Dê um título para identificar sua nota (lembre-se que não pode escrever duas notas com o mesmo nome)"
                        error={!titleIsValid}
                        helperText={!titleIsValid && "Digite um título."}
                        required
                    />

                    <TextField
                        label="Nota"
                        value={note}
                        onChange={(event) => {
                            setNote(event.target.value);
                            if (!note) setTitleIsValid(true);
                        }}
                        placeholder="Escreva aqui seus lembretes, pensamentos ou outras coisas..."
                        rows={10}
                        error={!noteIsValid}
                        helperText={!noteIsValid && "A nota não pode ser vazia."}
                        multiline
                        required
                    />
                </Stack>
            </Container>

            <Toast opened={toastOpened} message={toastMessage} onClose={() => setToastOpened(false)} />
        </>
    );
}
