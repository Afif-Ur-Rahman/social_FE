import React, {useState} from 'react';
import SocialContext from './socialContext';

const SocialState = (props) => {
    const [user, setUser] = useState({
        name: "",
        token: "",
        id: ""
    })

  return (
    <SocialContext.Provider value={{user, setUser}}>
        {props.children}
    </SocialContext.Provider>
  )
}

export default SocialState;