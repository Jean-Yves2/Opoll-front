export type ApiUrl = string;

let apiUrl: ApiUrl;

if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  
  apiUrl = 'http://localhost:3000'; 
} else {
  
  apiUrl = 'https://opollapiapp-edae30bda3ef.herokuapp.com';
}

export { apiUrl };
