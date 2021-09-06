const debug = require('debug')('server');
const express = require('express');
const Joi = require('joi');
const app = express();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  debug('server is listening on port ' + PORT);
});

const endpoint = '/employees';

let DATABASE = [
  {
    employeeNumber: 0,
    name: 'John Doe',
    jobTitle: 'Manager',
    department: 'HelloWorld',
  },
];

app.use(express.json());

// Create

app.post(endpoint, (req, res) => {
  const data = req.body;

  const schema = Joi.object({
    name: Joi.string().required(),
    jobTitle: Joi.string().required(),
    department: Joi.string().required(),
  });

  const joi = schema.validate(data);

  if (joi && joi.error) {
    return res.status(400).send(joi.error.message);
  }

  const employeeNumber = DATABASE[DATABASE.length - 1].employeeNumber;
  data['employeeNumber'] = employeeNumber + 1;
  DATABASE.push(data);
  return res.status(201).json(data);
});

// Read

app.get(endpoint + '/:id', (req, res) => {
  const { id } = req.params;

  const schema = Joi.object({
    id: Joi.number().required(),
  });

  const joi = schema.validate({ id: Number(id) });

  if (joi && joi.error) {
    return res.status(400).send(joi.error.message);
  }

  const employee = DATABASE.find((i) => i.employeeNumber === Number(id));
  if (!employee) {
    status = 404;
    return res.status(404).send('resource not found');
  }
  return res.status(200).json(employee);
});

// Read All

app.get(endpoint, (req, res) => {
  return res.json(DATABASE);
});

// Create or Update with PUT method

app.put(endpoint, (req, res) => {
  const data = req.body;

  const schema = Joi.object({
    employeeNumber: Joi.number().required(),
    name: Joi.string().required(),
    jobTitle: Joi.string().required(),
    department: Joi.string().required(),
  });

  const joi = schema.validate(data);

  if (joi && joi.error) {
    return res.status(400).send(joi.error.message);
  }

  const index = DATABASE.findIndex(
    (i) => i.employeeNumber === Number(data.employeeNumber)
  );
  if (index === -1) {
    DATABASE.push(data);
    status = 201;
  } else {
    DATABASE[index] = data;
  }
  return res.status(200).json(data);
});

// Update with PATCH method

app.patch(endpoint + '/:id', (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const schema = Joi.object({
    id: Joi.number().required(),
  });

  const joi = schema.validate({ id: Number(id) });

  if (joi && joi.error) {
    return res.status(400).send(joi.error.message);
  }

  const schema2 = Joi.object({
    name: Joi.string(),
    jobTitle: Joi.string(),
    department: Joi.string(),
  });

  const joi2 = schema2.validate(data);

  if (joi2 && joi2.error) {
    return res.status(400).send(joi2.error.message);
  }

  const index = DATABASE.findIndex((i) => i.employeeNumber === Number(id));

  if (index === -1) {
    return res.status(404).send('resource not found');
  }

  DATABASE[index] = { ...DATABASE[index], ...data, employeeNumber: Number(id) };
  return res.json({
    employeeNumber: Number(id),
    ...data,
  });
});

// Delete

app.delete(endpoint + '/:id', (req, res) => {
  const { id } = req.params;

  const schema = Joi.object({
    id: Joi.number().required(),
  });

  const joi = schema.validate({ id: Number(id) });

  if (joi && joi.error) {
    return res.status(400).send(joi.error.message);
  }

  const index = DATABASE.findIndex((i) => i.employeeNumber === Number(id));

  if (index === -1) {
    return res.status(404).send('resource not found');
  }

  DATABASE = DATABASE.filter((i) => i.employeeNumber !== Number(id));
  return res.end();
});

app.head(endpoint, (req, res) => res.end());
