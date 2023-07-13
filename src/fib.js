function generateFib(n) {
    var fib = [0, 1]; 
    if (n > 10) {
        return 5000;
    }
  
    for (let i = 2; i <= n + 3; i++) {
      fib[i] = fib[i - 1] + fib[i - 2];
    }
    return (fib[n + 1] - fib[n]) * 100;
  }
  
  module.exports = { generateFib };
  
  