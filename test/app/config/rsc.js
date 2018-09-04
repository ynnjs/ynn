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
                'test/ms/post' : {
                    method : 'POST',
                    headers :  {
                        'x-rsc-service-api' : 'test-post'
                    }
                },
                'test/ms/get' : {
                    method : 'GET',
                    headers :  {
                        'x-rsc-service-api' : 'test-get'
                    }
                }
            }
        }
    }
};
