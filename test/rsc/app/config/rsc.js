module.exports = {
	client : {
        name : 'test',
        key : '',
        token : ''
    },
    service : {
        ms : {  
            protocol : 'http',
            timeout : 5000,
            headers : {
                'x-rsc-service' : 'ms'
            },
            api : {
                'test/index/post' : {
                    method : 'POST',
                    headers :  {
                        'x-rsc-service-api' : 'test-post'
                    }
                },
                'test/index/get' : {
                    method : 'GET',
                    headers :  {
                        'x-rsc-service-api' : 'test-get'
                    }
                }
            }
        }
    }
};
