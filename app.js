const path = require('path')
const express = require('express');
const jobRouter = require('./routes/jobRoutes')
const userRouter = require('./routes/userRoutes')
const viewsRouter = require('./routes/viewsRoutes')
// const paypalRouter = require('./routes/paypalRoutes')
const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
const app = express();
const paypal = require("@paypal/checkout-server-sdk")
const catchAsync = require('./utils/catchAsync')


// MIDDLEWARES
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))


app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))


// ROUTES
app.use('/api/v1/jobs', jobRouter)
app.use('/api/v1/users', userRouter)
app.use('/', viewsRouter)
















const { CLIENT_ID, APP_SECRET } = process.env;
const baseURL = {
    sandbox: "https://api-m.sandbox.paypal.com",
    production: "https://api-m.paypal.com"
};



// create a new order
app.post("/create-paypal-order", catchAsync(async (req, res) => {
  const order = await createOrder();
  res.json(order);
}));

// capture payment & store order information or fullfill order
app.post("/capture-paypal-order", catchAsync(async (req, res) => {
  const { orderID } = req.body;
  const captureData = await capturePayment(orderID);
  // TODO: store payment information such as the transaction ID
  res.json(captureData);
}));

app.get("/paypal", (req, res) => {

  res.render("paypal", {
    paypalClientId: process.env.CLIENT_ID,
  })
})



//////////////////////
// PayPal API helpers
//////////////////////

// use the orders api to create an order
async function createOrder() {
  const accessToken = await generateAccessToken();
  const url = `${baseURL.sandbox}/v2/checkout/orders`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: "100.00",
          },
        },
      ],
    }),
  });
  const data = await response.json();
  return data;
}

// use the orders api to capture payment for an order
async function capturePayment(orderId) {
  const accessToken = await generateAccessToken();
  const url = `${baseURL.sandbox}/v2/checkout/orders/${orderId}/capture`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await response.json();
  return data;
}

// generate an access token using client id and app secret
async function generateAccessToken() {
  const auth = Buffer.from(CLIENT_ID + ":" + APP_SECRET).toString("base64")
  const response = await fetch(`${baseURL.sandbox}/v1/oauth2/token`, {
    method: "POST",
    body: "grant_type=client_credentials",
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });
  const data = await response.json();
  return data.access_token;
}






















// const Environment = paypal.core.SandboxEnvironment

// const paypalClient = new paypal.core.PayPalHttpClient(
//   new Environment(
//     process.env.PAYPAL_CLIENT_ID,
//     process.env.PAYPAL_CLIENT_SECRET
//   )
// )

// const storeItems = new Map([
//     [1, { price: 100, name: "Learn React Today" }],
//     [2, { price: 200, name: "Learn CSS Today" }],
//   ])
  

  
//   app.post("/create-order", async (req, res) => {
//     const request = new paypal.orders.OrdersCreateRequest()
//     const total = req.body.items.reduce((sum, item) => {
//       return sum + storeItems.get(item.id).price * item.quantity
//     }, 0)
//     request.prefer("return=representation")
//     request.requestBody({
//       intent: "CAPTURE",
//       purchase_units: [
//         {
//           amount: {
//             currency_code: "USD",
//             value: total,
//             breakdown: {
//               item_total: {
//                 currency_code: "USD",
//                 value: total,
//               },
//             },
//           },
//           items: req.body.items.map(item => {
//             const storeItem = storeItems.get(item.id)
//             return {
//               name: storeItem.name,
//               unit_amount: {
//                 currency_code: "USD",
//                 value: storeItem.price,
//               },
//               quantity: item.quantity,
//             }
//           }),
//         },
//       ],
//     })
  
//     try {
//       const order = await paypalClient.execute(request)
//       res.json({ id: order.result.id })
//     } catch (e) {
//       res.status(500).json({ error: e.message })
//     }
//   })
  























// NON EXISTING ROUTES
app.all('*', (req, res, next)=> {

    next(new AppError(`Oh no! The page does not exist ${req.originalUrl}`, 404))
})

// app.use((req, res, next)=> {
//     next(new AppError(`Oh no! The page does not exist`, 404))
// });

app.use(globalErrorHandler)

// Remember that the middleware is called and passed the args by express
module.exports = app