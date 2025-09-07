import React, { useState } from 'react'

const useFormHook = () => {
    const [formdata, setFormdata] = useState(null);
    const [formOn, setFormOn] = useState(false);


  return {
    formdata, formOn, setFormOn, setFormdata
  }
}

export default useFormHook