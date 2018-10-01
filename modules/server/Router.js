const http = require('http');

export default class Router {

    middlewares = [];
    request;
    response;
    routes = [];
    matchRoute;
    defaultFn;

    serve = (port = 3000) => {
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
        }).listen(port)

    }

    use = (fn) => {
        this.middlewares.push(fn);
    }

    route = (path, fn) => {
        this.routes.push({
            path,
            fn
        })
    }

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
            return this.request.url === route.path;
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