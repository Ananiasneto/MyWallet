import React from 'react';
import styled from 'styled-components';

function Cadastro() {
  return (
    <Body>
      <Titulo>My Wallet</Titulo>
      <Form>
        <Input type="text" placeholder="Nome" />
        <Input type="email" placeholder="Email" />
        <Input type="password" placeholder="Senha" />
        <Input type="password" placeholder="Confirme sua senha" />
        <Button type="submit" value="Cadastrar" />
      </Form>
      <Voltar href="#">Já tem uma conta? Faça login!</Voltar>
    </Body>
  );
}

export default Cadastro;

const Body = styled.div`
  background-color: #A328D6;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Titulo = styled.h1`
  font-size: 2rem;
  color: white;
  text-align: center;
  margin-bottom: 30px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
`;

const Input = styled.input`
  width: 80%;
  max-width: 300px;
  padding: 10px;
  border: none;
  border-radius: 5px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border: 2px solid #ffffff;
    box-shadow: 0 0 5px rgba(255, 255, 255, 0.7);
  }
`;

const Button = styled.input`
  width: 80%;
  max-width: 300px;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #ffffff;
  color: #A328D6;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const Voltar = styled.a`
  margin-top: 20px;
  color: white;
  font-size: 0.9rem;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
