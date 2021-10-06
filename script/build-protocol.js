const axios = require('axios');
const fs = require('fs');

const PLATFORM = 'linux';
const ANKAMA_CDN = 'https://launcher.cdn.ankama.com';

const downloadInvoker = async (hash) => {
    const response = await axios({
        method: 'GET',
        url: `${ANKAMA_CDN}/dofus/hashes/${hash.substring(0, 2)}/${hash}`,
        responseType: 'arraybuffer',
    });

    await fs.promises.writeFile(`/DofusInvoker.swf`, response.data);
}

(async () => {
    // Récupération de l'Invoker
    console.log('-> [Invoker] Récupération du dernier Invoker disponible');
    const versions = (await axios.get(`${ANKAMA_CDN}/cytrus.json`)).data;
    const hash = versions.games.dofus.platforms[PLATFORM].main;
    console.log(`   - Hash disponible : ${hash}`);
    console.log(`   - Récupération du fichier DofusInvoker.swf via le CDN ${ANKAMA_CDN}`);
    const files = (await axios.get(`${ANKAMA_CDN}/dofus/releases/main/${PLATFORM}/${hash}.json`)).data;
    await downloadInvoker(files.main.files['DofusInvoker.swf'].hash);
    console.log(`   - Fichier DofusInvoker.swf récupéré et placé à la racine du Docker "/DofusInvoker.swf"`);
})();