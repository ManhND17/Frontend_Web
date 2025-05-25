import styled from "styled-components";
import { Image, Col, InputNumber } from "antd";

export const WrapperStyleImageSmall = styled(Image)`
  height: 64px;
  width: 64px;
`;
export const WrapperStyleColImage = styled(Col)`
  flex-basics: unset;
  display: flex;
`;
export const WrapperStyleNameProduct = styled.h1`
  color: rgb(36, 36, 36);
  font-size: 24px;
  font-weight: 300;
  font-height: 32px;
  padding-left: 10px;
`;
export const WrapperStyleText = styled.span`
  font-size: 15px;
  line-height: 24px;
  color: rgb(120, 120, 120);
  padding-left: 10px;
`;
export const WrapperStylePrice = styled.div`
  background: rgb(250, 250, 250);
  border-radius: 4px;
  padding-left: 10px;
`;
export const WrapperPriceText = styled.h1`
  font-size: 32px;
  line-height: 40px;
  margin-right: 8px;
  font-weight: 500;
  padding-left: 20px;
  margin-top: 10px;
`;
export const WrapperAdress = styled.div`
  span.address {
    text-decoration: underline;
    font-size: 15px;
    line-height: 24px;
    font-weight: 500;
    white-sapce: nowrap;
    overflow: hidden;
    text-overflow: ellopsisl;
  }
  span.change-address {
    color: rgb(11, 116, 229);
    font-size: 16px;
    line-height: 24px;
    font-weight: 500;
  }
`;

export const WrapperQualityProduct = styled.h1`
  display: flex;
  gap: 8px;
  align-items: center;
  width: 110px;
  border: 1px solid #ccc;
  border-radius: 0;
`;

export const WrapperInputNumber = styled(InputNumber)`
  &.ant-input-number {
    width: 60px ;
    border-top: none;
    border-bottom: none;
    border-radius: 0 !important;
    &.ant-input-number-handler-wrap{
       display: none !important;
    }
  };
`;
export const ProductDescription = styled.div`
  margin-top: 16px;
  font-size: 16px;
  color: #444;
  line-height: 1.6;
  white-space: pre-wrap; 
  padding: 16px;
  border-radius: 8px;
  background-color: #fafafa;
  border: 1px solid #e8e8e8;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
`;