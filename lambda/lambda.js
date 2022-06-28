import ApiBuilder from "claudia-api-builder";
import fetch from "node-fetch";
import FormData from "form-data";

let api = new ApiBuilder();

const verifyAndroidReceipt = req => {
  // setup credentials
  const config = {
    client_id: "<fill in>",
    client_secret: "<fill in>",
    refresh_token: "<fill in (https://stackoverflow.com/questions/48176187/server-side-authorization-with-google-play-developer-api)>",
    grant_type: "refresh_token"
  };

  let form = new FormData();
  for (let key in config) {
    form.append(key, config[key]);
  }

  return fetch("https://accounts.google.com/o/oauth2/token", {
    method: "POST",
    body: form
  })
    .then(res => res.json())
    .then(credentials => {
      let receipt = req.pathParams.receipt || req.queryString.receipt;
      let sku = req.queryString.sku;
      let type = req.queryString.type;
      let appId = req.queryString.appId;

      return fetch(
        `https://www.googleapis.com/androidpublisher/v3/applications/${appId}/purchases/${type}s/${sku}/tokens/${receipt}?access_token=${
          credentials.access_token
        }`
      ).then(res => res.json());
    });
};

api.get("/validate_purchase/android/{receipt}", verifyAndroidReceipt);
api.get("/validate_purchase/android", verifyAndroidReceipt);

// old export syntax required
module.exports = api;