"use strict";
const quotesModel = require("./models/quotesModel");
const mongodb = require("./db");

module.exports.saveQuote = async (event) => {
  const { body, headers } = event;
  if (!body || !headers || !headers.Authorization) return {
      statusCode: !headers.Authorization ? 401 : 400,
    };

  const auth = Buffer.from(
    headers.Authorization.split(" ")[1],
    "base64"
  ).toString();

  const [user, pass] = auth.split(":");
  const { artist, quote, isImage, url } = JSON.parse(body);

  try {
    await mongodb.connect();
    await quotesModel.create({
      createdBy: user,
      artist,
      quote: quote,
      isImage,
      url,
    });
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      error: error.message,
    };
  }
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  };
};

module.exports.getQuotes = async (event) => {
  const { multiValueQueryStringParameters: queryParams } = event;

  const limit = queryParams && queryParams.limit ? queryParams.limit[0] : 1000;
  const skip = queryParams && queryParams.skip ? queryParams.skip[0] : 0;
  try {
    await mongodb.connect();
    const result = await quotesModel
      .find({})
      .limit(+limit)
      .skip(+skip);
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        quotes: result,
      }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      error: error.message,
    };
  }
};
