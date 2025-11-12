import type { IState } from "../interfaces";
import type { PodcastStore } from "../store";

export interface ToastState {
  message: string;
  shown: boolean;
}

export class ToastController {
  store: PodcastStore;
  unsubscribe;
  constructor(store: PodcastStore) {
    this.store = store;
    this.unsubscribe = this.store.subscribe((state) => {
      this.showLoader(state);
    });
  }

  showLoader(state: IState) {
    const titleEl = document.querySelector(".toast-title");
    const captionEl = document.querySelector(".toast-caption");
    const body = document.querySelector(".toast-body");
    const toast = document.querySelector(".toast");
    if (body && toast && captionEl && titleEl) {
      toast.classList.add("text-bg-primary");
      body.innerHTML = `<div id="loading-spinner" class="text-center">
          <div class="spinner-border text-info" role="status">
            <span class="visually-hidden">Loading "${state.title}"...</span>
          </div>
        </div> Loading "${state.title}"...`;
      captionEl.innerHTML = "Please wait";
      titleEl.innerHTML = "STATECAST";
      if (state.loading) {
        toast.classList.add("show");
      } else {
        toast.classList.remove("show");
      }
    }
  }

  alert(message: string, title: string = "STATECAST", caption: string = "") {
    const titleEl = document.querySelector(".toast-title");
    const captionEl = document.querySelector(".toast-caption");
    const body = document.querySelector(".toast-body");
    const toast = document.querySelector(".toast");
    if (body && toast && captionEl && titleEl) {
      toast.classList.remove("text-bg-primary");
      body.innerHTML = message;
      captionEl.innerHTML = caption;
      titleEl.innerHTML = title;
      toast.classList.add("show");
      setTimeout(() => {
        toast.classList.remove("show");
      }, 4999);
    }
  }
}
