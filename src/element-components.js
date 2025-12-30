import Vue from 'vue';
import 'element-ui/lib/theme-chalk/index.css';
import {
  Form,
  FormItem,
  Input,
  Radio,
  Checkbox,
  Button,
  Notification,
  Popover,
  Collapse,
  CollapseItem,
  Loading,
  Tabs,
  TabPane,
  Table,
  TableColumn,
  Tag,
  Dialog,
  Select,
  Option,
  OptionGroup,
  MessageBox,
  DatePicker,
  Pagination,
  Upload,
  Progress,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Tooltip,
  Tree,
  CheckboxGroup,
  RadioGroup,
  Menu,
  MenuItem,
  Row,
  Col,
  Switch,
  Divider,
  Message,
  Card,
} from 'element-ui';

Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Radio);
Vue.use(Checkbox);
Vue.use(Button);
Vue.use(Popover);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Loading);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Tag);
Vue.use(Dialog);
Vue.use(Select);
Vue.use(OptionGroup);
Vue.use(Option);
Vue.use(DatePicker);
Vue.use(Pagination);
Vue.use(Upload);
Vue.use(Progress);
Vue.use(Dropdown);
Vue.use(DropdownItem);
Vue.use(DropdownMenu);
Vue.use(Tooltip);
Vue.use(Tree);
Vue.use(CheckboxGroup);
Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(Row);
Vue.use(Col);
Vue.use(Switch);
Vue.use(Divider);
Vue.use(RadioGroup);
Vue.use(Card);

Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;
