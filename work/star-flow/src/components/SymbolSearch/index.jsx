const { default: dynamic } = require('next/dynamic');

const SymbolSearch = dynamic(() => import('./SymbolSearchModal'), {
  loading: () => null,
  ssr: false,
});

export default SymbolSearch;
