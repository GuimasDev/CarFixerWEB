import React, { useEffect, useState } from "react";
import "./Cronograma.css";
import { HorarioService, IHorario } from "../services/api/horario/HorarioService";
import { AgendaBox } from "../components/cronograma/AgendaBox";
import { ColunaTitle } from "../components/cronograma/ColunaTitle";
import { ApiException } from "../services/api/ApiException";
import { Coluna } from "../components/cronograma/Coluna";
import { Tabela } from "../components/cronograma/Tabela";

export const Cronograma = () => {
	//===========================================
	const hr_inicio = "10:00";
	const hr_termino = "18:00";
	const hrPorAgenda = 1;
	const quantSlots = 6; // para calcular será necessario saber quanto tempo cada agendamento gasta e assim fazer o calculo
	//===========================================

	const [horarioList, setHorarioList] = useState<IHorario[]>([]);
	const [needReloadHorarioList, setNeedReloadhorarioList] = useState<boolean>(false); // acionar useEffect

	const todayFullDate: Date = new Date();

	const columnDays: ColumnDay[] = getColumnDays(todayFullDate, horarioList);

	const columnSideTitle: string[] = getColumnSideTitle(columnDays, hr_inicio, hr_termino, hrPorAgenda);


	// console.log(columnSideTitle);

	// console.log(columnDays);

	useEffect(() => {
		HorarioService.get().then((result) => {
			if (result instanceof ApiException) {
				alert(result.message);
			} else {
				result.forEach((horario: Horario) => {
					horario.data = new Date(horario.data);
				});

				setHorarioList(result);
			}
			// console.log(result);
		});

		setNeedReloadhorarioList(false);
	}, [needReloadHorarioList]);

	return (
		<div id="container">
			<h1>Horários de Funcionamento</h1>
			<Tabela colunas={columnDays} sideTitle={columnSideTitle}/>
		</div>
	);
};

function getColumnDays(todayDate: Date, horarioList: Horario[]) {
	const dateToString = (date: Date) =>
		date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
	const diasSemana = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
	const data = new Date(todayDate);

	let array: ColumnDay[] = [];

	let count = 0;
	do {
		data.setDate(data.getDate() + (count > 0 ? 1 : 0));
		let horariosDoDia = getHorariosByDay(data, horarioList);
		let columnDay = new ColumnDay(dateToString(data), diasSemana[data.getDay()], horariosDoDia);
		array.push(columnDay);
		count++;
	} while (count < 7);

	return array;
}

function getHorariosByDay(data: Date, horarioList: Horario[]) {
	const dateToString = (date: Date) =>
		date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();

	let horariosDoDia =
		horarioList.filter((horario) => {
			return dateToString(horario.data) === dateToString(data) ? true : false;
		}) || [];

	return horariosDoDia;
}

function getColumnSideTitle(
	columnDays: ColumnDay[],
	hr_inicio: string,
	hr_termino: string,
	hrPorAgenda: number
) {
	let array = [hr_inicio, hr_termino];
	array.sort();

	columnDays.forEach((columnDay) => {
		columnDay.horarios.forEach((horario) => {
			let horasString = `${horario.data.getHours()}:${String(horario.data.getMinutes()).padStart(2, '0')}`;
			if (!array.includes(horasString)) array.push(horasString);
		});
	});
	array.sort();



	let flag = true;
	let i = 0;
	while (flag) {
		if (i + 1 < array.length) {
			let hora = array[i].split(":")[0];
			let proxHora = array[i + 1].split(":")[0];

			console.log(
				"hora: " + Number(hora) + "proxHora: " + proxHora + "proxHora: " + String(Number(hora) + hrPorAgenda)
			);

			if (String(Number(hora) + hrPorAgenda) != proxHora) {
				array.push(String(Number(hora) + hrPorAgenda).padStart(2, '0') + ":00");
				array.sort();
				console.log(String(Number(hora) + hrPorAgenda) + ":00");
			}
		}

		i++;

		if (i >= array.length) {
			flag = false;
		}
		if (i >= 30) {
			flag = false;
			console.log("Loop ao carregar slots sideTitle!!");
			
		}
	}

	console.log(array);

	return array;
}


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

class ColumnDay {
	dateString: string;
	day: string;
	horarios: Horario[];

	constructor(dateString: string, day: string, horarios: Horario[]) {
		this.dateString = dateString;
		this.day = day;
		this.horarios = horarios;
	}
}
