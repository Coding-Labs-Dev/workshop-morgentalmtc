import React, { useState } from 'react';

import logo from '../assets/images/logo-vermelho.png';
import banner01 from '../assets/images/banner01.jpg';
import banner02 from '../assets/images/banner02.jpg';
import banner03 from '../assets/images/banner03.jpg';
import banner04 from '../assets/images/banner04.jpg';
import painel01 from '../assets/images/4x4-01.jpg';
import painel02 from '../assets/images/4x4-02.jpg';
import painel03 from '../assets/images/4x4-03.jpg';
import painel04 from '../assets/images/4x4-04.jpg';
import pauloAmerico from '../assets/images/paulo-americo.jpg';
import eleonoraComucci from '../assets/images/eleonora-comucci.jpg';
import ritaVetucci from '../assets/images/rita-vetucci.jpg';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

export default function Main(props) {
  const [email, setEmail] = useState('');
  const [submit, setSubmit] = useState(false);

  function handleAnchor(e) {
    e.preventDefault();
    const target = e.currentTarget.hash;
    window.scroll({
      top: document.querySelector(target).getBoundingClientRect().top + window.scrollY,
      left: 0,
      behavior: 'smooth',
    });
  }

  async function handleSubmit() {
    props.handleEmail(email);
    await window.fbq('track', 'CompleteRegistration');
    await fetch(`${process.env.REACT_APP_API}/subscribe`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    props.history.push('/inscricao');
  }

  function validateField(event) {
    const tglClass = event.type === 'blur' ? true : ['change', 'focus'].includes(event.type) ? false : true;
    const field = event.target || event;
    const { value } = field;
    setEmail(value);

    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const result = regex.test(value);

    if (!result) {
      if (tglClass) {
        field.classList.add('error');
      }
      setSubmit(false);
      return false;
    }
    if (tglClass) {
      field.classList.remove('error');
    }
    setSubmit(true);
    return true;
  }

  function SubmitButton() {
    return submit ? (
      <button type="submit" className="cta" onClick={handleSubmit}>
        <span>Quero aprender a prescrever fitoterápicos</span>
      </button>
    ) : (
      <button type="submit" className="cta" disabled={true}>
        <span>Quero aprender a prescrever fitoterápicos</span>
      </button>
    );
  }

  return (
    <>
      <section className="landing" id="landing">
        <div className="logo" style={{ backgroundImage: `url(${logo})` }}></div>
        <div className="full-bg">
          <div className="img" style={{ backgroundImage: `url(${banner01})` }}></div>
        </div>
        <div className="container">
          <header>
            <h1 className="light">Workshop</h1>
            <h1>Fórmulas Chinesas para Crianças</h1>
          </header>
          <h2 className="no-transform">Melhore o tratamento dos seus pacientes utilizando a fitoterapia</h2>
          <div className="cta-box background">
            <form>
              <div className="field-cta">
                <input
                  type="email"
                  name="email"
                  placeholder="Digite seu melhor e-mail"
                  onChange={e => validateField(e)}
                  onBlur={e => validateField(e)}
                />
              </div>
              <SubmitButton />
            </form>
          </div>
          <ul>
            <li className="arrow">
              <a href="#fitoterapia" onClick={handleAnchor}>
                <FontAwesomeIcon icon={faChevronDown} size="lg" />
              </a>
            </li>
          </ul>
        </div>
      </section>
      <section id="fitoterapia">
        <h2>A Fitoterapia</h2>
        <div className="container">
          <div className="double">
            <div className="column painel">
              <img src={painel01} alt="" />
              <img src={painel02} alt="" />
              <img src={painel03} alt="" />
              <img src={painel04} alt="" />
            </div>
            <div className="column">
              <p>
                Você sabe da importância da prescrição de um fitoterápico? Você sabe como prescrever um fitoterápico? E
                o que acontece quando a prescrição não é adequada? Se você não sabe responder a essas perguntas ou quer
                saber mais sobre a fitoterapia, este Workshop é para você!
              </p>
              <p>
                Na China, a fitoterapia é amplamente utilizada pois quase todo paciente em tratamento recebe uma fórmula
                fitoterápica, a qual torna-se essencial para restabelecer a saúde do paciente. Isto mostra o quão
                importante é a fitoterapia dentro da Medicina Tradicional Chinesa!
              </p>
              <p>
                Nos últimos trinta anos, dezenas de profissionais da MTC ansiavam e buscavam formas de utilizar as ervas
                e fórmulas chinesas com credibilidade e respeito. Hoje, no Brasil, todo profissional habilitado pode
                prescrever as fórmulas milenares chinesas. Seus resultados e benefícios estão sendo comprovados e o seu
                uso vem crescendo a cada dia mais.
              </p>
              <p>O segredo de um bom resultado é saber prescrever a melhor fórmula para o paciente.</p>
            </div>
          </div>
        </div>
      </section>
      <section id="workshop">
        <div className="full-bg">
          <div className="img" style={{ backgroundImage: `url(${banner02})` }}></div>
        </div>
        <h2>O Workshop</h2>
        <div className="container">
          <div className="double">
            <div className="column align-right">
              <p>
                Neste Workshop, o professor Paulo Américo Vieira vai apresentar algumas das principais fórmulas chinesas
                bem como a sua ação específica para as crianças.
              </p>
              <p>
                Serão 3 horas e meia de puro conteúdo para solidificar o seu conhecimento sobre a fitoterapia chinesa
                aplicada a crianças.
              </p>
              <h4 style={{ paddingBottom: '20px' }}>Você ainda receberá Certificado de Participação!</h4>
              <p>
                Com duas datas e localidades disponíveis, o Workshop será ministrado presencialmente em Goiânia (27/09)
                e Brasília (28/09), mas atenção: por ser um evento presencial, as vagas são limitadas!
              </p>
              <p>Não fique de fora, garanta logo a sua vaga!</p>
            </div>
            <div className="column">
              <div className="box">
                <h3>Datas e Horários</h3>
                <div className="event">
                  <h3>Goiânia</h3>
                  <span className="data">27/09</span>
                  <span className="horario">18h30 - 22h</span>
                </div>
                <div className="event">
                  <h3>Brasília</h3>
                  <span className="data">28/09</span>
                  <span className="horario">14h - 17h30</span>
                </div>
                <div className="cta-box">
                  <form>
                    <div className="field-cta">
                      <input
                        type="email"
                        name="email"
                        placeholder="Digite seu melhor e-mail"
                        onChange={e => validateField(e)}
                        onBlur={e => validateField(e)}
                      />
                    </div>
                    <SubmitButton />
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="depoimentos">
        <h2>Depoimentos</h2>
        <div className="container">
          <div className="double">
            <div className="column">
              <div className="box transparent">
                <div className="profile">
                  <div className="img" style={{ backgroundImage: `url(${eleonoraComucci})` }} />
                </div>
                <p className="depoimento">
                  O Curso é uma excelente oportunidade para quem gosta de estudar e está buscando flexibilidade. A
                  Fitoterapia está se tornando um recurso cada vez mais sólido e validado pela Ciência moderna, para o
                  tratamento de diversos distúrbios físicos e mentais. Com a expertise do Professor Paulo Américo Viera,
                  é muito fácil e agradável estudar esta Arte Milenar.
                </p>
                <p className="align-right">- Eleonora Comucci</p>
              </div>
            </div>
            <div className="column">
              <div className="box transparent">
                <div className="profile">
                  <div className="img" style={{ backgroundImage: `url(${ritaVetucci})` }} />
                </div>
                <p className="depoimento">
                  Excelente são os cursos de Paulo Américo, profundo conhecimento e sabedoria em lidar com fórmulas
                  chinesas e naturopaticos brasileiros, super recomendo, tanto para os apaixonados por ervas brasileiras
                  e fitoterápicos, bem como profissionais que buscam um aprendizado de confiança, aprofundamento e
                  indicações da Fitoterapia e naturopaticos brasileiros.
                </p>
                <p className="align-right">- Rita Vetucci</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="sobre">
        <div className="full-bg">
          <div className="img" style={{ backgroundImage: `url(${banner03})` }}></div>
        </div>
        <div className="container">
          <div className="profile">
            <div className="img" style={{ backgroundImage: `url(${pauloAmerico})` }}></div>
          </div>
          <h2 className="no-transform">Quem é Prof. Paulo Américo Vieira?</h2>
          <p>
            Com 30 anos de experiência em Fitoterapia Tradicional Chinesa, estudou com diversos mestres na China nas
            Universidades de Beijing e FuJien. É pioneiro na introdução da Fitoterapia Chinesa no Brasil e criador do
            Sistema de Tinturas Fitoterápicas Chinesas no Brasil. Lançou dois livros, FHC Fórmulas Herbais Chinesas e
            Saúde e Longevidade pela Fitoterapia Constitucional Chinesa, focados na prescrição uso de fitoterápicos.
            Criou o Projeto Vamos à China para intercambio de acupuntura, o qual já permitiu o aprimoramento de centenas
            de alunos e profissionais pela imersão em universidades e instituições da China. É também professor de
            diversas escolas de acupuntura.
          </p>
        </div>
      </section>
      <section id="investimento">
        <div className="full-bg">
          <div className="img" style={{ backgroundImage: `url(${banner04})` }} />
        </div>
        <div className="container">
          <div className="box">
            <h2>Investimento</h2>
            <div className="price">
              <span className="value">R$65,00</span>
              <span className="terms">por depósito bancário</span>
              <span className="terms">Taxa de R$5,00 para pagamento em cartão de crédito.</span>
            </div>
            <div className="info">
              <span className="detail">Participe em Brasília ou Goiânia</span>
              <span className="detail">Receba Certificado de Participação</span>
            </div>
            <div className="cta-box">
              <form>
                <div className="field-cta">
                  <input
                    type="email"
                    name="email"
                    placeholder="Digite seu melhor e-mail"
                    onChange={e => validateField(e)}
                    onBlur={e => validateField(e)}
                  />
                </div>
                <SubmitButton />
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
