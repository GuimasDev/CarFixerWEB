import { IHorario } from "../../services/api/horario/HorarioService";
import { AgendaBox } from "./AgendaBox";
import "./Coluna.css";
import { ColunaTitle } from "./ColunaTitle";
export const Coluna = (props: any) => {
	const title = props.title;
	const dateString = props.dateString;
	const tipo: "horario" | "sideTitle" = props.tipo;
	const horarios: Horario[] = props.horarios;
	const sideTitle: string[] = props.sideTitle;

	const hr_inicio = Number(sideTitle[0].split(":")[0]);
	const hrPorAgenda = 1;                   // precisa pegar do banco
	const quantSlots = sideTitle.length;

	const slotsArr = getSlots();

	function getSlots() {
		let arr = [];
		let hr = hr_inicio;

		if (horarios) {
			for (let index = 0; index < quantSlots; index++) {
				hr = ((index > 0)? hr + hrPorAgenda : hr + 0);
				let flag = false;
				horarios.forEach((horario) => {
					if (horario.data.getHours() === hr) flag = true;
				});
				arr.push(flag);
			}
		} else {
			arr.push(hr+":00");
			for (let index = 1; index < quantSlots; index++) {
				hr = hr + hrPorAgenda;
				arr.push(hr+":00");
			}
		}

		return arr;
	}

	return (
		<div className="coluna" style={tipo != "horario"? {width: 'auto'}: {}}>
			{tipo == "horario" && (
				<>
					<ColunaTitle title={title} dateString={dateString} />
					<div className="slots">
						{slotsArr.map((slot, i) => {
							return <AgendaBox key={i} ocupado={slot} tipo={tipo} />;
						})}
					</div>
				</>
			)}

			{
				tipo == "sideTitle" && (
						<div className="slots">
							{sideTitle.map((hora, i) => {
								return <AgendaBox key={i} text={hora} tipo={tipo} />;
							})}
						</div>
				)
			}
		</div>
	);
};

class Horario implements IHorario {
	id: number;
	status: "Livre" | "Ocupado";
	data: Date;

	constructor() {
		this.id = 0;
		this.status = "Livre";
		this.data = new Date();
	}
}
