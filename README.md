# Pixie: AlgodatPraktikum

## Requirements
You need a Windows, Linux or Mac system. If you want to contribute you need to install the following things:

### Installation
Nodejs Version: 20.8.1 LTS
https://nodejs.org/de

Then install additional requirements via nodejs by executing

```
npm install fabric
npm install --save-dev @types/fabric
cd pixie
npm install
```

## Running
In a terminal go into the project directory. Then run the following commands:
```
cd pixie
npm start
```

## Contributing
The project uses react and fabric.js with typescript. The most important files to get started are:
- App.tsx pixie/src/App/App.tsx
- App.css pixie/src/App/App.css

React is a modular environment that is based on components. The code is organized into two big directories. The App and the components directory. Each new component that is created should eventually be placed in a new directory inside components. Please orient yourself by the structure that is already given.

Sharing state should be done in the way that react forsees it to be done (Someone has to find it out and implement it). We don't try to reinvent the wheel. Own solutions are 100% of the time worse, except you intend to waste 5 years of your life.

Experiment, write bad code, we will iterate anyways and have fun.

## Unit Testing
All Unittests will be placed into
- pixie/src/\_\_tests\_\_
We follow the same directory structure as in src.
Each file has to have the file ending
- .test.tsx.

For example to create a unit test file for 
- src/App/App.tsx 

You create a corrosponding File
- src/\_\_tests\_\_/App/App.tsx

The basic structure of a test file looks something like this:
```typescript
import { CanvasManager } from "../../Utils/CanvasManager";

describe("CanvasManager", () => {
    test("CanvasManager is instantiable", () => {
        expect(new CanvasManager()).toBeInstanceOf(CanvasManager);
    });
    {/* Your tests */}
});
```

## Test Driven Development
Please read https://en.wikipedia.org/wiki/Test-driven_development for further information.

# Warning
Never use:
```
# !!!DANGEROUS!!!
# npm audit fix --force
```
If you do so please backup your code and revert to the last commit by executing:
```
# !!!DANGEROUS. THIS will delete all you progress!!!
# Note: only your local code is affected
# git reset --hard HEAD
```