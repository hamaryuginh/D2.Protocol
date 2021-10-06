# D2.Protocol

## Description

D2.Protocol est une librairie Javascript offrant des outils de lecture et écriture de paquet pour le jeu Dofus 2.x.

Le protocole est construit par la librairie [D2.ProtocolBuilder](https://github.com/RBlanchet/D2.ProtocolBuilder) elle même basée sur l'excellente librairie [dofus-protocol-builder](https://github.com/Vicfou-dev/dofus-protocol-builder), un grand merci à lui.

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

## Crédits

[Vicfou-dev](https://github.com/Vicfou-dev)
