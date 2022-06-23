import Head from 'next/head'




const HeadPage =  (props:{title:string}) =>  {



  return(
    <>
    <Head>
    <title>{props.title}</title>
    <meta name="description" content={props.title} />
    <link rel="icon" href="/static/images/favicon.ico" />
  </Head>

 

</>
  );
}

export default HeadPage

