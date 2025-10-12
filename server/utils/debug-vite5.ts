async function test() {
  const viteModule: any = await import("vite");
  const createServer = viteModule['createServer'];
  
  console.log("createServer type:", typeof createServer);
  console.log("createServer value:", createServer);
  
  if (typeof createServer === 'function') {
    console.log("createServer is a function, trying to call it...");
    try {
      // Try to call it with minimal options
      const server = await createServer({
        configFile: false,
      });
      console.log("Server created successfully!");
    } catch (error) {
      console.error("Error creating server:", error);
    }
  } else {
    console.log("createServer is not a function");
  }
}

test();