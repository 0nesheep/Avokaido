function generateFib(n) {
    var fib = [0, 1];  //0, 1, 1, 2, 3
  
    for (let i = 2; i <= n + 3; i++) {
      fib[i] = fib[i - 1] + fib[i - 2];
    }
  
    return fib[n + 1];
  }
  
  module.exports = { generateFib };
  
  