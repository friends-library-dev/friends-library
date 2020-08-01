import Cart from '../Cart';
import CartItem from '../CartItem';
import { cartItemData1, cartItemData2 } from './fixtures';

describe(`Cart`, () => {
  let cart: Cart;

  beforeEach(() => {
    cart = new Cart([new CartItem(cartItemData1())]);
  });

  test(`adding different cart item should increase num items`, () => {
    const newItem = new CartItem(cartItemData2());
    cart.addItem(newItem);
    expect(cart.items.length).toBe(2);
  });

  test(`adding same cart item should only increase quantity`, () => {
    const newItem = new CartItem(cartItemData1());
    cart.addItem(newItem);
    expect(cart.items.length).toBe(1);
    expect(cart.items[0].quantity).toBe(2);
  });

  describe(`Cart.fromJson()`, () => {
    const badInputs: [unknown][] = [
      [null],
      [false],
      [{}],
      [undefined],
      [
        {
          email: 123, // <-- bad email
          items: [],
        },
      ],
      [
        {
          address: `My house`, // <-- bad address
          items: [],
        },
      ],
    ];

    test.each(badInputs)(`bad input creates empty cart without error`, (input) => {
      const cart = Cart.fromJson(input);
      expect(cart.items).toHaveLength(0);
      expect(cart.address).toBeUndefined();
      expect(cart.email).toBeUndefined();
    });

    it(`rehydrates good data`, () => {
      const json = {
        email: `jared@netrivet.com`,
        address: {
          name: `Jane`,
          street: `123 Mulberry Lane`,
          city: `New York`,
          state: `NY`,
          zip: `90210`,
          country: `US`,
        },

        items: [
          {
            edition: `updated`,
            quantity: 3,
            printSize: `xl`,
            numPages: [333],
            displayTitle: `Journal of G. F.`,
            documentId: `the-id`,
            title: `Journal of G. F`,
            author: `G. F.`,
          },
        ],
      };
      const cart = Cart.fromJson(json);
      expect(cart.items).toHaveLength(1);
      expect(cart.address).toMatchObject(json.address);
      expect(cart.email).toBe(`jared@netrivet.com`);
    });

    it(`migrates old-style item array`, () => {
      const json = {
        items: [
          {
            edition: `updated`,
            quantity: 3,
            printSize: `xl`,
            numPages: [333],
            displayTitle: `Journal of G. F.`,
            documentId: `the-id`,
            title: [`Journal of G. F.`], // <-- array
            author: `G. F.`,
          },
        ],
      };
      const cart = Cart.fromJson(json);
      expect(cart.items).toHaveLength(1);
      expect(cart.items[0].title).toBe(`Journal of G. F.`);
    });
  });
});
