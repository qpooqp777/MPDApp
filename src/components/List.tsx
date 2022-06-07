import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';

import Divider from '@mui/material/Divider';
import { Button } from '@mui/material';

import ClearIcon from '@mui/icons-material/Clear';
import brown from '@mui/material/colors';

import DialogActions from './DialogActions';

import Tooltip from '@mui/material/Tooltip';

import Paper from '@mui/material/Paper';

import axios  from 'axios';


const Demo = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
}));

export default function InteractiveList(props:any) {

    const listData =  props.data;

    const  deleteData = props.deleteData;

    const isDelete = props.isDelete;

    const opacUrl = props.opacUrl;

    const listItems = listData.map((items: { id: string, acce01: string, title: string, loacal: string ,isRed:string}, index: number) => {



        const {id,acce01,title,loacal,isRed} = items; //結構取出

        function deleteItem() {
            deleteData(function(prev:any){

                return   prev.filter((items:any) => items.id !== id)
            })
  
        }

        function postDel (acce01:string) {
    axios.get(opacUrl + '/opacMPD.asmx/stockdelJSON', {
        params: {
            value01: acce01,
        }})
  .then(function (response) {
    // handle success
    console.log(response);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .then(function () {
    // always executed
  });
        }

        return(
            <div
            key={id}
           
        >
             <Paper elevation={10} >

            <ListItem
        

            style={{background:'#fff3e0'}}
                secondaryAction={ isDelete=== '1'?

                
                        <DialogActions
                        postDel={postDel}
                        deleteItem={deleteItem}
                        acce01={acce01}
                        />
                    :
                    null
                        
                       
                }
            >
    
                <ListItemText
                    style={{color:isRed === '1'?'red':''}}
                    primary={acce01 + ',' + title} 
                    secondary={loacal }
                   
                />
            </ListItem>
            </Paper>
            <Divider />
    
        </div>
    


    )});
    


   

    return (
        <Box>


            <Demo
            >



                {listItems}



            </Demo>

        </Box>
    );
}
