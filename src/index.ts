import { Controller } from './game/Controller';

window.Webflow = window.Webflow || [];
window.Webflow.push(() => {
  new Controller();
});
