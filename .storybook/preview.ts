import type { Preview } from "@storybook/html-vite";
import "../src/player.css";
import "../src/style.css";
const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        method: "alphabetical",
        order: ["Introduction", "Components", "Pages", "*"],
      },
    },
  },
};

export default preview;
