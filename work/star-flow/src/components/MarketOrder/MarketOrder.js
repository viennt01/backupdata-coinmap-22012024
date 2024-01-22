import { Tabs, Tab } from 'react-bootstrap';
//import './_market-order.scss';
import Draggable from 'react-draggable';

export default function MarketOrder() {
  return (
    <>
      <Draggable handle="#handle-market-order">
        <div className="market-order mt15">
          <Tabs defaultActiveKey="limit-orders">
            <Tab eventKey="limit-orders" title="LIMIT ORDERS &nbsp;&nbsp;/">
              <ul className="d-flex justify-content-between market-order-item">
                <li>Action</li>
                <li>Date</li>
                <li>Type</li>
                <li>Contract</li>
                <li>Price</li>
                <li>Amount/Finished</li>
                <li>Iceberg Showing Size</li>
                <li>Total/Finished</li>
              </ul>
              <span className="no-data">
                <i className="icon ion-md-document"></i>
                No data
              </span>
            </Tab>
            <Tab
              eventKey="price-condition"
              title="PRICE CONDITION &nbsp;&nbsp;  /"
            >
              <ul className="d-flex justify-content-between market-order-item">
                <li>Action</li>
                <li>Date</li>
                <li>Type</li>
                <li>Contract</li>
                <li>Price</li>
                <li>Amount/Finished</li>
                <li>Iceberg Showing Size</li>
                <li>Total/Finished</li>
              </ul>
              <span className="no-data">
                <i className="icon ion-md-document"></i>
                No data
              </span>
            </Tab>
            <Tab eventKey="time-condition" title="TIME CONDITION">
              <ul className="d-flex justify-content-between market-order-item">
                <li>Action</li>
                <li>Date</li>
                <li>Type</li>
                <li>Contract</li>
                <li>Price</li>
                <li>Amount/Finished</li>
                <li>Iceberg Showing Size</li>
                <li>Total/Finished</li>
              </ul>
              <span className="no-data">
                <i className="icon ion-md-document"></i>
                No data
              </span>
            </Tab>
          </Tabs>
        </div>
      </Draggable>
    </>
  );
}
