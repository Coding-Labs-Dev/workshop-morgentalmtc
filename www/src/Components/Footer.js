import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faFacebookSquare, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { faGlobe, faPhone } from '@fortawesome/free-solid-svg-icons';

export default function Footer() {
  return (
    <>
      <footer>
        <div className="container">
          <ul>
            <li>
              <a href="https://wa.me/send?phone=+5562984232044">
                <FontAwesomeIcon icon={faWhatsapp} size="lg" />
              </a>
            </li>
            <li>
              <a href="mailto:contato@morgentalmtc.com.br">
                <FontAwesomeIcon icon={faEnvelope} size="lg" />
              </a>
            </li>
            <li>
              <a href="tel:+5562984232044">
                <FontAwesomeIcon icon={faPhone} size="lg" />
              </a>
            </li>
            <li>
              <a href="https://instagram.com/morgentalmtc">
                <FontAwesomeIcon icon={faInstagram} size="lg" />
              </a>
            </li>
            <li>
              <a href="https://facebook.com/morgentalmtc">
                <FontAwesomeIcon icon={faFacebookSquare} size="lg" />
              </a>
            </li>
            <li>
              <a href="http://morgentalmtc.com.br">
                <FontAwesomeIcon icon={faGlobe} size="lg" />
              </a>
            </li>
          </ul>
          <span>2019 - Morgental Medicina Tradicional Chinesa</span>
          <span>Clínica Essence, Rua 135, n. 579 - Goiânia, GO</span>
        </div>
      </footer>
    </>
  );
}
