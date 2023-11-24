import { Table } from "react-bootstrap"

export const ListTable = props => {
  return (
    <Table striped bordered hover>
      <thead>
          {props.thead}
      </thead>
      <tbody>
        {props.tbody}
      </tbody>
    </Table>
  )
}