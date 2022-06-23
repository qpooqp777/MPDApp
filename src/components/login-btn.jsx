import { useSession, signIn, signOut } from "next-auth/react"
import { getSession } from "next-auth/react"

import react,{useEffect} from 'react'

export default  function Component() {
  const { data: session, status } = useSession()
  const getsession =  getSession()

  useEffect(() => {
    console.log('session',session);
   
}, [session]); //Add session state to the useEffect




  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }


  return (
    <>
      Not signed in <br />
      {`status=${status}`}<br />
      {`session=${session}`} <br />
   {'getsession='+getsession}
      <button onClick={() => signIn()}>Sign in</button>

      <button onClick={() => signOut()}>Sign out</button>
    </>
  )
}