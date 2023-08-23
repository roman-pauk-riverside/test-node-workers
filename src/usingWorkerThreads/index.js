const { Worker } = require('worker_threads');

const initWorkerThread = (workerId) => {
  const worker = new Worker("./src/usingWorkerThreads/worker.js");

  worker.on("message", (message) => {
    if (message.status === "started") {
      // try to get multiple frames from each worker
      Array.from(Array(2)).forEach((_, index) => {
        const time = 4894 + index * 1000;
        worker.postMessage({ command: "getFrame", time });

        console.log("Getting a frame from worker:", workerId, Date.now());
        console.log("------------");
      });
    } else if (message.status === "getFrameSuccess") {
      console.log("Received a frame from worker:", workerId, Date.now());
      console.log("------------");
    }
  });

  worker.postMessage({ command: "start", id: workerId });

  // worker.terminate();
};

// initialize multiple workers
Array.from(Array(10)).forEach((_, index) => {
  initWorkerThread(index);
});
