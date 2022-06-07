import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import styles from '../../styles/Input.module.css'

import React, { useRef, useState, useEffect } from 'react';

import TextField from '@mui/material/TextField';

import Button from '@mui/material/Button';

import Accordion from '../../src/components/Accordion';

import LnvBookList from '../../src/components/List';

import Input from '@mui/material/Input';
import { FormControl, InputLabel, FormHelperText } from '@mui/material';

import { v4 as uuidv4 } from 'uuid';

import CircularProgress from '@mui/material/CircularProgress';


import { useRouter } from 'next/router'
import HeadPage from '../HeadPage'
import { NineteenMpTwoTone, Tune } from '@mui/icons-material';

import axios from 'axios'

import { getCookie } from 'cookies-next';

interface State {
    place: string;
    gallery: string;
    spNumber:string;
    classCode:string;
    acce04Start:string;
    acce04End:string;
    date:Date;
  }

  interface InputBox {
    id: string;
    acce01: string;
    title:string;
    loacal:string;
    isRed:boolean;

  }

const Settings: NextPage = () => {

    const router = useRouter()


    const [values, setValues] = React.useState<State>({
        place: '',
        gallery: '',
        spNumber: '',
        classCode: '',
        acce04Start:'',
        acce04End:'',
        date:new Date(),

    });

    const [loadShow,setLoadShow] = useState(false);

    const [data, setData] = useState<any>([])

    const [hiddenInfo,setHiddenInfo] = useState(false);

    const [textFocus, setTextFocus] = useState(true);

    const [acce01, setAeec01] = useState('');

    const [opacUrl,setOpacUrl] = useState('');
    const [userInfo,setUserInfo] = useState<any>([]);


    const [dateValue, setDateValue] = useState<Date | null>(
        new Date(),
    );


    const handleChangeDate = (newValue: Date | null) => {
        setDateValue(newValue);
    };


    const handleChange =
        (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
            setValues({ ...values, [prop]: event.target.value });
        };

    const handleChangeAcce01 =
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setAeec01(event.target.value);
        };



    const IpuntAeec01 = (acce01: string,bouser08:string) => {

        setLoadShow(true);

        const myElement = document.getElementById('myText')!;

        if (acce01 === '') {
            alert('條碼輸入欄不能空白')
             myElement.focus();
             setLoadShow(false);

            return null;
        }
        else {

            getStockJSON(acce01,bouser08);
            // let array:any = data;
            // let jsondata:InputBox = {id:uuidv4(), acce01: acce01, title: '11112', loacal: '圖書館/館別' }

            // array.unshift(jsondata)

            // setData(array)
            // playAudio(); //播放音效
            // setAeec01('')
            // myElement.focus();

            // setLoadShow(false);

                        myElement.focus();

        }

    }

    const playAudio =(stock06:string) =>
    {
        const audio = document.createElement("audio");

        if(stock06 === '0')
        {
            audio.src = "/static/audio/9450.mp3";

        }
        else
        {
            audio.src = "/static/audio/error.mp3";

        }
        audio.play();

    }

    

    const getStockJSON = (acce01:string,bouser08:string) =>{

         for(const key in data){
            // console.log(key,data[key])
            if(data[key].acce01 === acce01)
            {
                alert('已經在目前盤點清單')
                setLoadShow(false);
                setAeec01('')
        
                return null;
            }
            
         }

        let dateStr:any= router.query.date;
        // console.log('dateStr',dateStr)
        dateStr = dateStr.replace(/\//g,'-')
        // console.log('dateStr2',dateStr)



        axios.get(opacUrl + '/opacMPD.asmx/stockJSON', {
            params: {
                value01: acce01,
              value02: router.query.classCode, //分類代碼
              value03: router.query.spNumber, //特藏號
              value04: router.query.acce04Start, //分號起
              value05: router.query.acce04End, //分號 氣
              value06: router.query.place, //中文書庫
              value07: router.query.gallery, //館別
              value08: router.query.batchNum, //批號

            // value02: '', //分類代碼
            // value03: '', //特藏號
            // value04: '', //分號起
            // value05: '', //分號 氣
            // value06: '', //中文書庫
            // value07: '', //館別
            // value08: '', //批號
              value09: dateStr, //盤點日期
              value10: bouser08, //盤點人
              value11: '',

            }
          })
          .then(function (response) {
            let userInfo = response.data;
            
      userInfo = userInfo.substring(userInfo.indexOf('{'), userInfo.lastIndexOf(']'));

      const userInfoJson = JSON.parse(userInfo);
      if(userInfoJson.result === '0')
      {
             
            let array:any = data;
            let jsondata:InputBox = {
                id:uuidv4(), acce01: acce01,
                 title: userInfoJson.cata12, 
                 loacal: `${userInfoJson.acce06}/${userInfoJson.acce44}`,
                 isRed:userInfoJson.stock06
                 }

            array.unshift(jsondata)

            setData(array)

            playAudio(userInfoJson.stock06); //播放音效
            setAeec01('')
            setLoadShow(false);
      }
      else
      {
        // alert(` ${userInfoJson.msg}`)
        setLoadShow(false);
        setAeec01('')


      }
    })
          .catch(function (error) {
            console.log(error);
          })
    }





    // 相似於 componentDidMount 和 componentDidUpdate:
    useEffect(() => {

      
   

        const aaa:any = getCookie('opacUrl'); // => 'value'

        let userInfo:any = getCookie('userInfo'); // => 'value'

        if (userInfo === undefined) {
            router.push({
              pathname: '/',
            })
                return;
          }

        userInfo = JSON.parse(userInfo);

        if (userInfo.mpdadd === '1')
        {
         const myElement = document.getElementById('myText')!;
         
         myElement.focus();
        }

        if(aaa != '')
        {
            setOpacUrl(aaa);
            setUserInfo(userInfo);
        }
        else
        {
            alert('未設定OPAC Url')
            router.push({
                pathname: '/',
              })
        }

        
    },[]);


    const settingInfo = 
    <>
                    <h1>
                    開始線上盤點
                </h1>

                <p>盤點批號：{router.query.batchNum}  盤點日期：{router.query.date}
                <br/>
                盤點地點：{router.query.place}     盤點館別：{router.query.gallery} 
                <br/>
                特藏號： {router.query.spNumber}    分號號區間：{router.query.acce04Start}- {router.query.acce04End}
                <br/>
                類系統代碼：{router.query.classCode} 
                </p>
                <Button 
                onClick={()=>
                    {
                        
                        setHiddenInfo(true)

                    }
                
                }
                variant="contained"
                
                >隱藏↑</Button>
    </>


    return (
        <div className={styles.backgroundImage} >
   
            <HeadPage
            title={`開始線上盤點`}
            />
            <Link href={'/lnventory/settings'}>

                <Button
                    sx={{ m: 1, }}
                    style={{marginTop:30}}

                    variant="contained">
                    返回
                </Button>
            </Link>
            {hiddenInfo?
            <Button 
            style={{float:'right',marginRight:10,marginTop:30}}
                      onClick={()=>setHiddenInfo(false)}
                      variant="contained"
                      
                      >顯示↓</Button>
                :
                null
            }

            <main className={styles.main}>
                {hiddenInfo?
                null
                :
                settingInfo
                }
           

                {/* <p>盤點地點：圖書館    盤點館別：總館</p>
        <p>特藏號：    分號號區間：</p>
        <p>分類系統代碼：    </p> */}

    
                <TextField
                disabled={userInfo.mpdadd === '1'?false:true}
                    onKeyPress={(e) => {
                        if (e.key === "Enter") {
                            IpuntAeec01(acce01,userInfo.bouser08),
                                () => {

                                }
                        }
                    }}
                    id='myText'
                    autoFocus={textFocus}
                    sx={{ m: 1, width: '80%' }}
                    value={acce01}
                    onChange={handleChangeAcce01}
                    label={userInfo.mpdadd === '1'?'條碼號':'無盤點新增權限'}

                    variant="outlined" />

                <Button
                                disabled={userInfo.mpdadd === '1'?false:true}

                    type="submit"
                    sx={{ m: 1, width: '80%' }}
                    onClick={() => IpuntAeec01(acce01,userInfo.bouser08)}
                    variant="contained">確定</Button>
                  
                
{!loadShow ?
null
    :
    
    <CircularProgress />

}


            </main>
            <LnvBookList
                data={data}
                deleteData={setData}
                isDelete={userInfo.mpddel}
                opacUrl={opacUrl}
            />


        </div >
    )
}

export default Settings
