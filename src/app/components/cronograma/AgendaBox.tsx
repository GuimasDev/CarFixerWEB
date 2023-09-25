

export const AgendaBox = (props: any) => {
  const ocupado: boolean = props.ocupado
  const text: string = props.text
  const tipo: "horario"|"sideTitle" = props.tipo;

  let style = {
    box:{
      borderRadius: "10px",
      height: '33px',
      width: '100%',
      backgroundColor: (ocupado == true && tipo == "horario")? 'rgb(56, 56, 216)': (tipo == "horario")? 'lightgrey': 'grey',
    },

    title:{
      height: '33px',
      width: '100%',
      display: 'flex',
      alignItems: "center",
      // backgroundColor: 'grey',
    }
  }


  if (tipo=="horario") {
    return <div style={style.box}></div>
  } else{
    return <div style={style.title}>{text}</div>
  }
}