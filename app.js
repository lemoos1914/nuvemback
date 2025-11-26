//import express from 'express';
const express = require('express');

//import createClient from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
//import {createClient} from '@supabase/supabase-js'
const supabaseClient = require('@supabase/supabase-js');

//import morgan from 'morgan';
const morgan = require('morgan');

//import bodyParser from "body-parser";
const bodyParser = require('body-parser');

const app = express();

const cors = require("cors");
const corsOptions = {
   origin:'*', 
   credentials:true,
   optionSuccessStatus:200,
};

app.use(cors(corsOptions));
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Servir arquivos estáticos (CSS, HTML etc)
app.use(express.static(__dirname));

// Supabase Client
const supabase = supabaseClient.createClient(
    'https://vucskwivifykvctcplop.supabase.co',
    'sb_publishable_oenXgtbag9ZD5-iBDT6sGg_c_jpC2cG'
);

// ========================================================================
// ROUTES
// ========================================================================

// GET ALL PRODUCTS (JSON)
app.get('/products', async (req, res) => {
    const { data, error } = await supabase
        .from('products')
        .select('*');

    if (error) return res.status(400).json(error);

    res.json(data);
});

// ========================================================================
// 🔥 GET PRODUCT BY ID — HTML bonito + JSON se for API
// ========================================================================
app.get('/products/:id', async (req, res) => {
    const id = req.params.id;

    const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !product) {
        return res.status(404).send(`
            <h1 style="text-align:center; margin-top:40px;">Produto não encontrado</h1>
        `);
    }

    // Se o cliente pedir JSON, retornar JSON normal
    if (req.headers.accept && req.headers.accept.includes("application/json")) {
        return res.json(product);
    }

    // Caso contrário, retornar HTML estilizado
    res.send(`
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
          <meta charset="UTF-8">
          <title>Produto ${product.id}</title>
          <link rel="stylesheet" href="/style.css">
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background: #f5f5f5;
                  padding: 40px;
              }

              .product-page {
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
              }

              .product-card {
                background: white;
                width: 360px;
                padding: 25px;
                border-radius: 12px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                text-align: center;
              }

              .product-card h2 {
                margin-bottom: 10px;
                font-size: 24px;
              }

              .product-description {
                font-size: 16px;
                color: #555;
                margin-bottom: 15px;
              }

              .product-price {
                font-size: 18px;
                font-weight: bold;
                color: green;
              }

              .back-button {
                margin-top: 20px;
                text-decoration: none;
                padding: 10px 20px;
                background: #444;
                color: white;
                border-radius: 8px;
                transition: 0.2s;
              }

              .back-button:hover {
                background: black;
              }
          </style>
      </head>

      <body>
        <div class="product-page">
          <div class="product-card">
            <h2>${product.name}</h2>
            <p class="product-description">${product.description}</p>
            <p class="product-price">Preço: R$ ${Number(product.price).toFixed(2)}</p>
          </div>

          <a class="back-button" href="/">Voltar</a>
        </div>
      </body>
      </html>
    `);
});

// CREATE PRODUCT (POST)
app.post('/products', async (req, res) => {
    const { name, description, price } = req.body;

    const { data, error } = await supabase
        .from('products')
        .insert({ name, description, price })
        .select();

    if (error) return res.status(400).json(error);

    res.status(201).json(data[0]);
});

// UPDATE (PATCH)
app.patch('/products/:id', async (req, res) => {
    const id = req.params.id;

    const { data, error } = await supabase
        .from('products')
        .update({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price
        })
        .eq('id', id)
        .select();

    if (error) return res.status(400).json(error);

    res.json(data[0]);
});

// UPDATE (PUT)
app.put('/products/:id', async (req, res) => {
    const id = req.params.id;

    const { data, error } = await supabase
        .from('products')
        .update({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price
        })
        .eq('id', id)
        .select();

    if (error) return res.status(400).json(error);

    res.json(data[0]);
});

// DELETE
app.delete('/products/:id', async (req, res) => {
    const id = req.params.id;

    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

    if (error) return res.status(400).json(error);

    res.status(204).send();
});

// ROOT
app.get('/', (req, res) => {
    res.send("Supabase backend is running!");
});

// START SERVER
app.listen(3000, () => {
    console.log(`> Server running at http://localhost:3000`);
});
