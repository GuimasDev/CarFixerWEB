import React from "react";
import './Servicos.css'
import home_servicos from "../../assets/images/home_servicos.jpg"
import { Card } from "react-bootstrap";
import search from "../../assets/icons/search.svg"
import tools from "../../assets/icons/tools.svg"
import basket from "../../assets/icons/basket.svg"

export const Servicos = props => {
    return (
        <section>
            <div class="section" id="servicos">
                <div id="frase">
                    <div>
                        <img src={home_servicos}></img>
                    </div>
                    <div id="paragrafo">
                        <h3>Muito mais que uma oficina!</h3>
                        <p>Tratamos sua moto como se fosse seu filho. Contamos com profissionais capacitados e com anos de experiência em manutenção de motos. Mexemos com todos os tipos e modelos, desde motos populares até as esportivas, sempre mantendo o zelo pelo cliente.</p>
                    </div>
                </div>

                <h3>Atendemos todas as suas necessidades!</h3>
                <div id="area-box">
                    <div class="box-servico">
                        <img src={tools} height="80" alt="" />
                        <h4>Manutenções</h4>
                        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Veniam iure ipsa veritatis vero quaerat aliquid vel corrupti, pariatur repellat hic laboriosam nostrum velit consequuntur incidunt dolor possimus voluptatibus sapiente odio.</p>
                    </div>
                    <div class="box-servico">
                        <img src={search} height="80" alt="" />
                        <h4>Revisões</h4>
                        <p>Como qualquer veículo, a moto também precisa de uma revisão para conferir o estado de suas peças, dos pneus, da carroceria, da bateria e de todos os acessórios, bem como para a troca de óleo, limpeza do filtro de ar e outros reparos.</p>
                    </div>
                    <div class="box-servico">
                        <img src={basket} height="80" alt="" />
                        <h4>Acessórios</h4>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum adipisci minima alias nemo fugiat quae earum, quas inventore quasi veniam. Repellat fuga animi accusantium eos totam ab exercitationem temporibus harum.</p>
                    </div>
                </div>
                {/* <div id="cards">
                    <h3>Atendemos todas as suas necessidades!</h3>
                    <div id="card">
                        <Card img={tools} title="Manutenções" text="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Veniam lure ipsa veritatis vero quaerat aliquid vel corrupti, pariatur repellat hic laboriosam nostrum velit consequuntur incidunt dolor possimus voluptatibus sapiente odio." />
                        <Card img={search} title="Revisões" text="Qualquer veículo precisa de uma revisão para conferir o estado de suas peças, dos pneus, da carroceria, da bateria e de todos os acessórios, bem como para a troca de óleo, limpeza do filtro de ar e outros reparos." />
                        <Card img={basket} title="Acessórios" text="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Veniam lure ipsa veritatis vero quaerat aliquid vel corrupti, pariatur repellat hic laboriosam nostrum velit consequuntur incidunt dolor possimus voluptatibus sapiente odio." />
                    </div>
                </div> */}
            </div>
        </section>
    )
}