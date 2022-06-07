import type { NextPage } from 'next'
import Image from 'next/image'
import styles from '../../styles/Settings.module.css'
import Link from 'next/link'

import React, { useEffect, useState, useReducer } from 'react';
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
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useRouter } from 'next/router'



import Button from '@mui/material/Button';



import { setCookies } from 'cookies-next';

import { getCookie } from 'cookies-next';
import HeadPage from '../HeadPage'

import { useSession, signIn, signOut } from "next-auth/react"

import axios from 'axios';

import { actionCreators, reducer, initialState } from '../../src/components/Loading'


interface State {
  batchNum: string;
  place: string;
  gallery: string;
  spNumber: string;
  classCode: string;
  acce04Start: string;
  acce04End: string;
  date: string;
}

let newDate = new Date();

const formatDate = (current_datetime: Date) => {
  let formatted_date: string = current_datetime.getFullYear() + "/" + (current_datetime.getMonth() + 1) + "/" + current_datetime.getDate();
  return formatted_date;
}


const Settings: NextPage = () => {


  const [state, dispatch] = useReducer(reducer, initialState)

  const router = useRouter()

  const [isSettings, setIsSettings] = React.useState('1');

  const [values, setValues] = React.useState<State | any>({
    batchNum: '',
    place: '',
    gallery: '',
    spNumber: '',
    classCode: '',
    acce04Start: '',
    acce04End: '',
    date: formatDate(newDate),
  });

  const [opacUrl, setOpacUrl] = React.useState('');
  const [placeArray, setPlaceArray] = useState([]);
  const [galleryArray, setGalleryArray] = useState([]);
  const [spNumberArray, setSpNumberArray] = useState([]);

  const [dateValue, setDateValue] = React.useState<Date | string | null>(
    new Date(),
  );

  const handleChangeDate = (newValue: Date | null | any) => {
    setDateValue(newValue);
    values.date = formatDate(newValue);

    console.log('values', values)
  };

  const handleChange =
    (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement> | any) => {
      console.log('prop', event.target.value)

      console.log('event.target.value', event.target.value)
      setValues({ ...values, [prop]: event.target.value });
    };


  const setCookie = (key: string, josnValues: State) => {
    setCookies(key, josnValues);

  }

  useEffect(() => {

    let userInfo: any = getCookie('userInfo'); // => 'value'


    if (userInfo === undefined) {
      router.push({
        pathname: '/',
      })
 
    }

  }, []);

  useEffect(() => {

    let aaa: any = getCookie('settings'); // => 'value'


    if (aaa != undefined) {

      let tempValues = JSON.parse(aaa);
      tempValues.date = formatDate(newDate);

      setTimeout(function () {
        setValues(tempValues);
      }, 500);
    
      
      setIsSettings('0')
      
    }

  }, [isSettings === "1"]);

  useEffect( () => {

    const aaa: any = getCookie('opacUrl'); // => 'value'
    if (aaa != '') {
      setOpacUrl(aaa);
    const bbb = getBindJSON(aaa);


    }
    else {
      alert('未設定OPAC Url')

      router.push({
        pathname: '/',
      })
    }


  },[placeArray === []]);


  // if (session) {
  //   return (
  //     <>
  //       Signed in as {} <br />
  //       <button onClick={() => signOut()}>Sign out</button>
  //     </>
  //   )
  // }
  // return (
  //   <>
  //     Not signed in <br />
  //     <button onClick={() => signIn()}>Sign in</button>
  //   </>
  // )

  //json分組

  function createTree(arr: any, keys: any) {


    function createObj(arr: any, arrORobj: any, keys: any, start: any) {
      for (let i = 0; i < arr.length; i++) {
        // 當不存在一個排序的key，返回[]
        if (start >= keys.length) {
          let newArray = Array.isArray(arrORobj) ? arrORobj : []
          return newArray.concat(arr[i])
        }
        let curKey = keys[start]
        let curVal = arr[i][curKey]
        if (!curVal) continue
        // 存在key對應的值存在，傳入{}構造
        let newObj = arrORobj[curVal] ? arrORobj[curVal] : {}
        arrORobj[curVal] = createObj([arr[i]], newObj, keys, start + 1)
      }
      // 存在一個排序的key，返回{}
      return arrORobj
    }
    return createObj(arr, {}, keys, 0)
  }



  //取雲端單位特藏號...等資料
  const getBindJSON = async (shcoolUrl: string) => {


   await axios.get(shcoolUrl + '/opacMPD.asmx/bindJSON')
      .then(function (response) {
        // handle success
        let userInfo = response.data;

        userInfo = userInfo.substring(userInfo.indexOf('['), userInfo.lastIndexOf('<'));
        // console.log(userInfo);

        const userInfoJson = JSON.parse(userInfo);
        // console.log(userInfoJson);

        const obj2 = createTree(userInfoJson, ["L"])
  
        // console.log('obj2',obj2)

        setPlaceArray(obj2[1])
        setGalleryArray(obj2[2])
        setSpNumberArray(obj2[3])

      })
      .catch(function (error) {
        // handle error
        console.log(error);

      })
      .then(function () {
        // always executed
      });
  }



// let  placeList:any = [];
// let  galleryList:any = [];
// let  spNumberList:any = [];
//   if(placeArray != undefined) 
//   {
//          placeList = placeArray.map((items: any, index:number) =>

//     <MenuItem key={index} value={items.b}>{items.a}</MenuItem>

//   )
//   }
//   if(galleryArray != undefined) 
//   {
//     galleryList = galleryArray.map((items: any, index:number) =>

//     <MenuItem key={index} value={items.b}>{items.a}</MenuItem>

//   )
//   }
//   if(spNumberArray != undefined) 
//   {
//     spNumberList = spNumberArray.map((items: any, index:number) =>

//     <MenuItem key={index} value={items.b}>{items.a}</MenuItem>

//   )
//   }




  return (
    <div className={styles.backgroundImage} >

      <HeadPage
        title={`盤點參數設定`}
      />

      <Link href={'/'}>

        <Button
          sx={{ m: 1, }}
          style={{ marginTop: 30 }}
          variant="contained">
          返回
        </Button>
      </Link>

      <main className={styles.main}>
        <h1>
          盤點參數設定
        </h1>


        <TextField
          sx={{ m: 1, width: '25ch' }}
          id="outlined-basic"
          label="盤點批號"
          variant="filled"
          value={values.batchNum}
          onChange={handleChange('batchNum')}

        />

        <LocalizationProvider dateAdapter={AdapterDateFns}>

          <MobileDatePicker

            label="盤點日期"
            inputFormat="yyyy/MM/dd"
            value={values.date}
            onChange={handleChangeDate}
            renderInput={(params) =>
              <TextField
                sx={{ m: 1, width: '25ch' }}
                variant="filled"
                {...params} />
            }
          />
        </LocalizationProvider>

        <FormControl
          sx={{ m: 1, width: '25ch' }}
          variant="filled"
        >
          <InputLabel id="demo-simple-select-label">*盤點地點(必填)</InputLabel>
          <Select
      defaultValue=''
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={values.place}
            label="盤點地點"

            onChange={handleChange('place')}
          >
             <MenuItem value={''}>無盤點地點</MenuItem>
             {placeArray.map((items: any, index:number) => (
          <MenuItem value={items.b} key={index}>
            {items.a}
          </MenuItem>
        ))}
          </Select>
        </FormControl>

        <FormControl
          sx={{ m: 1, width: '25ch' }}
          variant="filled"
        >
          <InputLabel id="demo-simple-select-label">*盤點館別(必填)</InputLabel>
          <Select
     defaultValue=''

            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={values.gallery}
            label="盤點館別"
            onChange={handleChange('gallery')}
          >
             <MenuItem value={''}>無盤點館別</MenuItem>
             {galleryArray.map((items: any, index:number) => (
          <MenuItem value={items.b} key={index}>
            {items.a}
          </MenuItem>
        ))}
          </Select>
        </FormControl>

        <FormControl
          sx={{ m: 1, width: '25ch' }}
          variant="filled"
        >
          <InputLabel id="demo-simple-select-label">特藏號</InputLabel>
          <Select
          defaultValue=''
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={values.spNumber}
            label="特藏號"
            onChange={handleChange('spNumber')}
          >
            <MenuItem value={''}>無特藏號</MenuItem>
            {spNumberArray.map((items: any, index:number) => (
          <MenuItem value={items.b} key={index}>
            {items.a}
          </MenuItem>
        ))}

          </Select>
        </FormControl>

        <React.Fragment>
          <TextField
            variant="filled"
            value={values.acce04Start}

            sx={{ m: 1, width: '25ch' }}
            label="分類號區間 起"
            onChange={handleChange('acce04Start')}

          />
          <Box sx={{ mx: 2 }}> to </Box>
          <TextField
            variant="filled"
            value={values.acce04End}

            label="分類號區間 迄"
            onChange={handleChange('acce04End')}

            sx={{ m: 1, width: '25ch' }}

          />
        </React.Fragment>

        <FormControl
          sx={{ m: 1, width: '25ch' }}
          variant="filled"
        >
          <InputLabel id="demo-simple-select-label">分類系統號代碼</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={values.classCode}
            label="分類系統號代碼"
            onChange={handleChange('classCode')}
          >
            <MenuItem value={''}>無分類系統號代碼</MenuItem>
            <MenuItem value="CCL">CCL:中文圖書分類法</MenuItem>
					<MenuItem value="DDC">DDC:杜威十進分類法</MenuItem>
					<MenuItem value="LCC">LCC:美國國會圖書館分類法</MenuItem>
					<MenuItem  value="NLM">NLM:美國國家醫學圖書館分類法</MenuItem>
					<MenuItem value="CLC">CLC:中國圖書館分類法</MenuItem>
					<MenuItem value="CCH">CCH:何日章,袁湧進中國圖書館十進分類法</MenuItem>
					<MenuItem value="CCS">CCS:中國圖書分類法(試用版)</MenuItem>
					<MenuItem value="CCT">CCT:杜定友杜氏圖書分類法</MenuItem>
					<MenuItem value="CCW">CCW:王雲五中外圖書統一分類法</MenuItem>
					<MenuItem value="HYC">HYC:裘開明漢和圖書分類法</MenuItem>
					<MenuItem value="SMC">SMC:沈寶環三民主義中心圖書分類法</MenuItem>
					<MenuItem value="UDC">UDC:國際十進分類法</MenuItem>
					<MenuItem value="BCS">BCS:佛教圖書分類法</MenuItem>

          </Select>
        </FormControl>

        <Button
          onClick={() => {
            values.place === '' || values.gallery === ''?
            alert('館藏地與館別不能空白')
            :
            router.push({
              pathname: '/lnventory/input',
              query: values,

            })
            setCookie('settings', values)
            
           
          }}
          sx={{ m: 1, width: '25ch' }}

          variant="contained">
          確定


        </Button>


      </main>


    </div >
  )
}

export default Settings


