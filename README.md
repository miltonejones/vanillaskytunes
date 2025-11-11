# 🎧 StateCast

StateCast is a lightweight, client-side podcast app and audio player
powered by RSS feeds.\
It features a global app state, subscription management, carousel
browsing, episode playback, toast notifications, and pure TypeScript
architecture with zero external UI frameworks.

---

## ✨ Features

- 📡 **RSS Podcast Parsing** -- Fetch and process podcast feeds with
  enclosure metadata\
- 🎵 **Built-in Audio Player** -- Custom audio state, progress
  tracking, time display\
- 🔄 **Reactive Store** -- Centralized state container for
  subscriptions, playback, and UI\
- 🎠 **Carousel UI** -- Swipe/browse podcast tiles interactively\
- 💾 **Local Persistence** -- Saves podcast subscriptions to local
  storage\
- 🍞 **Toast Notifications** -- Lightweight alert system with
  state-driven UI\
- 📱 **No Framework Lock-In** -- Plain TypeScript modules + DOM
  rendering

---

## 🧠 Architecture Overview

---

Module Responsibility

---

`store.ts` App state, subscription handling,
and RSS feed requests

`rssParser.ts` Converts raw RSS XML into usable
podcast/episode objects

`audioPlayer.ts` Controls playback, time updates,
play/pause, and seek logic

`carousel.ts` Generates podcast carousel UI

`toastController.ts` Manages toast notifications

`interfaces.ts` Shared TypeScript interfaces

`main.ts` App bootstrap and view rendering

---

---

## 🚀 Getting Started

### 1. Install dependencies

This is vanilla TypeScript, so you only need a bundler or dev server.

```sh
npm install
```

### 2. Run the app

```sh
npm run dev
```

Or build for production:

```sh
npm run build
```

---

## 🗂 Project Structure

    src/
    │── main.ts              # App entry point
    │── store.ts             # Global state + subscriptions
    │── interfaces.ts        # Shared type definitions
    │── rssParser.ts         # RSS → JSON episode conversion
    │── audioPlayer.ts       # Playback controller + audio state
    │── carousel.ts          # Renders podcast carousel UI
    │── toastController.ts   # Toast alerts
    │── style.css            # Core styling

---

## 🔌 Usage

### Subscribe to a Podcast

```ts
store.subscribeToPodcast("https://feeds.simplecast.com/54nAGcIl");
```

### Listen to state updates

```ts
store.subscribe((state) => {
  console.log("State updated", state);
});
```

### Play an episode

Handled through the built-in audio player via state dispatch:

```ts
store.dispatch({
  type: "PLAY_EPISODE",
  payload: episodeObject,
});
```

---

## 💾 Local Storage Behavior

Subscriptions are automatically stored under:

    localStorage["statecast_subscriptions"]

No backend required.

---

## 🎨 UI Notes

- Carousel and episode views render dynamically via DOM functions
- Audio player progress updates from `requestAnimationFrame` or time
  listeners
- Toast messages are global and auto-dismiss

---

## ✅ Browser Support

Designed for all modern browsers supporting:

- `fetch`
- `HTMLAudioElement`
- `localStorage`
- ES Modules

---

## 🤝 Contributing

1.  Fork the repo
2.  Create a feature branch
3.  Submit a PR

Please keep module imports clean and avoid adding framework dependencies
unless absolutely needed.

---

## 📜 License

MIT

---

## ❤️ Credits

Built with: - TypeScript - RSS - Native Web Audio - Pure frontend love

---

> _No ads. No trackers. No nonsense. Just podcasts._
