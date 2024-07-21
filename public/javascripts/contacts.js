const matchSorterModule = require("match-sorter");
const matchSorter = matchSorterModule.matchSorter;
const sortBy = require("sort-by");

async function getContacts(query) {
  await fakeNetwork(`getContacts:${query}`);
  let contacts = array;
  console.log(`get contact: `);
  console.log(contacts);
  if (!contacts) contacts = [];
  if (query) {
    contacts = matchSorter(contacts, query, { keys: ["first", "last"] });
  }
  return contacts.sort(sortBy("last", "createdAt"));
}

async function createContact() {
  await fakeNetwork();
  let id = Math.random().toString(36).substring(2, 9);
  let contact = { id, createdAt: Date.now() };
  let contacts = await getContacts();
  contacts.unshift(contact);
  await set(contacts);
  return contact;
}

async function getContact(id) {
  await fakeNetwork(`contact:${id}`);
  let contacts = array
  let contact = contacts.find(contact => contact.id === id);
  return contact ?? null;
}

async function updateContact(id, updates) {
  await fakeNetwork();
  let contacts = array;
  let contact = contacts.find(contact => contact.id === id);
  if (!contact) throw new Error("No contact found for", id);
  Object.assign(contact, updates);
  await set(contacts);
  return contact;
}

async function deleteContact(id) {
  let contacts = array;
  let index = contacts.findIndex(contact => contact.id === id);
  if (index > -1) {
    contacts.splice(index, 1);
    await set(contacts);
    return true;
  }
  return false;
}

function set(contacts) {
  console.log(`set contacts`);
  console.log(contacts);
  return array = contacts;
}

// fake a cache so we don't slow down stuff we've already seen
let fakeCache = {};

async function fakeNetwork(key) {
  if (!key) {
    fakeCache = {};
  }

  if (fakeCache[key]) {
    return;
  }

  fakeCache[key] = true;
  return new Promise(res => {
    setTimeout(res, Math.random() * 800);
  });
}

let array = [];

module.exports = {getContacts, createContact, getContact, updateContact, deleteContact}