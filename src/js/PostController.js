import PostState from './PostState';
import { validateCoordsStr } from './validator';

let coordsStr = '[]';
const addCoordsForm = document.querySelector('#add-coords-modal');
const addForm = document.querySelector('#add-post');

export default class PostController {
  constructor(postList, stateService) {
    this.postList = postList;
    this.stateService = stateService;

    this.postContainer = document.querySelector('.post-list');

    this.postState = new PostState();
  }

  init() {
    this.postList.drawUi();

    addForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.onAddPostClick();
    });

    addForm.addEventListener('reset', (e) => {
      e.preventDefault();
      this.onAddPostCancel();
    });

    addCoordsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.onAddCoordsClick();
    });

    addCoordsForm.addEventListener('reset', (e) => {
      e.preventDefault();
      this.onAddCoordsCancel();
    });

    this.redrawPostList();
  }

  redrawPostList() {
    const oldPosts = Array.from(document.querySelectorAll('.post'));

    for (let i = 0; i < oldPosts.length; i++) {
      oldPosts[i].remove();
    }

    const loadPostList = this.stateService.load();
    if (!loadPostList) {
      return;
    }

    this.postState.postArray = loadPostList.postArray;

    for (let i = 0; i < this.postState.postArray.length; i++) {
      const post = document.createElement('div');
      post.classList.add('post');

      const postTime = document.createElement('div');
      postTime.classList.add('post-time');
      postTime.textContent = this.postState.postArray[i].time;

      const postText = document.createElement('div');
      postText.classList.add('post-text');
      postText.textContent = this.postState.postArray[i].text;

      const postCoords = document.createElement('div');
      postCoords.classList.add('post-coords');
      postCoords.textContent = this.postState.postArray[i].coords;

      const postDelete = document.createElement('button');
      postDelete.classList.add('del-post-btn', 'visually-hidden');

      this.postContainer.appendChild(post);
      post.appendChild(postTime);
      post.appendChild(postText);
      post.appendChild(postCoords);
      post.appendChild(postDelete);

      post.addEventListener('mouseenter', (e) => {
        e.preventDefault();
        e.target.children[3].classList.remove('visually-hidden');
      });

      post.addEventListener('mouseleave', (e) => {
        e.preventDefault();
        e.target.children[3].classList.add('visually-hidden');
      });

      postDelete.addEventListener('click', (e) => {
        e.preventDefault();
        this.postState.postArray = this.postState.postArray.filter((item) => item.text !== postText.textContent);
        this.stateService.save(this.postState);
        this.redrawPostList();
      });
    }
  }

  onAddPostClick() {
    if (coordsStr === '[]') {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (data) => {
            const { latitude, longitude } = data.coords;
            coordsStr = `[${latitude}, ${longitude}]`;
          },
          (err) => {
            addForm.classList.add('visually-hidden');
            addCoordsForm.classList.remove('visually-hidden');
          },
          { enableHighAccuracy: true },
        );
      }
    }

    if (coordsStr !== '[]') {
      const newPostText = addForm.querySelector('.add-post-input');

      const postTime = new Date().toLocaleDateString('ru', {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });

      this.postState.postArray.unshift({ time: postTime, text: newPostText.value, coords: coordsStr });
      newPostText.value = '';

      this.stateService.save(this.postState);
      coordsStr = '[]';
      this.redrawPostList();
    }
  }

  onAddPostCancel() {
    addForm.querySelector('.add-post-input').value = '';
  }

  onAddCoordsClick() {
    const addCoordsInput = document.querySelector('.add-coords-input');
    if (validateCoordsStr(addCoordsInput.value) === true) {
      coordsStr = addCoordsInput.value;
      if (coordsStr.substring(0, 1) !== '[') {
        coordsStr = `[${coordsStr}`;
      }
      if (coordsStr.substring(coordsStr.length - 1) !== ']') {
        coordsStr += ']';
      }
      const comma = coordsStr.indexOf(',');
      if (coordsStr.substring(comma + 1, comma + 2) !== ' ') {
        coordsStr = `${coordsStr.substring(0, comma + 1)} ${coordsStr.substring(comma + 1)}`;
      }
      this.onAddPostClick();
      addCoordsForm.classList.add('visually-hidden');
      addForm.classList.remove('visually-hidden');
    } else {
      alert('Неверный формат координат');
    }
  }

  onAddCoordsCancel() {
    addCoordsForm.classList.add('visually-hidden');
    addForm.classList.remove('visually-hidden');
  }
}
