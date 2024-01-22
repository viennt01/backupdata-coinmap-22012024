import { Component } from 'react';
import cx from 'classnames';

class Websocket_ChildComponent extends Component {
  render() {
    const { bids, asks, price, Isthebuyer } = this.props;

    function bidsNewHandler(bidsNew) {
      //tao mot mang moi
      return bidsNew.total;
    }
    var Newbids = bids.map(bidsNewHandler);
    var calcMaxBids = Math.max(...Newbids);

    function asksNewHandler(asksNew) {
      //tao mot mang moi
      return asksNew.total;
    }
    var newAsks = asks.map(asksNewHandler);
    var calcMaxAsks = Math.max(...newAsks);

    return (
      <>
        <table className="table my-custom-scrollbar table-wrapper-scroll-y">
          <thead>
            <tr>
              <th>Price(USDT)</th>
              <th>Amount&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
              <th>Total&nbsp;&nbsp;&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            {asks.map((ask, index) => {
              return (
                <tr
                  key={index}
                  className={`red-bg-${
                    Math.round((ask.total * 20) / calcMaxAsks) * 5
                  }`}
                >
                  <td className="red">{ask.price}</td>
                  <td>{ask.size}</td>
                  <td>{ask.total}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <table className="table">
          <tbody className="ob-heading">
            <tr>
              <td
                style={{ fontSize: '24px', textAlign: 'center' }}
                className={cx({
                  green: Isthebuyer === false,
                  red: Isthebuyer === true,
                })}
              >
                {
                  Isthebuyer ? `\$${price}↓` : `\$${price}↑`
                  // ? <img src={pricedown} style={{ height: '22px', borderColor: "red", paddingLeft: "5px", paddingBottom: "3px" }} />
                  // : <img src={priceup} style={{ height: '22px', borderColor: "red", paddingLeft: "5px", paddingBottom: "3px" }} />
                }
              </td>

              <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
            </tr>
          </tbody>
        </table>
        <table className="table my-custom-scrollbar table-wrapper-scroll-y">
          <tbody>
            {bids.map((bid, index) => {
              return (
                <tr
                  key={index}
                  className={`green-bg-${
                    Math.round((bid.total * 20) / calcMaxBids) * 5
                  }`}
                >
                  <td className="green">{bid.price}</td>
                  <td>{bid.size}</td>
                  <td>{bid.total}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </>
    );
  }
}

export default Websocket_ChildComponent;
