import { createTheme } from '@mui/material/styles';

const radii = {
    card: 18,
    control: 10,
    small: 8,
};

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#416A50',
            light: '#E8F0E8',
            dark: '#2F513B',
            contrastText: '#FFFEFB',
        },
        secondary: {
            main: '#C96C4A',
            light: '#FCE8DD',
            dark: '#A94F33',
            contrastText: '#FFFEFB',
        },
        background: {
            default: '#F7F6F2',
            paper: '#FFFEFB',
        },
        text: {
            primary: '#1B1C1A',
            secondary: '#626660',
        },
        divider: '#E2E0D9',
        error: {
            main: '#C74836',
        },
    },
    shape: {
        borderRadius: 12,
        cardRadius: radii.card,
        controlRadius: radii.control,
        smallRadius: radii.small,
    },
    typography: {
        fontFamily: '"Segoe UI", "Helvetica Neue", Arial, sans-serif',
        h1: {
            color: '#1B1C1A',
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 'clamp(2.5rem, 5vw, 3.75rem)',
            fontWeight: 700,
            letterSpacing: '-0.045em',
            lineHeight: 1.08,
        },
        h2: {
            color: '#1B1C1A',
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontWeight: 700,
            letterSpacing: '-0.035em',
            lineHeight: 1.15,
        },
        h3: {
            color: '#1B1C1A',
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontWeight: 700,
            letterSpacing: '-0.025em',
            lineHeight: 1.2,
        },
        h4: {
            color: '#1B1C1A',
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            lineHeight: 1.25,
        },
        h5: {
            color: '#1B1C1A',
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontWeight: 700,
            letterSpacing: '-0.015em',
            lineHeight: 1.3,
        },
        h6: {
            color: '#1B1C1A',
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontWeight: 700,
            lineHeight: 1.35,
        },
        body1: {
            lineHeight: 1.6,
        },
        body2: {
            lineHeight: 1.5,
        },
        button: {
            fontWeight: 600,
            letterSpacing: '0.01em',
            textTransform: 'none',
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                html: {
                    minWidth: 320,
                },
                body: {
                    backgroundColor: '#F7F6F2',
                    color: '#1B1C1A',
                    minWidth: 320,
                },
                '#root': {
                    minHeight: '100vh',
                },
                '::selection': {
                    backgroundColor: '#D7E6D8',
                    color: '#2F513B',
                },
                '*:focus-visible': {
                    outline: '3px solid #8EB79A',
                    outlineOffset: 2,
                },
            },
        },
        MuiAppBar: {
            defaultProps: {
                elevation: 0,
            },
            styleOverrides: {
                root: {
                    backgroundColor: 'transparent',
                    backgroundImage: 'none',
                    borderBottom: '1px solid #E2E0D9',
                    color: '#1B1C1A',
                },
            },
        },
        MuiToolbar: {
            styleOverrides: {
                root: {
                    minHeight: 76,
                    '@media (max-width: 899px)': {
                        minHeight: 68,
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    borderColor: '#E2E0D9',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    border: '1px solid #E2E0D9',
                    borderRadius: radii.card,
                    boxShadow: '0 8px 24px rgba(42, 47, 42, 0.04)',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: radii.control,
                    minHeight: 42,
                    paddingInline: 18,
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: 'none',
                    },
                },
                sizeSmall: {
                    minHeight: 38,
                    paddingInline: 14,
                },
                contained: {
                    '&:hover': {
                        backgroundColor: '#2F513B',
                    },
                },
                outlined: {
                    backgroundColor: '#FFFEFB',
                    borderColor: '#9DB1A1',
                    '&:hover': {
                        backgroundColor: '#F0F5F0',
                        borderColor: '#416A50',
                    },
                },
                text: {
                    '&:hover': {
                        backgroundColor: '#EDF3ED',
                    },
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    borderRadius: radii.control,
                    '&:hover': {
                        backgroundColor: '#EDF3ED',
                    },
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: radii.control,
                    backgroundColor: '#FFFEFB',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#7F9D87',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#416A50',
                        borderWidth: 2,
                    },
                },
                notchedOutline: {
                    borderColor: '#D5D6D0',
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    border: '1px solid #E2E0D9',
                    borderRadius: radii.card,
                    boxShadow: '0 24px 64px rgba(34, 40, 35, 0.16)',
                },
            },
        },
        MuiDialogTitle: {
            styleOverrides: {
                root: {
                    padding: '24px 24px 12px',
                },
            },
        },
        MuiDialogContent: {
            styleOverrides: {
                root: {
                    padding: '12px 24px 24px',
                },
            },
        },
        MuiDialogActions: {
            styleOverrides: {
                root: {
                    gap: 8,
                    padding: '12px 24px 24px',
                },
            },
        },
        MuiAlert: {
            styleOverrides: {
                root: {
                    borderRadius: radii.control,
                },
            },
        },
        MuiMenu: {
            styleOverrides: {
                paper: {
                    border: '1px solid #E2E0D9',
                    borderRadius: radii.control,
                    boxShadow: '0 12px 30px rgba(34, 40, 35, 0.12)',
                },
            },
        },
        MuiLink: {
            styleOverrides: {
                root: {
                    color: '#416A50',
                    fontWeight: 600,
                },
            },
        },
    },
});

export default theme;
