import styled, { css } from "styled-components"

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success'

interface ButtonContainerProps {
  variant: ButtonVariant
}

const buttonVariants = {
  primary: 'purple',
  secondary: 'orange',
  danger: 'red',
  success: 'green'
}

export const ButtonContainer = styled.button<ButtonContainerProps>`
  width: 100px;
  height: 40px;

  background-color: ${props => props.theme};
  color: ${props => props.theme.white};
  
  border-radius: 4px;
  margin: 8px;
  border: 0;

  /* Definindo a cor do botão */
  /* ${props => {
    return css`
      background-color: ${buttonVariants[props.variant]}
    `
  }} */
`