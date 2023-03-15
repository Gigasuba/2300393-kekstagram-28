const picturesBlock = document.querySelector('.pictures');
const bigPictureContainer = document.querySelector('.big-picture');
const bigPictureImg = document.querySelector('.big-picture__img img');
const socialCaption = document.querySelector('.social__caption');
const socialCommentCount = document.querySelector('.social__comment-count');
//const commentsLoader = document.querySelector('.comments-loader');

let commentsSet = [];

const pushCommentsToVisible = (photoId, needCount = 5) => {
  const targetSet = commentsSet.find((e) => e.idPhoto.toString() === photoId.toString());
  targetSet.lastCommentsPack = [];
  for (let i = 0; i < needCount; i++) {
    if (targetSet.hideComments[0] !== undefined) {
      targetSet.visibleComments.push(targetSet.hideComments[0]);
      targetSet.lastCommentsPack.push(targetSet.hideComments[0]);
      targetSet.hideComments.splice(0, 1);
    }
  }
};

const initCommentsSet = (photos) => {
  commentsSet = [];
  photos.forEach((photo) => {
    const comments = {
      idPhoto: photo.id,
      visibleComments: [],
      hideComments: photo.comments,
      lastCommentsPack: []
    };
    commentsSet.push(comments);
    pushCommentsToVisible(photo.id);
  });
};

const isEscapeKey = (evt) => evt.key === 'Escape';

const getCommentTemplateClone = () => {
  const thumbnailsTemplate = document.querySelector('#comment-template').content;
  return thumbnailsTemplate.cloneNode(true);
};

const getCommentCloneWithData = (comment) => {
  const commentClone = getCommentTemplateClone();
  const commentImg = commentClone.querySelector('.social__picture');
  commentImg.src = comment.avatar;
  commentImg.alt = comment.name;
  commentClone.querySelector('.social__text').textContent = comment.message;
  return commentClone;
};

const initComments = (commentSet) => {
  const commentsContainer = document.querySelector('.social__comments');
  commentsContainer.innerHTML = '';
  commentSet.visibleComments.forEach((comment) => {
    const commentClone = getCommentCloneWithData(comment);
    commentsContainer.appendChild(commentClone);
  });
};

const initialSocialCounters = (pictureContainer, targetCommentsSet) => {
  const likesCount = document.querySelector('.likes-count');
  const commentsCount = document.querySelector('.comments-count');
  socialCommentCount.textContent = targetCommentsSet.visibleComments.length;
  commentsCount.textContent = ` из ${pictureContainer.querySelector('.picture__comments').textContent} комментариев`;
  socialCommentCount.appendChild(commentsCount);
  likesCount.textContent = pictureContainer.querySelector('.picture__likes').textContent;
};

const setHiddenToBigPicture = () => {
  bigPictureContainer.classList.add('hidden');
  document.body.classList.remove('modal-open');
};

const setPictureClickEvt = (photos) => {
  picturesBlock.addEventListener('click', (evt) => {
    const pictureImg = evt.target;
    if (!evt.target.classList.contains('picture__img')) {
      return;
    }
    bigPictureContainer.classList.remove('hidden');
    document.body.classList.add('modal-open');

    //socialCommentCount.classList.add('hidden');
    //commentsLoader.classList.add('hidden');

    bigPictureImg.src = pictureImg.src;

    const pictureContainer = pictureImg.parentElement;
    const photoData = photos.find((e) => e.id.toString() === evt.target.id.toString());
    socialCaption.textContent = photoData.description;
    const targetCommentsSet = commentsSet.find((e) => e.idPhoto.toString() === evt.target.id.toString());
    initComments(targetCommentsSet);
    initialSocialCounters(pictureContainer, targetCommentsSet);
  });
};

const setEscEvt = () => {
  document.addEventListener('keydown', (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      setHiddenToBigPicture();
    }
  });
};

const setCloseButtonEvt = () => {
  const closeButton = document.querySelector('.big-picture__cancel');
  closeButton.addEventListener('click', () => {
    setHiddenToBigPicture();
  });
};

const setFullSizeEventListeners = (photos) => {
  initCommentsSet(photos);
  setPictureClickEvt(photos);
  setCloseButtonEvt();
  setEscEvt();
};

export { setFullSizeEventListeners };
