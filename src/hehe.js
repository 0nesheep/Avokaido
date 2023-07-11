function heheGen() {
    var heheStr = "h";
    for (let i = 0; i <= 15; i++) {
      const rand = Math.random();
      if (rand <= 0.5) {
        heheStr += "h";
      } else {
        heheStr += "e";
      }
    }
    return heheStr;
  }
  
  module.exports = { heheGen };