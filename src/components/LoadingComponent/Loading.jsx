import React from 'react'
import { Spin } from 'antd'

export const Loading = ({children,isLoading,delay=200}) => {
  return (
    <Spin spinning={isLoading} delay={delay}>{children}</Spin>
  )
}
