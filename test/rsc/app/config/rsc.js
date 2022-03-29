module.exports = {
	client : {
        name : 'test',
        auth : [ {
            key : '',
            token : ''
        } ]
    },
    service : {
        '' : {},
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
                },
                'test/id' : {
                    method : 'GET',
                    path : 'test/id/{{id}}',
                    params : {
                        id : '999'
                    }
                }
            }
        },
        'a' : {
            protocol : 'http',
            host : 'www.zuoshouyisheng.com',
            timeout : 10000,
            headers : {
                'x-default-header-1' : 's-header-1',
                'x-default-header-2' : 's-header-2',
                //get 'request-no'() { return new Date }
            },
            api : {
                'api-1' : {
                    method : 'GET',
                    headers : {
                        'x-default-header-2' : 'a-header-2'
                    },
                    params : {
                        x : 1,
                        y : 2,
                        z : 3
                    }
                },
                'api-2' : {
                    method : 'POST',
                    headers : {
                        'x-default-header-2' : 'a-header-2'
                    },
                    params : {
                        x : 1,
                        y : 2,
                        z : 3
                    }
                },

                'api-3' : {
                    method : 'POST',
                    timeout : 3000,
                    headers : {
                        'x-default-header-2' : 'a-header-2',
                        'content-type' : 'application/json; charset=utf-8'
                    },
                    params : {
                        x : 1,
                        y : 2,
                        z : 3
                    }
                }
            }
        }
    }
};
