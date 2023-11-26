import style from "./Loading.module.css";
import loading from "../assets/icons/loading.svg";

export default function Loading(){
  return (
    <div className={style.loader_container}>
      <img src={loading} alt="Loading" className={style.loader} />
    </div>
  )
}