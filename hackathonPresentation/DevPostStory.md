# RaCoTo: Rainforest Proof-Of-Conservation Tokens

## Inspiration
In order to preserve rain forests and their biodiversity and, at the same time, to combat climate change, we are currently working on a tool to create a long-term source of income that directly remunerates owners of rain forest areas for the action of preserving their forest. 

To track the preservation in an untamperable and transparent manner we use public blockchains and satellite tracking to deliver an integrity that is to our point unparalleled in the field carbon dioxide offsetting. Hereby, we would like to promote and offer an alternative to destructive economic actions as consequence of financial pressure.

Rain forest areas can bind a tremendous amount of carbon dioxide. Certificates for the fixation of carbon dioxide are treated on voluntary and obligatory carbon markets in industrialized countries around the globe. Private persons and companies as well as several other stakeholders are seeking to buy certificates representing saved or bound carbon dioxide in order to offset their emissions.
From our point of view, people who have preserved rain forest until today, should also be able to earn for their efforts.

## What it does

To create an incentive alignment in rainforest preservation we apply Chainlink Proof-Of-Reserves to rainforest preservation: We are using both, real-time satellite images to prove the cover of rainforest for a determined area ([Proof-Of-Conservation](https://github.com/Rainforest-Conservation-Tokens/RaCoTo/blob/main/hackathonPresentation/RaCoToFlows/Proof-Of-ConservationClaimsFlow.png)
) and the documents that prove the ownership of the same area ([Proof-Of-Ownership](https://github.com/Rainforest-Conservation-Tokens/RaCoTo/blob/main/hackathonPresentation/RaCoToFlows/Proof-Of-OwnershipFlow.png)). We combine these two independent third-party data sources and securely and decentrally verify them.

As incentive, rainforest Proof-of-Conservation tokens (RaCoTos) are created by a trust-minimized dezentralized Application (dApp) on the Polygon blockchain. The Proof-Of-Conservation process is inspired by Chainlink’s Proof-Of-Reserves where reserves’ Audits are made transparent for everyone. Similarly, the Proof-Of-Conservation process uses Chainlink Functions to implement a transparent audit of rainforest cover and carbon absorption for everyone.

RaCoTos are backed by near-real-time satellite image analysis (e.g. from the [GlobalForestWatch](https://www.globalforestwatch.org/), [SentinelHub](https://www.sentinel-hub.com/), etc.). This data ensures that one RaCoTo accurately represents one ton of fixed carbon dioxide emissions. The rainforest owners can claim RaCoTos and sell them to emitters that wish to provably offset their emissions. The emitters can demonstrably and unequivocally proof their offset by retiring the obtained RaCoTos.

For maintaining the RaCoTo project we envision to charge only a minimal fee of e.g. 1 percent of the claimed amount of RaCoTos. For the present Chainlink Spring Hackathon, we managed to have several rainforest owners that are commited to collaborate the RaCoTo project by providing geolocation (e.g. GPS) data for their rainforest area and officially verifiable copies of the legal documents that prove their ownership.

## How we built it
We are using polygon mumbai 💜 chain for deployment of our backend and the frontend is accessible at [https://racoto.network](https://racoto.network).

- Code is hosted managed via a github organization: 
[https://github.com/orgs/Rainforest-Conservation-Tokens/repositories](https://github.com/orgs/Rainforest-Conservation-Tokens/repositories).
- The final integration / deployed repository: [https://github.com/Rainforest-Conservation-Tokens/RaCoTo/](https://github.com/Rainforest-Conservation-Tokens/RaCoTo/)
- Backend development repository: [https://github.com/Rainforest-Conservation-Tokens/RaCoTo-Backend](https://github.com/Rainforest-Conservation-Tokens/RaCoTo-Backend)
- Frontend development repository [https://github.com/Rainforest-Conservation-Tokens/frontend](https://github.com/Rainforest-Conservation-Tokens/frontend)


### Tech Stack
#### Backend & Frontend

- NodeJS
- TypeScript
- MongoDB
- NextJS

#### Smart Contracts

- Solidity
- Chainlink Functions
- Hardhat

```sh
CONTRACT ADDRESSES (POLYGON MUMBAI)
RaCoTo: 0x7ae866bF6C7432D0f4A24d01D24a239c9FDaacBC
RaCoToGov: 0x99BD41871A3F1E9Cb5a15545aD9265bB87DDcA5A
RCToken: 0x7128cDaf9391E66d29dc286A6dDb6bD20F97Da6b
Treasury: 0xf68B22ec17f9Da8551f8AECE4dBBe940c35Ae3C7
```
## Challenges we ran into
- Chainlink Functions in it's Beta has strict limitations on Gas for executing requests. We needed to revise our call to `executeRequest` to make it work, eventually
- evaluating the carbon dioxide absorption from API queries is complicated. We did not yet manage to get all the data to make the request to the GlobalForestWatch API [https://www.globalforestwatch.org/](https://www.globalforestwatch.org/)  as accurate as it can be. Eventually, we want to use the CO2 net flux average according to [https://www.nature.com/articles/s41558-020-00976-6](https://www.nature.com/articles/s41558-020-00976-6) and then remove the fraction affected by deforestation as reported by radar satellites [https://www.nature.com/articles/s41558-020-00956-w](https://www.nature.com/articles/s41558-020-00956-w). We managed doing the former and are still working out the correct API requests for the latter.

## Accomplishments that we're proud of
- we are in contact with rainforest owners of areas of about 5000 square km that want to collaborate with us
- deployed integrated backend & frontend 
- all basic features are working as intended (proof of state change and other transactions are included as images with polygonscan links in the caption)
- CL Functions Subscription TX: [https://mumbai.polygonscan.com/tx/0xf987260736d99f9e3ad030de5979f83d548e8223be0c59c2ee9de59d1555ac21](https://mumbai.polygonscan.com/tx/0xf987260736d99f9e3ad030de5979f83d548e8223be0c59c2ee9de59d1555ac21)
- CL Functions state change: [https://mumbai.polygonscan.com/tx/0x8931b1df1aec5a08dcb55fae9d0031fe83ea76404637e60f63ab8f91fdce2184](https://mumbai.polygonscan.com/tx/0x8931b1df1aec5a08dcb55fae9d0031fe83ea76404637e60f63ab8f91fdce2184)
- Backend state: [https://mumbai.polygonscan.com/address/0xf402df1324b6c143031594f9da668b4e0c6c035c#readContract](https://mumbai.polygonscan.com/address/0xf402df1324b6c143031594f9da668b4e0c6c035c#readContract)
- our webpage [https://racoto.network](https://racoto.network)
- our [light paper draft](https://github.com/Rainforest-Conservation-Tokens/RaCoTo/blob/main/docs/RaCoTo_Lightpaper.pdf)  
- our [project flyer](https://github.com/Rainforest-Conservation-Tokens/RaCoTo/blob/main/docs/RaCoTo_Flyer.pdf)

## What we learned
- Chainlink Functions are an awesome way to get data into hybrid smart contracts
- working on tech for good with blockchain is great fun
- decentralized data origination and validation is the way to bring the lacking integrity to carbon dioxide tracking
- blockchain technology powered by secured data has a huge potential
 

## What's next for RaCoTo: Rainforest Proof-of-Conservation Tokens 
- Completing the light and white paper
- Improvement and optimization of our data origination procedure
- Decentrally sourced satellite data for Proof-Of-Conservation (i.e. beyond just GlobalForestWatch -- use SentinelHub and Ice Eye)
- Building data ecosystem with independent third-party data sources for a trust minimization in the Proof-Of-Ownership process
- Security audit and improvement/refactoring of backend
- Deployment on a mainnet and start of user onboarding


## The RaCoTo Team thus far
- Dr. Lode, AUJ (Germany), hybrid smart contracts / data origination
- Dipl.-Biol. Schinko, APB (Switzerland), biologist / rainforest / operations
- Jangra, A (India), solidity / backend 
- Singhal, P (India), frontend / integration
- Agrawal, Y (India), hybrid smart contracts / Chainlink functions
