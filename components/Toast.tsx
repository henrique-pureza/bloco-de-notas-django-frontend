"use client";

import { Snackbar, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";

export default function Toast({ opened, message, onClose }: { opened: boolean; message: string; onClose: () => void }) {
    return (
        <Snackbar
            open={opened}
            autoHideDuration={2000}
            onClose={() => onClose()}
            message={message}
            action={
                <IconButton
                    size="small"
                    color="inherit"
                    onClick={() => onClose()}
                >
                    <Close fontSize="small" />
                </IconButton>
            }
        />
    )
}
