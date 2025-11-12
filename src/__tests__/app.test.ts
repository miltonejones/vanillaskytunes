import { PodcastApp } from "../main";
import { PodcastStore } from "../store";

// npm install --save-dev jest ts-jest @types/jest jest-environment-jsdom identity-obj-proxy
// npx ts-jest config:init

// Mock dependencies
jest.mock("../store");
jest.mock("../controllers/carousel");
jest.mock("../controllers/audioPlayer");

describe("PodcastApp", () => {
  let app: PodcastApp;

  beforeEach(() => {
    app = new PodcastApp();
    jest.spyOn(app.store, "setView");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("should initialize app", () => {
    expect(app).toBeDefined();
    expect(app.initialized).toBe(false);
    expect(app.store).toBeInstanceOf(PodcastStore);
  });

  test("should handle click events", () => {
    const target = document.createElement("button");
    target.dataset.view = "home";
    const mockEvent = {
      stopPropagation: jest.fn(),
      preventDefault: jest.fn(),
      target,
    } as unknown as MouseEvent;

    app.handleClick(mockEvent);
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(app.store.setView).toHaveBeenCalledWith("home");
  });
});
