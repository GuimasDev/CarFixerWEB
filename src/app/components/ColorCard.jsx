import Card from 'react-bootstrap/Card';

export const ColorCard = props => {
  return (
    <>
      <Card
        bg={props.variant.toLowerCase()}
        style={{ width: '18rem' }}
      >
        <Card.Header>{props.header}</Card.Header>
        <Card.Body>
          {/* <Card.Title>{props.title} </Card.Title> */}
          <Card.Text>
            {props.text}
          </Card.Text>
        </Card.Body>
      </Card>
    </>
  );
}