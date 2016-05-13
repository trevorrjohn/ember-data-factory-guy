import SharedFactoryGuyBehavior from './shared-factory-guy-tests';
import { title, inlineSetup } from '../helpers/utility-methods';

let SharedAdapterBehavior = {};

SharedAdapterBehavior.all = function (adapter, adapterType) {
  let App = null;

  module(title(adapter, 'FactoryGuy#make'), inlineSetup(App, adapterType));
  SharedFactoryGuyBehavior.makeTests();


  module(title(adapter, 'FactoryGuy#makeList'), inlineSetup(App, adapterType));
  SharedFactoryGuyBehavior.makeListTests();
};

export default SharedAdapterBehavior;
