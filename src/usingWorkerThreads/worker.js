const { parentPort, workerData } = require('worker_threads');
const { EditorOverlayRenderer } = require("@riversidefm/canvas-renderer-node");
const { basicTranscriptionAPIData } = require("../data/transcriptionAPIData");

let renderer;

parentPort.on("message", (message) => {
  if (message.command === "start") {
    // initialize PIXI renderer
    renderer = new EditorOverlayRenderer({
      aspectRatio: "16:9",
      size: {
        width: 1280,
        height: 720,
      },
      sections: [{ range: { start: 0, end: 20000 } }],
    }).addCaptions(basicTranscriptionAPIData, {
      enabled: true,
      style: {
        primaryColor: "#FFFFFF",
        secondaryColor: "#000000",
        primaryColorOpacity: 1,
        secondaryColorOpacity: 1,
        fontFamily: "Inter",
        fontSize: "Large",
        fontWeight: 700,
        textAlign: "Right",
        effect: "BoxedInverted",
        animation: "None",
      },
      position: {
        midpointX: 0.5,
        midpointY: 0.4,
      },
    });

    parentPort.postMessage({ status: "started" });
  } else if (message.command === "getFrame") {
    const pixels = renderer.renderAt(message.time).pixels;
    parentPort.postMessage({ status: "getFrameSuccess", pixelsLen: pixels?.length });
  }
});
