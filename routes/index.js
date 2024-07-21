var express = require('express');
var router = express.Router();

const contactsJs = require('../public/javascripts/contacts'); 

async function loader() {
  const contacts =  await contactsJs.getContacts();
  return contacts;
}

router.get('/', async function(req, res, next) {
  const con  =  await loader()
  res.render('index', { contacts: con});
});

router.get('/:contactId', async function(req, res, next) {
  const con = await contactsJs.getContact(req.params.contactId);
  res.render("contact", {contacts: await loader(), contact: con });
});

router.post('/:contactId/edit', async function(req, res, next) {
  res.render('edit', {contacts: await loader(), contact: await contactsJs.getContact(req.params.contactId)});
});

router.post('/addNew', async function(req, res, next) {
  res.render('edit', {contacts: await loader(), contact: await contactsJs.createContact()});
});


router.post('/:contactId/save', async function(req, res, next ){
  await contactsJs.updateContact(req.params.contactId, await req.body);
  res.redirect(`/${req.params.contactId}`);
});

router.post('/:contactId/destroy', async function(req, res, next) {
  await contactsJs.deleteContact(req.params.contactId);
  res.redirect('/');
});


module.exports = router;
