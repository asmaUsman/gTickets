import axios from 'axios';

export default ({ req }) => {
  if (typeof window === 'undefined') {
    // We are on the server
    // http://ingress-nginx-controller.ingress-nginx.svc.cluster.local
    return axios.create({
      baseURL: 'http://www.getickets.xyz',
      headers: req.headers
    });
  } else {
    // We must be on the browser
    return axios.create({
      baseUrl: '/'
    });
  }
};
