import proxy from 'express-http-proxy';

const proxyWithHeader = (serviceUrl) => {
    return proxy(serviceUrl,{
        // header->proxyReqOpts    request->srcReq

        proxyReqOptDecorator:(proxyReqOpts,srcReq)=>{

            if(srcReq.user){
                proxyReqOpts.header["x-user-id"] = srcReq.user.userId;
            } 
              return proxyReqOpts;
        }
    })
}

export default proxyWithHeader;