import type { NextPage } from 'next'

import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link'

import  React,{useState,useEffect} from 'react';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import AccountCircle from '@mui/icons-material/AccountCircle';
import FilledInput from '@mui/material/FilledInput';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import VpnKeyIcon from '@mui/icons-material/VpnKey';


import Button from '@mui/material/Button';

import HeadPage from './HeadPage'

import { useRouter } from 'next/router'

import axios ,{AxiosResponse}from 'axios';

import { setCookies } from 'cookies-next';

import { getCookie } from 'cookies-next';

import CircularProgress from '@mui/material/CircularProgress';





var qs = require('qs');

// axios.<method> will now provide autocomplete and parameter typings

interface State {
  amount: string;
  password: string;
  showPassword:boolean;
}

interface User {
  value01: string;
  value02: string;
}


const Index: NextPage = () => {

  const [values, setValues] = useState<State>({
    amount: '',
    password: '',
   
    showPassword: false,
  });

  const [touchNum,setTouchNum] = useState(0);//h1名稱點擊次數

  const router = useRouter()

  const [opacUrl,setOpacUrl] = useState('');

  const [loadShow,setLoadShow] = useState(false);

  

  const handleChange =
  (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value });



  };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const goToSetUrlPage = ()  => 
  {
  
    setTouchNum(touchNum + 1)

    if(touchNum > 5)
    {
      router.push('./setUrl')
    }
  }



  const postCheckId = () =>{
    setLoadShow(true);

    // var details = {
    //   'value01': 'kkk',
    //   'value02': '000',
    // }

    // let formBody = Object.keys(details).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(details[key])).join('&');


    //用post會有CORS請小郭後台調整
    // fetch( opacUrl + '/opacMPD.asmx/loginJSON', {
    //   method: "POST",
    //   headers: {'Content-Type': 'application/x-www-form-url-encoded', 'Accept': 'application/json'},
    //   //別忘了把主體参數轉成字串，否則資料會變成[object Object]，它無法被成功儲存在後台
    //   body: 'value01='+  values.amount + '&value02=' +  values.password
    // })
    // const postBody =  `value01=${values.amount}&value02=${ values.password}&value03=${'0'}&value04=${'15'}&value05=1`;
    // console.log('postBody',postBody)

    // fetch('http://220.130.59.159/webopac/OpacReeader.asmx/loginJSON', {
    //   method: "POST",
    //   headers: {'Content-Type': 'application/x-www-form-url-encoded', 'Accept': 'application/json'},
    //   //別忘了把主體参數轉成字串，否則資料會變成[object Object]，它無法被成功儲存在後台
    //   body: postBody
    // })
    // .then(response => console.log(response))
    // .catch(error => console.log(error))
    

    const user:User = {
      'value01': values.amount,
      'value02': values.password,
    }


    axios.get(opacUrl +'/opacMPD.asmx/loginJSON', {
      headers: { 'Content-Type': 'application/json' },
      params: user,
      timeout: 10000,

    })
    .then(function (response:AxiosResponse) {



      let userInfo = response.data;
      console.log(userInfo);
      userInfo = userInfo.substring(userInfo.indexOf('{'), userInfo.lastIndexOf(']'));

      const userInfoJson = JSON.parse(userInfo);
      console.log(userInfoJson);

         if(userInfoJson.result === '0' && userInfoJson.mpd === '1')
         {
        
          router.push('/lnventory/settings')
          setCookies('userInfo', userInfoJson);

         }
         else
         {
          alert(`${userInfoJson.msg}`)

         }

         setLoadShow(false);

    })
    .catch(function (error:any) {
      console.log(error.request.status);
      if(error.request.status === 404)
      {
        alert('伺服器發生錯誤！')
      }
      setLoadShow(false);

    });
  }

   // 相似於 componentDidMount 和 componentDidUpdate:
   useEffect(() => {

    const aaa:any = getCookie('opacUrl'); // => 'value'
    if(aaa != '')
    {
        setOpacUrl(aaa);
    }
    else
    {
        console.log('未設定OPAC Url')
    }

    
});

  return (
    <div className={styles.backgroundImage} >

        <HeadPage
        title={`歡迎使用盤點系統`}
        />

      <main className={styles.main}>
        <h1
        onClick={()=>goToSetUrlPage()}
        >
        

          歡迎使用盤點系統
         
        </h1>
        <h1 >
          請先登入
        </h1>

        

        <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
        <InputLabel htmlFor="input-with-icon-adornment">
          帳號
        </InputLabel>
        <Input
          id="input-with-icon-adornment"
          value={values.amount}
          onChange={handleChange('amount')}
          startAdornment={
            <InputAdornment position="start">
              <AccountCircle />
            </InputAdornment>
          }
        />
      </FormControl>

      <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
          <InputLabel htmlFor="standard-adornment-password">密碼</InputLabel>
          <Input
            id="standard-adornment-password"
            type={values.showPassword ? 'text' : 'password'}
            value={values.password}
            onChange={handleChange('password')}
            startAdornment={
              <InputAdornment position="start">
                <VpnKeyIcon />
              </InputAdornment>
            }
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {values.showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>

        <Button
        onClick={()=>values.amount ==='' || values.password === ''? alert('帳號密碼不能空白') :postCheckId()}
        sx={{ m: 1, width: '25ch' }}
        variant="contained">
             
              登入
   
          
          
          </Button>
          {!loadShow ?
null
    :
    
    <CircularProgress />

}


      </main>


    </div >
  )
}

export default Index
