import React from 'react';
import { Redirect } from 'react-router-dom';
import banner from '../assets/images/banner01.jpg';
import logo from '../assets/images/logo-vermelho.png';

export default function Finished(props) {
  return (
    <>
      {!props.status && <Redirect to="/" />}
      <section className="landing" id="finished">
        <div className="logo" style={{ backgroundImage: `url(${logo})` }}></div>
        <div className="full-bg">
          <div className="img" style={{ backgroundImage: `url(${banner})` }}></div>
        </div>
        <div className="container">
          <h1>Obrigado!</h1>
          <h1 className="no-transform">A sua inscrição foi realizada com sucesso!</h1>
          {props.status === 3 && (
            <>
              <h2 className="no-transform">Você receberá um e-mail com mais informações.</h2>
              <h2 className="no-transform">Nos vemos em breve!</h2>
            </>
          )}
          {props.status === 'debt' && (
            <>
              <h2 className="no-transform">
                Lembre-se de enviar o comprovante de depósito/transferência para confirmar a sua inscrição.
              </h2>
              <div className="box">
                <h3>Dados Bancários</h3>
                <ul>
                  <li>Banco Bradesco (237)</li>
                  <li>Agência 1840</li>
                  <li>Conta Poupança 7.290.100-2</li>
                  <li>Titularidade: Douglas Morgental</li>
                  <li>CPF: 801.827.631-53</li>
                </ul>
                <h4>Enviar comprovante para:</h4>
                <ul>
                  <li>morgentalmmtc@gmail.com</li>
                </ul>
              </div>
            </>
          )}
          {(props.status === 1 || props.status === 2) && (
            <>
              <h2 className="no-transform">
                O seu pagamento encontra-se em análise. Quando concluído, você receberá um e-mail com mais informações.
              </h2>
            </>
          )}
        </div>
      </section>
    </>
  );
}
