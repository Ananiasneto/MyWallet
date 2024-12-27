import React from 'react';
import styled from 'styled-components';

function App() {
  return (
    <Body>
      <Titulo>My Wallet</Titulo>
      <Form>
        <input type="email" placeholder='Email' />
        <input type="password" placeholder='Senha' />
        <input type="submit"  />
      </Form>
      <Cadastro>Primeira vez? Cadastre-se!</Cadastro>
    </Body>
  );
}

export default App;

const Body = styled.div`
  background-color: #A328D6;
  height: 100vh;
  width: 100vw;
`;
const Cadastro = styled.a`
  text-decoration: none;

`;

const Titulo = styled.h1`
  font-size: 2rem;
  color: white;
  text-align: center;
  margin-top: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  margin-top: 50px;

  input {
    width: 80%;
    padding: 10px;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
  }
`;
