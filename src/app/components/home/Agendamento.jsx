import React from 'react';
import "./Agendamento.css";

export const Agendamento = () => {
  return (<div id="fundo-agendamento">
    <section id="agendamento">
      <h3 data-aos="fade-right">Faça agora mesmo um agendamento na filial mais próxima de você</h3>
      <p data-aos="fade-right">Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo quisquam voluptatibus sapiente accusantium hic? Eveniet consequuntur alias est deleniti, magnam repudiandae libero ipsam asperiores maxime aliquid delectus adipisci temporibus commodi.</p>
      <div id="botoes-agend" data-aos="fade-left">
        {/* <button onclick="location.href='areacliente.php';">Alterar agendamento existente</button> */}
        <button onclick="location.href='/agendar';">Agendar</button>
      </div>
      <span></span>
    </section>
  </div>)
}