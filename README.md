# instauction

Auction demo API application made with `NodeJS v10.15.3` and `mongoDB v4.0.0`.

# Ideal requirements

- `git`
- `node v15.10.3`
- `npm v6.4.1`
- `mongo v4.0.0`
- `docker v18.09.7`
- `docker-compose v1.17.1`

# Setup

To run the project, inside the project's folder execute the command:

`docker-compose up`

Then navigate to `http://localhost:3100/` in the browser.

# Environment variables

- `NODE_ENV`
- `PORT`
- `DATABASE_URL`
- `DB_SERVER`
- `DB_PORT`
- `DB_USER`
- `DB_PASS`
- `AUCTION_IDLE_TIME_LIMIT_MS`
- `DEBUG`

*Note: every environment variable is optional to set*

PS: `DATABASE_URL` gets priority over the *URI* generated with the `DB_` variables.

# Endpoints

The following endpoints are the ones available in the application:

- POST /auction/

Body:

> JSON {  
>	item: string,  
>	description: string,  
>	email: string,  
>	startingPrice: number  
> }

- POST /auction/:id/start

- POST /auction/:id/end

- GET /auction/

QueryString:

> page: number  
> items_per_page: number

- GET /auction/:id

- GET /auction/:id/bids

QueryString:

> page: number  
> items_per_page: number

- GET /auction/:id/status

QueryString:

> page: number  
> items_per_page: number

- GET /auction/status

- POST /bid/

> JSON {  
> email: string,  
> amount: number,  
> auctionId: string  
}

- GET /bid/

QueryString:

> page: number  
> items_per_page: number

- GET /bid/:id



