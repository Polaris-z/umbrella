import '../styles/index.less';
import Button from './button';
import Input from './input';
import Card from './card';
import Dropdown from './dropdown';
import Menu from './menu';

const components = [
  Button,
  Input,
  Card,
  Dropdown,
  Menu,
]

const install = (Vue: any) => {
  components.forEach((component) => {
    Vue.component(component.name, component);
  });
}
export default {
  Button,
  Input,
  Card,
  Menu,
  Dropdown,
  install
}
