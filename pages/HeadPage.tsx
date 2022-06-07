import Head from 'next/head'

import LoginBtn from '../src/components/login-btn'



const HeadPage =  (props:{title:string}) =>  {



  return(
    <>
    <Head>
    <title>{props.title}</title>
    <meta name="description" content={props.title} />
    <link rel="icon" href="/static/images/favicon.ico" />
  </Head>

  <LoginBtn />

</>
  );
}

export default HeadPage

