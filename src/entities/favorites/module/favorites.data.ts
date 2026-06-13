export const INITIAL_FAVORITES = [
    {
        id: "fav-1",
        name: "Object One",
        category: "Outerwear",
        image: "/products/1.jpg",
        specs: "Wool / Black",
        price: 320.0,
    },
    {
        id: "fav-2",
        name: "Object Two",
        category: "Knitwear",
        image: "/products/2.jpg",
        specs: "Cotton / Ecru",
        price: 180.0,
    },
    {
        id: "fav-2",
        name: "Object Two",
        category: "Knitwear",
        image: "/products/2.jpg",
        specs: "Cotton / Ecru",
        price: 180.0,
    },
    {
        id: "fav-2",
        name: "Object Two",
        category: "Knitwear",
        image: "/products/2.jpg",
        specs: "Cotton / Ecru",
        price: 180.0,
    },{
        id: "fav-2",
        name: "Object Two",
        category: "Knitwear",
        image: "/products/2.jpg",
        specs: "Cotton / Ecru",
        price: 180.0,
    },{
        id: "fav-2",
        name: "Object Two",
        category: "Knitwear",
        image: "/products/2.jpg",
        specs: "Cotton / Ecru",
        price: 180.0,
    },
];

// Тип одного товара в избранном
export type FavoriteItem = (typeof INITIAL_FAVORITES)[number];