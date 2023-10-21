import PostList from './PostList';
import PostStateService from './PostStateService';
import PostController from './PostController';

const postList = new PostList();
postList.bindToDOM(document.querySelector('.container'));

const stateService = new PostStateService(localStorage);

const postCtrl = new PostController(postList, stateService);
postCtrl.init();
