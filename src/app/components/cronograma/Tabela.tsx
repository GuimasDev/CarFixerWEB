import { Coluna } from "./Coluna";

export const Tabela = (props: any) => {
	const columnDays = props.colunas;
	const sideTitle = props.sideTitle;

	const style = {
		tabela: {
			display: "flex",
			columnGap: "7px",
			alignItems: "end",
			width: "1000px",
		},
		info: {
			margin: "15px",
			color: "rgba(0, 0, 0, 0.4)",
			fontWeight: "700",
		},
	};

	return (
		<>
			<div style={style.tabela}>
				<Coluna slots={sideTitle.length} tipo="sideTitle" sideTitle={sideTitle} />

				{columnDays.map((columnDay: any) => {
					return (
						<Coluna
							title={columnDay.day}
							dateString={columnDay.dateString}
							slots={sideTitle.length}
							horarios={columnDay.horarios}
							sideTitle={sideTitle}
							tipo="horario"
						/>
					);
				})}
			</div>
			<span style={style.info}>
				Exibindo de {dateString_YYYYmmdd_to_ddmmYY(columnDays[0].dateString)} até{" "}
				{dateString_YYYYmmdd_to_ddmmYY(columnDays[columnDays.length - 1].dateString)}
			</span>
		</>
	);
};

const dateString_YYYYmmdd_to_ddmmYY = (str: string) => {
	let foo = str.split("/");
	return `${foo[2]}/${foo[1].padStart(2, "0")}/${foo[0].slice(-2)}`;
};
