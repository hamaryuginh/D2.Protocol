const axios = require('axios');
const fs = require('fs');
const { spawn } = require('child_process');
const path =  require('path');

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
    // Décompilation du DofusInvoker.swf
    console.log('-> [JPEXS] Décompilation des fichiers AS3');
    try {
        await (() => new Promise((resolve, reject) => {
            const ffdec = spawn('/ffdec/ffdec.sh', ['-config "parallelSpeedUp=0"', '-selectclass "com.ankamagames.dofus.network.++"', '-export script /D2.ProtocolBuilder/tmp/protocol/as /DofusInvoker.swf'], {shell:true});
            ffdec.stdout.on('data', data => {
                console.log(`   - ${data}`);
            });
            ffdec.on('error', (err) => {
                reject(err);
            });
    
            ffdec.on('close', resolve);
        }))();
    } catch (err) {
        throw err;
    }
    // Transpilation via D2.ProtocolBuilder
    console.log('-> [Protocol Builder] Transpilation des AS3 en JS');
    try {
        await (() => new Promise((resolve, reject) => {
            const ffdec = spawn('npm', ['--prefix /D2.ProtocolBuilder', 'run build'], {shell:true});
            ffdec.stdout.on('data', data => {
                console.log(`${data}`);
            });
            ffdec.on('error', (err) => {
                reject(err);
            });
    
            ffdec.on('close', resolve);
        }))();
    } catch (err) {
        throw err;
    }
    try {
        await (() => new Promise((resolve, reject) => {
            const ffdec = spawn('npm', ['--prefix /D2.ProtocolBuilder', 'run compile'], {shell:true});
            ffdec.stdout.on('data', data => {
                console.log(`${data}`);
            });
            ffdec.on('error', (err) => {
                reject(err);
            });
    
            ffdec.on('close', resolve);
        }))();
    } catch (err) {
        throw err;
    }
    console.log('   - Copie du fichier de protocol dans l\'application');
    fs.copyFile('/D2.ProtocolBuilder/build/protocol.js', `${path.resolve(__dirname)}/../lib/protocol.js`, (err) => {
        if (err) throw err;
    });
})();