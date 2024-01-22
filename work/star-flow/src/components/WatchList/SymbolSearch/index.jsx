import Loading from '@/components/Loading';

const { default: dynamic } = require('next/dynamic');

const SymbolSearch = dynamic(() => import('./SymbolSearchModal'), {
  loading: Loading,
  ssr: false,
});

export default SymbolSearch;
