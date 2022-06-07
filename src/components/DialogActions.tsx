import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import { access } from 'fs';

export default function AlertDialog(props:any) {
  const [open, setOpen] = React.useState(false);

  const {deleteItem,acce01,postDel}   = props

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        2222
      </Button> */}
          <Tooltip title="Delete" arrow>

      <IconButton color="error" aria-label="delete" onClick={handleClickOpen}>
  <DeleteIcon />
</IconButton>
</Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"確定訊息"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`確定移除(`+ acce01 + `)嗎？`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>取消</Button>
          <Button onClick={()=>{handleClose();deleteItem();postDel(acce01)}} autoFocus>
            確定
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
