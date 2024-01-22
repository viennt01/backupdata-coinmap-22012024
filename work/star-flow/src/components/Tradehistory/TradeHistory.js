import { Component } from 'react';
import { connect } from 'react-redux';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import TradeHistory_ChildComponent from './TradeHistory_ChildComponent';
import { timeFormat } from 'd3-time-format';
import { format } from 'd3-format';
import { actPostTradehistory } from '@/redux/actions/index';

const formatTime = timeFormat('%H:%M:%S');
const formatNumber = format(',.5');
const formatHistory = (tradeRaw) => {
  var formated = {
    key: `${tradeRaw.T}${tradeRaw.f}`,
    time: formatTime(new Date(tradeRaw.T)),
    price: formatNumber(tradeRaw.p),
    amount: formatNumber(tradeRaw.q),
    Isthebuyer: tradeRaw.m,
  };
  return formated;
};

const MAX_LENGTH = 300;

class TradeHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      aggTrade: [],
      symbol: '',
      isActiveLastupdateidOrderbook: false,
      isActiveWebsocketChange: false,
      isActiveWebsocketClose: false,
    };
  }
  reset = () => {
    this.setState({
      aggTrade: [],
      isActiveLastupdateidOrderbook: false,
      isActiveWebsocketChange: false,
      isActiveWebsocketClose: false,
    });
  };

  switchSymbol = () => {
    this.reset();
    this.connect(this.state.symbol);
  };

  componentDidMount() {
    this.connect(this.props.symbol);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.state.symbol !== nextProps.value && nextProps.value) {
      this.setState({ isActiveWebsocketChange: true });
      this.setState({ symbol: nextProps.value });
    }
  }

  componentWillUnmount() {
    this.setState({ isActiveWebsocketClose: true });
  }

  connect = (symbol) => {
    var ws = new W3CWebSocket(
      `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@aggTrade`
    );

    ws.onopen = () => {
      this.setState({ ws: ws });
    };

    ws.onmessage = (e) => {
      if (this.state.isActiveWebsocketClose) {
        return ws.close();
      }
      if (this.state.isActiveWebsocketChange) {
        return ws.close(), this.switchSymbol();
      }
      const pl = JSON.parse(e.data);

      if (!this.log) {
        this.log = true;
      }
      var { aggTrade: aggTrade_ws } = this.state;
      aggTrade_ws.unshift(formatHistory(pl));
      aggTrade_ws = aggTrade_ws.slice(0, MAX_LENGTH);
      this.setState({ aggTrade: aggTrade_ws });
      this.props.postTradehistory(pl);
    };

    ws.onerror = (err) => {
      console.error(
        'Socket encountered error: ',
        err.message,
        'Closing socket'
      );
      ws.close();
    };
  };

  render() {
    const { minValue } = this.props;
    if (this.state.aggTrade.length == 0) {
      return <div>Loading...</div>;
    }
    return (
      <TradeHistory_ChildComponent
        aggTrade={this.state.aggTrade}
        minValue={minValue}
      />
    );
  }
}
const mapStateToProps = (state) => {
  return {
    symbol: state.orderbook[0].symbol,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    postTradehistory: (price) => {
      dispatch(actPostTradehistory(price)); //đẩy dữ liệu  lên redux ( actions/index)
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TradeHistory);
