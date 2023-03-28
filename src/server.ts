import * as express from "express";
export const app = express();
import {
  Template,
  Cards,
  Card,
  Page,
  DetailedPage,
  SingleCard,
  AvailableSize,
  Sizes,
} from "./types";
import { getCardsData, getSizesData, getTemplateData } from "./datasource";

app.set("json spaces", 2);

app.get("/cards", async (req: express.Request, res: express.Response) => {
  const CardList: Array<Cards> = [];
  const cards: Array<Card> = (await getCardsData()).data;
  const templates: Array<Template> = (await getTemplateData()).data;

  cards.forEach((card: Card) => {
    const imageUrl: string = templates.find(
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
    const cards: Array<Card> = (await getCardsData()).data;
    const templates: Array<Template> = (await getTemplateData()).data;
    const sizes: Array<Sizes> = (await getSizesData()).data;
    const chosenCard: Card = cards.find((card: Card) => card.id === cardId);
    let availableSizes: Array<AvailableSize> = [];
    let detailPages: Array<DetailedPage> = [];

    if (!chosenCard) {
      return res.status(404).send({ error: "Card not found" });
    }

    if (sizeId && !sizes.find((sizes: Sizes) => sizes.id === sizeId)) {
      return res.status(404).send({ error: "Size not found" });
    }

    let price: number = chosenCard.basePrice;
    // Get available sizes
    chosenCard.sizes.forEach((size) => {
      availableSizes.push({
        id: size,
        title: sizes.find((sizes: Sizes) => sizes.id == size).title,
      });
    });

    // Get multiplier, add price
    if (sizeId) {
      const multiplier: number = sizes.find(
        (sizes: Sizes) => sizes.id == sizeId
      ).priceMultiplier;
      price *= multiplier;
    }

    const displayPrice = "£" + Number(price / 100).toFixed(2);

    // Get Image URL
    const imageUrl: string = templates.find(
      (template: Template) => template.id === chosenCard.pages[0].templateId
    ).imageUrl;

    // Get pages details
    chosenCard.pages.forEach((page: Page) => {
      detailPages.push({
        title: page.title,
        width: templates.find(
          (template: Template) => template.id === page.templateId
        ).width,
        height: templates.find(
          (template: Template) => template.id === page.templateId
        ).height,
        imageUrl: templates.find(
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
