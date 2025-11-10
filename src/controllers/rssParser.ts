// rssParser.ts

import type { Enclosure, ParsedEpisode } from "../interfaces";

interface RSSElement {
  name: string;
  elements?: RSSElement[];
  attributes?: { [key: string]: string };
  type?: string;
  text?: string;
  cdata?: string;
}

interface RSSData {
  elements?: RSSElement[];
}

interface ParserMethods {
  json: (data: any) => ParsedEpisode[];
  xml: (data: string) => ParsedEpisode[];
  text: (data: string) => ParsedEpisode[];
}

export class RSSParser {
  private parsers: ParserMethods;

  constructor() {
    this.parsers = {
      json: this.parseJSON.bind(this),
      xml: this.parseXML.bind(this),
      text: this.parseText.bind(this),
    };
  }

  parseRssFeed(data: any): ParsedEpisode[] {
    if (!data) {
      console.warn("No data provided to RSS parser");
      return [];
    }

    try {
      // Handle the specific JSON structure from your example
      if (
        typeof data === "object" &&
        data.elements &&
        Array.isArray(data.elements)
      ) {
        return this.parseJSONStructure(data);
      }

      // Handle string data that might be JSON
      if (typeof data === "string") {
        try {
          const parsed = JSON.parse(data);
          if (parsed.elements && Array.isArray(parsed.elements)) {
            return this.parseJSONStructure(parsed);
          }
        } catch (e) {
          // Not JSON, try other formats
          return this.parsers.text(data);
        }
      }

      console.warn("Unknown data format for RSS parser:", typeof data, data);
      return [];
    } catch (error) {
      console.error("Error in RSS parser:", error);
      return [];
    }
  }

  private parseJSONStructure(jsonData: RSSData): ParsedEpisode[] {
    try {
      // console.log("Starting JSON structure parsing:", jsonData);

      const episodes: ParsedEpisode[] = [];

      // Find the channel element
      const channel = this.findChannel(jsonData.elements);
      if (!channel) {
        console.warn("No channel found in RSS data");
        // console.log(
        //   "Available elements:",
        //   jsonData.elements?.map((e) => e.name)
        // );
        return [];
      }

      // console.log("Found channel, extracting items...");

      // Extract all item elements from the channel
      const items = this.extractItems(channel.elements || []);
      // console.log(`Found ${items.length} items in channel`);

      items.forEach((item, index) => {
        // console.log(`Parsing item ${index + 1}:`, item);
        const episode = this.parseItem(item);
        if (episode) {
          episodes.push(episode);
          // console.log(`Successfully parsed episode: ${episode.title}`);
        } else {
          console.warn(`Failed to parse item ${index + 1}`);
        }
      });

      // console.log(`Successfully parsed ${episodes.length} episodes total`);
      return episodes;
    } catch (error) {
      console.error("Error parsing JSON structure:", error);
      return [];
    }
  }

  private findChannel(elements: RSSElement[] | undefined): RSSElement | null {
    if (!elements) return null;

    for (const element of elements) {
      if (element.name === "rss" && element.elements) {
        for (const child of element.elements) {
          if (child.name === "channel") {
            return child;
          }
        }
      }
      if (element.name === "channel") {
        return element;
      }
    }
    return null;
  }

  private extractItems(elements: RSSElement[]): RSSElement[] {
    const items: RSSElement[] = [];

    const extractFromElements = (els: RSSElement[]) => {
      if (!els) return;

      for (const element of els) {
        if (element.name === "item") {
          items.push(element);
        }
        // Recursively search in child elements
        if (element.elements) {
          extractFromElements(element.elements);
        }
      }
    };

    extractFromElements(elements);
    return items;
  }

  private parseItem(item: RSSElement): ParsedEpisode | null {
    try {
      const title = this.getElementText(item, "title");
      if (!title) {
        console.warn("Item missing title, skipping");
        return null;
      }

      const description = this.cleanDescription(
        this.getElementText(item, "description")
      );
      const pubDate = this.getElementText(item, "pubDate");
      const link = this.getElementText(item, "link");
      const guid =
        this.getElementText(item, "guid") ||
        `episode-${Date.now()}-${Math.random()}`;
      const duration = this.getElementText(item, "itunes:duration");
      const author =
        this.getElementText(item, "author") ||
        this.getElementText(item, "itunes:author");

      // Extract enclosure (audio file)
      const enclosure = this.extractEnclosure(item);

      return {
        title,
        description,
        pubDate,
        link,
        guid,
        enclosure,
        duration,
        author,
      };
    } catch (error) {
      console.error("Error parsing item:", error);
      return null;
    }
  }

  private getElementText(
    parentElement: RSSElement,
    elementName: string
  ): string {
    if (!parentElement.elements) return "";

    for (const element of parentElement.elements) {
      if (element.name === elementName) {
        // Handle text content
        if (element.elements && element.elements[0]) {
          const content = element.elements[0];
          if (content.type === "text") {
            return content.text || "";
          } else if (content.type === "cdata") {
            return content.cdata || "";
          }
        }
        return "";
      }
    }
    return "";
  }

  private extractEnclosure(item: RSSElement): Enclosure | null {
    if (!item.elements) return null;

    for (const element of item.elements) {
      if (element.name === "enclosure" && element.attributes) {
        return {
          url: element.attributes.url || "",
          type: element.attributes.type || "audio/mpeg",
          length: element.attributes.length || "0",
        };
      }
    }
    return null;
  }

  private cleanDescription(description: string): string {
    if (!description) return "No description available";

    // Remove HTML tags but preserve basic formatting
    let clean = description
      .replace(/<[^>]*>/g, "") // Remove HTML tags
      .replace(/\s+/g, " ") // Normalize whitespace
      .trim();

    // Limit length for display
    if (clean.length > 200) {
      clean = clean.substring(0, 200) + "...";
    }

    return clean || "No description available";
  }

  // Keep other parser methods for compatibility
  private parseXML(xmlString: string): ParsedEpisode[] {
    console.log({ xmlString });
    // ... existing XML parsing code ...
    return [];
  }

  private parseJSON(jsonData: any): ParsedEpisode[] {
    console.log({ jsonData });
    // ... existing JSON parsing code ...
    return [];
  }

  private parseText(textData: string): ParsedEpisode[] {
    console.log({ textData });
    // ... existing text parsing code ...
    return [];
  }
}

// // Create global instance
// declare global {
//   interface Window {
//     rssParser: RSSParser;
//   }
// }

// window.rssParser = new RSSParser();
// console.log("RSS Parser initialized for JSON structure");

// export { RSSParser, type RSSElement };
