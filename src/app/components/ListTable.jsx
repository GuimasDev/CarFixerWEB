import { Table } from "react-bootstrap"

export const ListTable = props => {
  return (
    <Table striped bordered hover variant="dark">
      <thead>
          {props.thead}
      </thead>
      <tbody>
        {props.tbody}
      </tbody>
    </Table>
  )
}