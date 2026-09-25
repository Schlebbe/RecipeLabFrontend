import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

function DeleteConfirmationDialog({
    actionLabel = 'Delete',
    actionPendingLabel = 'Deleting...',
    children,
    errorMessage,
    isDeleting,
    onClose,
    onConfirm,
    open,
    title,
}) {
    return (
        <Dialog
            fullWidth
            maxWidth="sm"
            onClose={onClose}
            open={open}
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{children}</DialogContentText>

                {errorMessage && <Alert severity="error" sx={{ mt: 2 }}>{errorMessage}</Alert>}
            </DialogContent>
            <DialogActions>
                <Button disabled={isDeleting} onClick={onClose}>
                    Cancel
                </Button>
                <Button
                    color="error"
                    disabled={isDeleting}
                    onClick={onConfirm}
                >
                    {isDeleting ? actionPendingLabel : actionLabel}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default DeleteConfirmationDialog;
