import { Form } from "react-bootstrap"

export const Select = props => {
  const { className, label, id, name, defaultValue, children, onChange } = props;

  return (
    <Form.Group className={props.className}>
      <Form.Label>{props.label}</Form.Label>
      <Form.Select id={props.id} name={props.name} type={props.type} defaultValue={props.defaultValue} onChange={props.onChange}>
        <option disabled>{props.defaultValue}</option>
        {children}
      </Form.Select>
    </Form.Group>
  )
}