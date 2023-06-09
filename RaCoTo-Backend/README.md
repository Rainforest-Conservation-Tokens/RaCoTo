# Rain Forest Conservation Token (Backend)

## Custom Scripts :

- `deployConsumer.js`
- `deployToken.js`
- `functionSub.js`
- `request.js`

## Contracts :

- `RCToken.sol`
- `FunctionsConsumer.sol`
- `RaCoTo.sol`
- `Treasury.sol`
- `Governance/RaCoToUserGov.sol`

## Chainlink Function Sources

### Prerequisites

- python3
- poetry python dependency management \
  `curl -sSL https://install.python-poetry.org | python3 -`

### Install

- in the prototypes folder \
  `cd ChainlinkFunctionSources/PrototypesPython/`
- create a virtual environment with name venv: \
  `python3 -m venv venv`
- activate it: \
  `source venv/bin/activate`

- install the dependencies: \
  `poetry install`

- create a `.env` file to define the authenticication header for the GlobalForestWatch API as the variable `gfwAuthHeader`; this `.env` should be in the [ChainlinkFunctionSources/PrototypesPython/](ChainlinkFunctionSources/PrototypesPython/) folder

### Usage:

- prototypes are in [ChainlinkFunctionSources/PrototypesPython/globalFW_API_interface.py](ChainlinkFunctionSources/PrototypesPython/globalFW_API_interface.py)
- a notebook to test the prototypes is at [ChainlinkFunctionSources/PrototypesPython/gfw_api_queries.ipynb](ChainlinkFunctionSources/PrototypesPython/gfw_api_queries.ipynb)

## ToDos :

- Main Consumer Contract
- Consuming and storing the events
- translate python versions of CL function sources to .js
- NFTs or not: decide later

Interfaces :

- `Interface/ITreasury.sol`
- `Interface/IERC20.sol`
