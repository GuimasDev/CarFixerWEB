import React from 'react';
import styles from './Celula.module.css';
import trash from "../../assets/icons/trash.svg";


export const Celula = ({ value, onChange, handleDelete, item_id }) => {
  const [mode, setMode] = React.useState('read');
  const [text, setText] = React.useState(value ?? '');

  React.useEffect(() => {
    setText(value);
  }, [value]); // <--- when value is changed text state is changed too

  if (mode === 'edit') {
    const handleInputChange = (e) => {
      setText(e.target.value);
    };

    const handleSaveClick = () => {
      setMode('read');
      if (onChange) {
        onChange(text);
      }
    };

    const handleDeleteClick = () => {
      setMode('read');
      if (handleDelete) {
        handleDelete(item_id);
      }
    };

    return (
      <div className={styles.itemAddedArea}>
        <input type="text" value={text}
          className={styles.itemAdded} onChange={handleInputChange} />
        <button onClick={handleSaveClick}>Ok</button>
        <button onClick={handleDeleteClick}>
          <img src={trash} alt="" />
        </button>
      </div>
    );

  }

  if (mode === 'read') {
    const handleEditClick = () => {
      setMode('edit');
    };

    return (
      <div className={styles.itemAddedArea}>
        <div className={styles.itemAdded} onClick={handleEditClick}>{text}</div>
      </div>
    );
  }

  return null;
};