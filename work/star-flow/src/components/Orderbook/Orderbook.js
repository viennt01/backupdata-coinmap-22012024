import { Component } from 'react';

import { connect } from 'react-redux';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import Websocket_ChildComponent from './Orderbook_ChildComponent';
import { actFetchOderbookRequest_Lastupdateid } from '@/redux/actions/index';

class Orderbook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bids: [],
      asks: [],
      lastUpdateId: 0,
      symbol: '',
      price: '',
      Isthebuyer: '',
      buffer: [],
      isActiveLastupdateidOrderbook: false,
      isActiveWebsocketChange: false,
      isActiveWebsocketClose: false,
    };
  }
  reset = () => {
    this.setState({
      isActiveLastupdateidOrderbook: false,
      isActiveWebsocketChange: false,
      isActiveWebsocketClose: false,
      bids: [],
      asks: [],
      lastUpdateId: 0,
      buffer: [],
    });
  };

  getSnapshot = (symbol) => {
    this.setState({ isActiveLastupdateidOrderbook: true });
    this.props.fetchOrderbook(symbol);
  };

  switchSymbol = () => {
    this.reset();
    this.connect(this.state.symbol);
  };

  // single websocket instance for the own application and constantly trying to reconnect.

  componentDidMount() {
    this.connect(this.props.symbol);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    //console.log("componentWillReceiveProps orderbook",nextProps)

    if (nextProps.price) {
      var price = Number(nextProps.price).toFixed(2);

      this.setState({ price: price });
      var Isthebuyer = Boolean(nextProps.Isthebuyer);
      this.setState({ Isthebuyer: Isthebuyer });
    }

    if (
      this.state.isActiveLastupdateidOrderbook === true &&
      nextProps.orderbook.lastUpdateId
    ) {
      const { bids: bidsS, asks: asksS, lastUpdateId } = nextProps.orderbook;
      const bids = bidsS.map((d) => d.map(Number));
      const asks = asksS.map((d) => d.map(Number));
      this.setState({
        ...this.state,
        bids,
        asks,
        lastUpdateId,
      });
      this.setState({ isActiveLastupdateidOrderbook: false });
    }

    if (this.state.symbol !== nextProps.value && nextProps.value) {
      this.setState({ isActiveWebsocketChange: true });
      this.setState({ symbol: nextProps.value });
    }
  }

  componentWillUnmount() {
    this.setState({ isActiveWebsocketClose: true });
  }

  timeout = 250; // Initial timeout duration as a class variable

  /**
   * @function connect
   * This function establishes the connect with the websocket and also ensures constant reconnection if connection closes
   */
  connect = (symbol) => {
    var ws = new W3CWebSocket(
      `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@depth`
    );

    let that = this; // cache the this
    var connectInterval;

    // websocket onopen event listener
    ws.onopen = () => {
      this.setState({ ws: ws });
      that.timeout = 250; // reset timer to 250 on open of websocket connection
      clearTimeout(connectInterval); // clear Interval on on open of websocket connection
    };

    ws.onmessage = (e) => {
      if (this.state.isActiveWebsocketClose) {
        return ws.close();
      }
      if (this.state.isActiveWebsocketChange) {
        return ws.close(), this.switchSymbol();
      }
      const pl = JSON.parse(e.data);

      var {
        bids: Bids_ws,
        asks: Asks_ws,
        lastUpdateId: LastUpdateId_ws,
        buffer: Buffer_ws,
      } = this.state;
      if (!LastUpdateId_ws) {
        if (!Buffer_ws.length) this.getSnapshot(symbol);
        Buffer_ws = [...Buffer_ws, pl];
        this.setState({
          buffer: [...Buffer_ws, pl],
        });
        // console.log("1", this.state)
      } else if (LastUpdateId_ws && Buffer_ws.length) {
        //process buffer
        Buffer_ws = [...Buffer_ws, pl];
        // console.log("2", this.state)
        const nextUpdateId = LastUpdateId_ws + 1;
        const fpidx = Buffer_ws.findIndex(
          (d) => d.U <= nextUpdateId && d.u >= nextUpdateId
        );
        Buffer_ws = Buffer_ws.slice(fpidx);

        Buffer_ws.forEach((d) => {
          const newBids = d.b.map((dd) => dd.map(Number));
          const newAsks = d.a.map((dd) => dd.map(Number));

          newBids.forEach((dd) => {
            const idx = Bids_ws.findIndex((v) => v[0] === dd[0]);
            if (idx > -1) {
              Bids_ws[idx] = dd;
            } else {
              Bids_ws = [...Bids_ws, dd];
            }
          });

          newAsks.forEach((dd) => {
            const idx = Asks_ws.findIndex((v) => v[0] === dd[0]);
            if (idx > -1) {
              Asks_ws[idx] = dd;
            } else {
              Asks_ws = [...Asks_ws, dd];
            }
          });

          Bids_ws = Bids_ws.filter((v) => v[1]).sort((a, b) => b[0] - a[0]);

          Asks_ws = Asks_ws.filter((v) => v[1]).sort((a, b) => a[0] - b[0]);

          LastUpdateId_ws = d.u;
        });
        this.setState({
          lastUpdateId: LastUpdateId_ws,
          bids: Bids_ws,
          asks: Asks_ws,
          buffer: [],
        });
      } else {
        //process real time
        if (pl.U != LastUpdateId_ws + 1) {
          console.log('Orderbook out of sync');
          return this.switchSymbol();
        }

        const newBids = pl.b.map((dd) => dd.map(Number));
        const newAsks = pl.a.map((dd) => dd.map(Number));

        newBids.forEach((dd) => {
          const idx = Bids_ws.findIndex((v) => v[0] === dd[0]);
          if (idx > -1) {
            Bids_ws[idx] = dd;
          } else {
            Bids_ws = [...Bids_ws, dd];
          }
        });

        newAsks.forEach((dd) => {
          const idx = Asks_ws.findIndex((v) => v[0] === dd[0]);
          if (idx > -1) {
            Asks_ws[idx] = dd;
          } else {
            Asks_ws = [...Asks_ws, dd];
          }
        });

        Bids_ws = Bids_ws.filter((v) => v[1])
          .sort((a, b) => b[0] - a[0])
          .slice(0, 30);
        Asks_ws = Asks_ws.filter((v) => v[1])
          .sort((a, b) => a[0] - b[0])
          .slice(0, 30);
        Asks_ws = Asks_ws.filter((v) => v[1]).sort((a, b) => b[0] - a[0]);
        // .slice(0, 15);

        LastUpdateId_ws = pl.u;
        this.setState({
          lastUpdateId: LastUpdateId_ws,
          bids: Bids_ws,
          asks: Asks_ws,
        });

        //console.log(pl.U , LastUpdateId_ws + 1);
        //console.log("asks",Asks_ws,Asks_ws[Asks_ws.length-1])
        //console.log("bids",Bids_ws,Bids_ws[Bids_ws.length-1])
      }
    };

    // websocket onclose event listener
    // ws.onclose = e => {
    //     console.log(
    //         `Socket is closed. Reconnect will be attempted in ${Math.min(
    //             10000 / 1000,
    //             (that.timeout + that.timeout) / 1000
    //         )} second.`,
    //         e.reason
    //     );

    //     that.timeout = that.timeout + that.timeout; //increment retry interval
    //     connectInterval = setTimeout(this.check, Math.min(10000, that.timeout)); //call check function after timeout
    // };

    // websocket onerror event listener
    ws.onerror = (err) => {
      console.error(
        'Socket encountered error: ',
        err.message,
        'Closing socket'
      );
      ws.close();
    };
  };

  /**
   * utilited by the @function connect to check if the connection is close, if so attempts to reconnect
   */
  check = () => {
    const { ws } = this.state;
    if (!ws || ws.readyState == Orderbook.CLOSED) this.switchSymbol(); //check if websocket instance is closed, if so call `connect` function.
  };

  convertArray = (arrayConvert) => {
    var arrayReturn = arrayConvert.map(function (obj) {
      var object = {
        price: Number(obj[0].toFixed(2)),
        size: Number(obj[1].toFixed(5)),
        total: (Number(obj[0]) * Number(obj[1])).toFixed(2),
      };

      return object;
    });
    return arrayReturn;
  };

  render() {
    if (this.state.bids.length == 0 && this.state.asks.length == 0) {
      return <div>Loading...</div>;
    }
    return (
      <Websocket_ChildComponent
        price={this.state.price}
        Isthebuyer={this.state.Isthebuyer}
        bids={this.convertArray(this.state.bids)}
        asks={this.convertArray(this.state.asks)}
      />
    );
  }
}
const mapStateToProps = (state) => {
  //console.log("orderbook",state)

  return {
    symbol: state.orderbook[0].symbol,
    orderbook: state.orderbook[0].orderbook,
    Isthebuyer:
      state.tradehistory[0].m == undefined ? null : state.tradehistory[0].m,
    price:
      state.tradehistory[0].p == undefined ? null : state.tradehistory[0].p,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchOrderbook: (symbol) => {
      dispatch(actFetchOderbookRequest_Lastupdateid(symbol));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Orderbook);
