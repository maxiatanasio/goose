const http = require('http');

export default class Router {

    //List of middlewares that apply before action is called
    middlewares = [];
    //http request
    request;
    //http response
    response;
    //List of routes available
    routes = [];
    //Route finded according to request
    matchRoute;
    //Default function when no request is matched
    defaultFn;
    //Array of private functions to test for private routes
    privatesFns = []; 
    //Port in which the server is created
    port;

    serve = (port = 3000) => {
        this.port = port;
        http.createServer(async (req, res) => {
            console.log("Request received");
            this.request = req;
            this.response = res;
            this._applyMiddlewares();
            if (this._responseClosed()) {
                return;
            }
            this._findRoute();
            await this._executeRoute();
            this.response.end();
        }).listen(this.port, () => {
            console.log("Server created at port " + this.port);
        });

    }

    use = (fn) => {
        this.middlewares.push(fn);
    }

    route = (path, fn) => {
        this.routes.push({path,fn,methods: ['GET', 'POST']})
    }

    get = (path, fn) => {
        this.routes.push({path,fn,methods: ['GET']})
    };

    post = (path, fn) => {
        this.routes.push({path,fn,methods: ['POST']})
    };

    put = (path, fn) => {
        this.routes.push({path,fn,methods: ['PUT']})
    };

    delete = (path, fn) => {
        this.routes.push({path,fn,methods: ['DELETE']})
    };

    defaultRoute = (fn) => {
        this.defaultFn = fn;
    }

    _applyMiddlewares = () => {
        let lastResponse = true;
        this.middlewares.forEach(middleware => {
            if (lastResponse && !this._responseClosed()) {
                lastResponse = middleware(this.request, this.response);
            }
        });
    }

    _responseClosed = () => {
        return this.response.finished;
    }

    _findRoute = () => {
        this.matchRoute = this.routes.find((route) => {
            return this.request.url === route.path && route.methods.includes(this.request.method);
        });
    }

    _executeRoute = async () => {
        if(this.matchRoute){
            await this.matchRoute.fn(this.request, this.response);
        } else {
            await this._defaultRoute();
        }
    }

    _defaultRoute = () => {
        if(this.defaultFn) {
            this.defaultFn(this.request, this.response);
        }
        else {
            this.response.end();
        }
    }

}