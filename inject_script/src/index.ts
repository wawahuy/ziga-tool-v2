import InjectService from './services/InjectService';

const service = new InjectService;
service.injectMoveListener((...args) => true);
service.injectSelectListener((...args) => true);
service.injectTouchMoveListener((...args) => true);
service.injectStartGameListener((...args) => true);
service.injectFinishGameListener((...args) => true);
