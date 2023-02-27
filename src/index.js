import { Notify } from 'notiflix';
import RequestSearchApi from './js/requestSearchApi';
import renderImage from './js/renderImage';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const requestSearchApi = new RequestSearchApi();
const input = document.querySelector('[name="searchQuery"]');
const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');

form.addEventListener('submit', onSearch);
btnLoadMore.addEventListener('click', onLoadMore);

let lightbox = new SimpleLightbox('.photo-card a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

function onSearch(event) {
  event.preventDefault();
  requestSearchApi.resetPage();
  gallery.innerHTML = '';
  const inputValue = input.value;

  requestSearchApi.changeSearchWord(inputValue);

  if (inputValue) {
    requestSearchApi
      .searchImages()
      .then(dataImages => {
        Notify.success(`Hooray! We found ${dataImages.totalHits} images.`);
        dataImages.hits.map(hit => {
          renderImage(hit);
        });
        lightbox.refresh();
        btnLoadMoreShow();
      })
      .catch(() => {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      });
  }
}

function onLoadMore() {
  requestSearchApi
    .searchImages()
    .then(dataImages => {
      dataImages.hits.map(hit => {
        renderImage(hit);
      });
      lightbox.refresh();
      const { height: cardHeight } =
        gallery.firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    })
    .catch(() => {
      Notify.info("We're sorry, but you've reached the end of search results.");
      btnLoadMoreHide();
    });
}

function btnLoadMoreHide() {
  btnLoadMore.style.display = 'none';
}

function btnLoadMoreShow() {
  btnLoadMore.style.display = 'block';
}
