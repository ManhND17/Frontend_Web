import React from 'react'
import { useNavigate } from 'react-router-dom'

const TypeProduct = ({name}) => {
  const navigate = useNavigate()
  const handleNavigateType = (type) =>{
    navigate(`/product/${type}`,{state: type})
  }
  return (
    <div style={{padding: '0 10px' ,cursor:'pointer'}} onClick={()=>handleNavigateType(name)}>{name}</div>
  )
}

export default TypeProduct