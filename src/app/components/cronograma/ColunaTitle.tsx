export const ColunaTitle = (props: any) => {
	const style = {
		day: {
			fontSize: "15px",
			margin: 0,
			marginBottom: "10px",
			padding: 0,
		},
		date: {
			fontSize: "15px",
			margin: 0,
			marginBottom: "10px",
			padding: 0,
		},
	};
	return (
		<h3 style={style.day}>
			{props.title} ({dateString_YYYYmmdd_to_ddmm(props.dateString)})
		</h3>
	);
};

const dateString_YYYYmmdd_to_ddmm = (str: string) => {
	let foo = str.split("/");
	return `${foo[2]}/${foo[1].padStart(2, "0")}`;
};
