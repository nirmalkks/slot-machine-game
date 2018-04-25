'use strict';

import GameApp from './app';
import '../style.css';

/*
 * Binds window onload event to a function which initializes App module with all its dependencies
 */

window.onload = () => {
  new GameApp();
};