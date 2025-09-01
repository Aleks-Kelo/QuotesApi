# Quote API

A **REST and GraphQL API** for fetching, liking, and querying quotes.
Random quotes are weighted based on likes, and comparable quotes are provided for similar content.

This project is built with **Fastify**, **TypeScript**, and **Mercurius** for GraphQL support.

---

## Features

-   Fetch all quotes
-   Fetch a single quote by ID
-   Fetch a weighted random quote with comparable quotes
-   Like a quote
-   Fully supports both **REST** and **GraphQL**
-   Hosted API [API LINK](https://quotes-fastify-123-a3cweug2gkhfbtc9.westeurope-01.azurewebsites.net/)

---

## Installation

```bash
git clone https://github.com/Aleks-Kelo/QuotesApi.git
cd quote-api
npm install
npm run dev
```

> Requires Node.js 20+

---

## REST API

Base URL: [Base URL](https://quotes-fastify-123-a3cweug2gkhfbtc9.westeurope-01.azurewebsites.net/)

### 1. Get all quotes

**Endpoint:** `GET /quotes`
**Description:** Fetch all quotes along with their current number of likes.

**Response Example:**

```json
[
    {
        "id": 1,
        "quote": "The only limit to our realization of tomorrow is our doubts of today.",
        "author": "Franklin D. Roosevelt",
        "likes": 10
    },
    {
        "id": 2,
        "quote": "Do not go where the path may lead, go instead where there is no path and leave a trail.",
        "author": "Ralph Waldo Emerson",
        "likes": 5
    }
]
```

### 2. Get a random quote with comparable quotes

**Endpoint:** `GET /quotes/random`
**Description:** Fetch a weighted random quote based on likes, along with comparable quotes.

**Response Example:**

```json
{
    "randomQuote": {
        "id": 5,
        "quote": "Life is what happens when you're busy making other plans.",
        "author": "John Lennon",
        "likes": 7
    },
    "comparableQuotes": [
        {
            "id": 12,
            "quote": "Plan your work and work your plan.",
            "author": "Napoleon Hill",
            "likes": 3
        },
        {
            "id": 15,
            "quote": "To achieve great things, two things are needed: a plan and not quite enough time.",
            "author": "Leonard Bernstein",
            "likes": 2
        }
    ]
}
```

### 3. Get quote by ID

**Endpoint:** `GET /quotes/:id`
**Description:** Fetch a specific quote by its ID.

**Response Example:**

```json
{
    "id": 3,
    "quote": "Do what you can, with what you have, where you are.",
    "author": "Theodore Roosevelt",
    "likes": 5
}
```

**Errors:**

-   `400 Bad Request` – Invalid quote ID
-   `404 Not Found` – Quote not found

### 4. Like a quote

**Endpoint:** `POST /quotes/:id/like`
**Description:** Increment the like count of a specific quote.

**Response Example:**

```json
{
    "quoteId": 3,
    "likes": 6
}
```

**Errors:**

-   `400 Bad Request` – Invalid quote ID

---

## GraphQL API

**Endpoint:** `/graphiql`
GraphiQL is enabled for interactive testing.

### Schema

```graphql
type Quote {
    id: Int!
    quote: String!
    author: String!
    likes: Int!
}

type RandomQuoteResult {
    randomQuote: Quote!
    comparableQuotes: [Quote!]!
}

type Query {
    quotes: [Quote!]!
    quote(id: Int!): Quote
    randomQuoteWithComparable: RandomQuoteResult!
}

type Mutation {
    likeQuote(id: Int!): Quote
}
```

### Queries

#### Get all quotes

```graphql
query {
    quotes {
        id
        quote
        author
        likes
    }
}
```

#### Get quote by ID

```graphql
query {
    quote(id: int) {
        id
        quote
        author
        likes
    }
}
```

#### Get random quote with comparable quotes

```graphql
query {
    randomQuoteWithComparable {
        randomQuote {
            id
            quote
            author
            likes
        }
        comparableQuotes {
            id
            quote
            author
            likes
        }
    }
}
```

### Mutations

#### Like a quote

```graphql
mutation {
    likeQuote(id: int) {
        id
        quote
        author
        likes
    }
}
```

---

## Random Quote Selection Logic

-   Each quote's chance of being selected is **`likes + 1`** (weighted random),so even the quotes with 0 likes get a chance of being picked.
-   Comparable quotes are selected based on **content similarity**,first author then based on the number of likes,depending on the set tolerance(default is +-2).

---

## Development Notes

-   Validation is done using **Zod** to ensure correct IDs are provided.
-   Random quote selection ensures all quotes have at least a minimum probability of being selected.

---

## License

MIT License
