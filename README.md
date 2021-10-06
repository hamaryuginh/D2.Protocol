# D2.Protocol

## Description

D2.Protocol est une librairie Javascript offrant des outils de lecture et écriture de paquet pour le jeu Dofus 2.x.

## Installation

```shell
npm install @rblanchet/d2-protocol
```

## Utilisation

### Lire un Buffer provenant de Dofus

```javascript
const {Reader} = require('@rblanchet/d2-protocol');

/**
 * Provient de Dofus, peut-être fourni par un Socket ou un MITM.
 * 
 * @param {Buffer}
 */
buffer;

const message = Reader.readBuffer(buffer);
console.log(message);
```
