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
import { Tune } from '@mui/icons-material';


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
      alert('?????????OPAC Url')

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

  //json??????

  function createTree(arr: any, keys: any) {


    function createObj(arr: any, arrORobj: any, keys: any, start: any) {
      for (let i = 0; i < arr.length; i++) {
        // ???????????????????????????key?????????[]
        if (start >= keys.length) {
          let newArray = Array.isArray(arrORobj) ? arrORobj : []
          return newArray.concat(arr[i])
        }
        let curKey = keys[start]
        let curVal = arr[i][curKey]
        if (!curVal) continue
        // ??????key???????????????????????????{}??????
        let newObj = arrORobj[curVal] ? arrORobj[curVal] : {}
        arrORobj[curVal] = createObj([arr[i]], newObj, keys, start + 1)
      }
      // ?????????????????????key?????????{}
      return arrORobj
    }
    return createObj(arr, {}, keys, 0)
  }



  //????????????????????????...?????????
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
        title={`??????????????????`}
      />

      <Link href={'/'}>

        <Button
          sx={{ m: 1, }}
          style={{ marginTop: 30 }}
          variant="contained">
          ??????
        </Button>
      </Link>

      <main className={styles.main}>
        <h1>
          ??????????????????
        </h1>


        <TextField
          sx={{ m: 1, width: '25ch' }}
          id="outlined-basic"
          label="????????????"
          variant="filled"
          value={values.batchNum}
          onChange={handleChange('batchNum')}

        />

        <LocalizationProvider dateAdapter={AdapterDateFns}>

          <MobileDatePicker

            label="????????????"
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
          <InputLabel
                    error={values.place != ''?false:true}

          id="demo-simple-select-label">*????????????(??????)</InputLabel>
          <Select
      defaultValue=''
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={values.place}
            label="????????????"

            onChange={handleChange('place')}
          >
             <MenuItem value={''}>???????????????</MenuItem>
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
          <InputLabel 
          error={values.gallery != ''?false:true}
          id="demo-simple-select-label">*????????????(??????)</InputLabel>
          <Select
     defaultValue=''

            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={values.gallery}
            label="????????????"
            onChange={handleChange('gallery')}
          >
             <MenuItem value={''}>???????????????</MenuItem>
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
          <InputLabel id="demo-simple-select-label">?????????</InputLabel>
          <Select
          defaultValue=''
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={values.spNumber}
            label="?????????"
            onChange={handleChange('spNumber')}
          >
            <MenuItem value={''}>????????????</MenuItem>
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
            label="??????????????? ???"
            onChange={handleChange('acce04Start')}

          />
          <Box sx={{ mx: 2 }}> to </Box>
          <TextField
            variant="filled"
            value={values.acce04End}

            label="??????????????? ???"
            onChange={handleChange('acce04End')}

            sx={{ m: 1, width: '25ch' }}

          />
        </React.Fragment>

        <FormControl
          sx={{ m: 1, width: '25ch' }}
          variant="filled"
        >
          <InputLabel id="demo-simple-select-label">?????????????????????</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={values.classCode}
            label="?????????????????????"
            onChange={handleChange('classCode')}
          >
            <MenuItem value={''}>????????????????????????</MenuItem>
            <MenuItem value="CCL">CCL:?????????????????????</MenuItem>
					<MenuItem value="DDC">DDC:?????????????????????</MenuItem>
					<MenuItem value="LCC">LCC:??????????????????????????????</MenuItem>
					<MenuItem  value="NLM">NLM:????????????????????????????????????</MenuItem>
					<MenuItem value="CLC">CLC:????????????????????????</MenuItem>
					<MenuItem value="CCH">CCH:?????????,???????????????????????????????????????</MenuItem>
					<MenuItem value="CCS">CCS:?????????????????????(?????????)</MenuItem>
					<MenuItem value="CCT">CCT:??????????????????????????????</MenuItem>
					<MenuItem value="CCW">CCW:????????????????????????????????????</MenuItem>
					<MenuItem value="HYC">HYC:??????????????????????????????</MenuItem>
					<MenuItem value="SMC">SMC:??????????????????????????????????????????</MenuItem>
					<MenuItem value="UDC">UDC:?????????????????????</MenuItem>
					<MenuItem value="BCS">BCS:?????????????????????</MenuItem>

          </Select>
        </FormControl>

        <Button
          onClick={() => {
            values.place === '' || values.gallery === ''?
            alert('??????????????????????????????')
            :
            router.push({
              pathname: '/lnventory/input',
              query: values,

            })
            setCookie('settings', values)
            
           
          }}
          sx={{ m: 1, width: '25ch' }}

          variant="contained">
          ??????


        </Button>


      </main>


    </div >
  )
}

export default Settings


