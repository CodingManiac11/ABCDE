import React from 'react';
import { Alert, AlertTitle, Collapse, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const Message = ({
  severity = 'info',
  title,
  children,
  onClose,
  variant = 'filled',
  elevation = 6,
  sx = {},
  ...props
}) => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    setOpen(false);
    if (onClose) onClose();
  };

  // Set default styles based on severity
  const getSeverityStyles = () => {
    switch (severity) {
      case 'error':
        return {
          bgcolor: theme.palette.error.light,
          color: theme.palette.error.contrastText,
          '& .MuiAlert-icon': {
            color: theme.palette.error.main,
          },
        };
      case 'success':
        return {
          bgcolor: theme.palette.success.light,
          color: theme.palette.success.contrastText,
          '& .MuiAlert-icon': {
            color: theme.palette.success.main,
          },
        };
      case 'warning':
        return {
          bgcolor: theme.palette.warning.light,
          color: theme.palette.warning.contrastText,
          '& .MuiAlert-icon': {
            color: theme.palette.warning.main,
          },
        };
      case 'info':
      default:
        return {
          bgcolor: theme.palette.info.light,
          color: theme.palette.info.contrastText,
          '& .MuiAlert-icon': {
            color: theme.palette.info.main,
          },
        };
    }
  };

  return (
    <Collapse in={open}>
      <Alert
        severity={severity}
        variant={variant}
        elevation={elevation}
        onClose={onClose ? handleClose : null}
        sx={{
          mb: 2,
          borderRadius: 1,
          ...getSeverityStyles(),
          '& a': {
            color: 'inherit',
            textDecoration: 'underline',
            '&:hover': {
              textDecoration: 'none',
            },
          },
          ...sx,
        }}
        action={
          onClose && (
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={handleClose}
              sx={{
                opacity: 0.8,
                '&:hover': {
                  opacity: 1,
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          )
        }
        {...props}
      >
        {title && <AlertTitle>{title}</AlertTitle>}
        {children}
      </Alert>
    </Collapse>
  );
};

export default Message;
