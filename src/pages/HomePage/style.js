import styled from "styled-components";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";

export const WrapperTypeProduct = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  color: ;
  justify-content: flex-start;
  height: 44px;
`;
export const WrapperButtonMore = styled(ButtonComponent)`
  & :hover {
    color: #fff;
    background: rgb(13, 92, 182);
    span {
      color: #fff;
    }
  }
`;

export const WrapperProducts = styled.div`
  margin-top: 20px;
  display: flex;
  alignItems: center;
  gap: 20px;
  flex-wrap: wrap; 
`;
