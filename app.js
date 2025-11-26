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

// Supabase Client
const supabase = supabaseClient.createClient(
    'https://vucskwivifykvctcplop.supabase.co',
    'sb_publishable_oenXgtbag9ZD5-iBDT6sGg_c_jpC2cG'
);

// ========================================================================
// ROUTES
// ========================================================================

// GET ALL PRODUCTS
app.get('/products', async (req, res) => {
    const { data, error } = await supabase
        .from('products')
        .select('*');

    if (error) return res.status(400).json(error);

    res.json(data);
});

// GET PRODUCT BY ID
app.get('/products/:id', async (req, res) => {
    const id = req.params.id;

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single(); // garante que vem só 1 objeto

    if (error) return res.status(400).json(error);

    res.json(data);
});

// CREATE PRODUCT (POST)
app.post('/products', async (req, res) => {
    const { name, description, price } = req.body;

    const { data, error } = await supabase
        .from('products')
        .insert({ name, description, price })
        .select(); // retorna o novo produto

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

// UPDATE (PUT) – fallback do frontend
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

    res.status(204).send(); // sem corpo (correto p/ DELETE)
});

// ROOT
app.get('/', (req, res) => {
    res.send("Supabase backend is running!");
});

// START SERVER
app.listen(3000, () => {
    console.log(`> Server running at http://13.222.132.43:3000`);
});
