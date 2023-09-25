import { Form } from 'react-bootstrap'

export const Input = props => {
  return (
    <Form.Group className={props.className}>
      <Form.Label>{props.label}</Form.Label>
      <Form.Control id={props.id} name={props.name} type={props.type} placeholder={props.placeholder} value={props.value} onChange={props.onChange} />
    </Form.Group>)
}