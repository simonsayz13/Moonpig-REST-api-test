import * as express from "express";
import axios from "axios";
export const app = express();

app.set("json spaces", 2);

type Template = {
  id: string;
  width: number;
  hegiht: number;
  imageURL: string;
};

type Page = {
  title: string;
  templateId: string;
};

type DetailedPage = {
  title: string;
  width: number;
  height: number;
  imageUrl: string;
};

type availableSize = {
  id: string;
  title: string;
};

type sizes = {
  id: string;
  title: string;
  priceMultiplier: number;
};

type Card = {
  id: string;
  title: string;
  sizes: Array<string>;
  basePrice: number;
  pages: Array<Page>;
};

type SingleCard = {
  title: string;
  size: string;
  availableSizes: Array<availableSize>;
  imageUrl: string;
  price: string;
  pages: Array<DetailedPage>;
};

type Cards = {
  title: string;
  imageUrl: string;
  url: string;
};

app.get("/cards", async (req: express.Request, res: express.Response) => {
  const CardList: Array<Cards> = [];

  const cards = await axios.get(
    "https://moonpig.github.io/tech-test-node-backend/cards.json"
  );

  const templates = await axios.get(
    "https://moonpig.github.io/tech-test-node-backend/templates.json"
  );

  cards.data.forEach((card: Card) => {
    const imageUrl: string = templates.data.find(
      (template: Template) => template.id === card.pages[0].templateId
    ).imageUrl;
    CardList.push({
      title: card.title,
      imageUrl: imageUrl,
      url: "/cards/" + card.id,
    });
  });

  return res.send(CardList);
});

app.get(
  "/cards/:cardId/:sizeId?",
  async (req: express.Request, res: express.Response) => {
    const { cardId, sizeId } = req.params;
    const cards = await axios.get(
      "https://moonpig.github.io/tech-test-node-backend/cards.json"
    );
    const sizes = await axios.get(
      "https://moonpig.github.io/tech-test-node-backend/sizes.json"
    );
    const templates = await axios.get(
      "https://moonpig.github.io/tech-test-node-backend/templates.json"
    );
    const chosenCard: Card = cards.data.find(
      (card: Card) => card.id === cardId
    );

    if (!chosenCard) {
      return res.status(404).send({ error: "Card not found" });
    }

    if (!sizes.data.find((sizes: sizes) => sizes.id === sizeId)) {
      return res.status(404).send({ error: "Size not found" });
    }

    let availableSizes: Array<availableSize> = [];
    let detailPages: Array<DetailedPage> = [];
    let price: number = chosenCard.basePrice;

    // Get available sizes
    chosenCard.sizes.forEach((size) => {
      availableSizes.push({
        id: size,
        title: sizes.data.find((sizes: sizes) => sizes.id == size).title,
      });
    });

    // Get multiplier, add price
    if (sizeId) {
      const multiplier: number = sizes.data.find(
        (sizes: sizes) => sizes.id == sizeId
      ).priceMultiplier;
      price *= multiplier;
    }

    const displayPrice = "£" + Number(price / 100).toFixed(2);

    // Get Image URL
    const imageUrl: string = templates.data.find(
      (template: Template) => template.id === chosenCard.pages[0].templateId
    ).imageUrl;

    // Get pages details
    chosenCard.pages.forEach((page: Page) => {
      detailPages.push({
        title: page.title,
        width: templates.data.find(
          (template: Template) => template.id === page.templateId
        ).width,
        height: templates.data.find(
          (template: Template) => template.id === page.templateId
        ).height,
        imageUrl: templates.data.find(
          (template: Template) => template.id === page.templateId
        ).imageUrl,
      });
    });

    const theCard: SingleCard = {
      title: chosenCard.title,
      size: sizeId,
      availableSizes: availableSizes,
      imageUrl: imageUrl,
      price: displayPrice,
      pages: detailPages,
    };

    return res.send(theCard);
  }
);
