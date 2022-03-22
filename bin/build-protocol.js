const axios = require("axios");
const fs = require("fs");
const { spawn } = require("child_process");
const path = require("path");

const PLATFORM = "linux";
const ANKAMA_CDN = "https://launcher.cdn.ankama.com";

const download = async (hash, path) => {
  const response = await axios({
    method: "GET",
    url: `${ANKAMA_CDN}/dofus/hashes/${hash.substring(0, 2)}/${hash}`,
    responseType: "arraybuffer",
  });

  await fs.promises.writeFile(path, response.data);
};

const spawnProcess = (command, args) =>
  new Promise((resolve, reject) => {
    const process = spawn(command, args, { shell: true });
    process.stdout.on("data", (data) => {
      console.log(`   - ${data}`);
    });
    process.on("error", (err) => {
      reject(err);
    });

    process.on("close", resolve);
  });

(async () => {
  // Récupération de l'Invoker
  console.log("-> [Invoker] Récupération du dernier Invoker disponible");
  const versions = (await axios.get(`${ANKAMA_CDN}/cytrus.json`)).data;
  const hash = versions.games.dofus.platforms[PLATFORM].main;
  console.log(`   - Hash disponible : ${hash}`);
  console.log(
    `   - Récupération du fichier DofusInvoker.swf via le CDN ${ANKAMA_CDN}`
  );
  const files = (
    await axios.get(
      `${ANKAMA_CDN}/dofus/releases/main/${PLATFORM}/${hash}.json`
    )
  ).data;
  await download(
    files.main.files["DofusInvoker.swf"].hash,
    "/DofusInvoker.swf"
  );
  console.log(
    `   - Fichier DofusInvoker.swf récupéré et placé à la racine du Docker "/DofusInvoker.swf"`
  );
  // Décompilation du DofusInvoker.swf
  console.log("-> [JPEXS] Décompilation des fichiers AS3");
  try {
    await spawnProcess("/ffdec/ffdec.sh", [
      '-config "parallelSpeedUp=0"',
      '-selectclass "com.ankamagames.dofus.network.++"',
      "-export script /D2.ProtocolBuilder/tmp/protocol/as /DofusInvoker.swf",
    ]);
  } catch (err) {
    throw err;
  }
  // Transpilation via D2.ProtocolBuilder
  console.log("-> [Protocol Builder] Transpilation des AS3 en JS");
  try {
    await spawnProcess("npm", ["--prefix /D2.ProtocolBuilder", "run build"]);
  } catch (err) {
    throw err;
  }
  try {
    await spawnProcess("npm", ["--prefix /D2.ProtocolBuilder", "run compile"]);
  } catch (err) {
    throw err;
  }
  console.log("   - Copie du fichier de protocol dans l'application");
  fs.copyFile(
    "/D2.ProtocolBuilder/build/protocol.js",
    `${path.resolve(__dirname)}/../lib/protocol.js`,
    (err) => {
      if (err) throw err;
    }
  );
  // Récupération de la version du Protocol
  console.log("-> [Version] Récupération de la version du Protocol");
  await download(files.main.files["VERSION"].hash, "/VERSION");
  fs.copyFile("/VERSION", `${path.resolve(__dirname)}/../VERSION`, (err) => {
    if (err) throw err;
  });
})();
