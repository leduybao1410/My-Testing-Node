require('dotenv').config();
const os = require('os');

const getLocalIpAddress = () =>{
  const networkInterfaces = os.networkInterfaces();
  for (const interfaceName in networkInterfaces){
    for (const interface of networkInterfaces[interfaceName]){
      if(interface.family === 'IPv4' && !interface.internal){
        return interface.address;
      }
    }
  }
  return process.env.HOST_NAME;
}
module.exports= {
	getLocalIpAddress,
}
