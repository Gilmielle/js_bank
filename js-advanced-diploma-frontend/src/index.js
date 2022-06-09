import { el, setChildren } from 'redom';
import './styles/common.scss';
import header from './components/header.js';
import authFormBlock from './components/auth-form.js';

header.classList.add('header_reduced');
setChildren(window.document.body, [header, authFormBlock]);
