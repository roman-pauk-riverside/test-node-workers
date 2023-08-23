const { fork } = require("child_process");

const initChildProcess = (processId) => {
  const child = fork("./src/usingChildProcess/worker.js");

  child.on("message", (message) => {
    if (message.status === "started") {
      // try to get multiple frames from each process
      Array.from(Array(2)).forEach((_, index) => {
        const time = 4894 + index * 1000;
        child.send({ command: "getFrame", time });

        console.log("Getting a frame from child:", processId, Date.now());
        console.log("------------");
      });
    } else if (message.status === "getFrameSuccess") {
      console.log("Received a frame from child:", processId, Date.now());
      console.log("------------");
    }
  });

  child.send({ command: "start", id: processId });

  // child.kill();
};

// initialize multiple child processes
Array.from(Array(10)).forEach((_, index) => {
  initChildProcess(index);
});
