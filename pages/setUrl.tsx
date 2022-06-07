import type { NextPage } from 'next'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link'

import  React,{useEffect}from 'react';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';

import FormControl from '@mui/material/FormControl';



import Button from '@mui/material/Button';

import { setCookies } from 'cookies-next';

import { getCookie } from 'cookies-next';

import HeadPage from './HeadPage'

const SetUrl: NextPage = () => {

    const [opacUrl,setOpacUrl] = React.useState('');
    const [isGetUrl,setIsGetUrl] = React.useState('1');


    const handleChangeOpacUrl =
    (event: React.ChangeEvent<HTMLInputElement>) => {

        console.log(event.target.value);
        setOpacUrl(event.target.value);
    };

    const setCookieOpacUrl  = (opacUrl:string) =>{
        setCookies('opacUrl', opacUrl);
    }

        useEffect(() => {
            const aaa:any = getCookie('opacUrl'); // => 'value'
            console.log('isGetUrl',isGetUrl)
            setOpacUrl(aaa);
            setIsGetUrl('0')
        },[isGetUrl === "1"]);

  return (
    <div className={styles.backgroundImage} >


      <HeadPage
    title={`OPAC URL設定`}
      />

      <Link  href={'/'}>

<Button
sx={{ m: 1, }}
style={{marginTop:30}}

variant="contained">
返回
</Button>
</Link>

      <main className={styles.main}>
        <h1>
        OPAC URL設定
        </h1>
 
        

        <FormControl sx={{ m: 1, width: '90%' }} variant="standard">
        <InputLabel htmlFor="input-with-icon-adornment">
          opac url
        </InputLabel>
        <Input
        id='input-with-icon-adornment'
          onChange={handleChangeOpacUrl}
        value={opacUrl}
        />
      </FormControl>
    <p>例如：http://www.mi.com.tw/webopac</p>
     

        <Link href={'/'}>
        <Button 
                onClick={()=> setCookieOpacUrl(opacUrl)}

        sx={{ m: 1, width: '25ch' }}
        variant="contained"
        >
        
              確定
   
          
          
          </Button>
          </Link>

      </main>


    </div >
  )
}

export default SetUrl
