import React from 'react'
import { Image } from 'antd';
import { WrapperSliderStyle } from './style';

const SliderComponent = ({arrImages}) => {
  const settings ={
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1000
  };
  return (
    <WrapperSliderStyle settings={settings}>
      {arrImages.map((image)=>{
        return (
          <Image key={image} src={image} alt="slider" preview={false} width="100%"  />
        )
      })}
    </WrapperSliderStyle>
  )
}

export default SliderComponent
