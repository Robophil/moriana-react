# Moriana-React

Moriana rewrite in React/Redux.

Web-based software for healthcare supply chain management. Designed for facilites with low network availability. Free and Open Source.

* [Features](http://moriana.org/)
* [Original Backbone App](https://github.com/kdoran/moriana)
* [License](./LICENSE)
* [Demo at demo.moriana.org](demo.moriana.org) username: `testuser` password: `pass`

## Application Overview

The app's aim is to have as few dependencies as possible, allowing for offline use and a light deployment. It uses Apache's CouchDB as its database, backend, and web server (in contrast to the usual but heavier web setup, i.e. a database server, a web server, backend and font-end logic).

Because of that, an organization's deployment can be a single laptop in an offline setting (e.g. a remote clinic without internet access), with only CouchDB installed and this project's index.html & javascript file. A deployment can also be multiple online or offline laptops, a cloud-based server, a backup server, etc, all using CouchDB's peer to peer replication.

For example, a healthcare project in Lesotho has a main Ubuntu server running NGIX/SSL/CouchDB, which is used by administrative staff at a central warehouse, and about a dozen laptops at rural clinics running CouchDB with intermittent internet access. At one of the clinics, pharmacy staff often dispense for several weeks offline and then take their laptop and a USB modem to a nearby area with cell tower coverage for syncing with the central server.

## Databases Approach

A deployment can have multiple CouchDB servers with replication (a server corresponds to a physical machine, so one Couch server per laptop or per rack/cloud server), but it can also have multiple databases per server for a project's user requirements.

Databases are used to logically separate data. For example, a remote clinic might have two databases, a "Warehouse" which is the clinic's supply store, and a "Dispensary", where medical supplies are issued to patients. On one laptop, pharmacy staff can transfer items from their Warehouse database to their Dispensary database. An organization then can have multiple clinics each with two databases, and transfer stock between these databases. Staff then can have access only to specific databases.

Example Layout:

* `Organization HQ Warehouse` receives stock from external suppliers and transfers stock to remote clinics. Administrative staff at this location have access to all databases.
* `Clinic 'A' Store` receives stock from Organization HQ Warehouse and transfers to other clinics or its own dispensary. Staff at this location only have access to this location's two databases.
* `Clinic 'A' Dispensary` receives stock from Clinic A's store, dispenses out to patients. Staff at this location only have access to this location's two databases.
* `Clinic B Store`, `Clinic B Dispensary` similar to Clinic A with access restricted to Clinic B data.

## Application Logic

Pharmacy staff create `shipments` to modify their stock levels. Shipments have at minimum a `from location`, `to location`, and a `date`.

Shipments have `transactions`, which are items with quantities. A transaction at minimum has an `item`, `item category`, and `quantity`. It can also have an `expiration`, `batch/lot number`, and `unit price`.

`Locations` have three types: `external`, which is a physical or virtual location such as a supplier's name or "Damaged", `internal` which is a CouchDB database and a physical location at which the organization manages stock, and `patient`, which is also an external location but one which holds patient details.

#### Receives
To create new stock, users create a shipment from an `external location`. Example:

* From: `Initial Warehouse Stock Count` (external)
* To: `HQ Warehouse` (internal, an actual database)
* Date: `8th Jan 2017`
* Transactions:
  * Item: `Ibuprofen 200mg pack size 200`, Category: `Pills and Tablets`, Quantity: `40300` (at the lowest level of transfer, i.e. pills to dispense), Expiration: `May/2022`, Lot: `ABCD1234`(manufacturer's batch/lot number)
  * Item: `Ibuprofen 200mg pack size 200`, Category: `Pills and Tablets`, Quantity: `2000`, Expiration: `April/2020`, Lot: `X8823`
  * Item: `N95 Mask`, Category: `Medical Supplies`, Quantity: `200`, Lot: `123ABC`

On the 8th of January 2017, `HQ Warehouse` has a complete inventory list of Ibuprofen & N95 masks, with `reports at the Location level` (showing 2 `items`, 3 `batches`) and `2 individual stock cards` for each item.

An `item` is an item name and a category (one to many relation), a `batch` is a received item with its attributes of `expiration`, `unit price`, and `lot` number, and a `transaction` is a specific `batch` from a `location` to to a `location` with a `quantity`.

#### Transfers
To move stock between internally managed locations, users create a shipment from an internal location to an internal location. Example:

* From: `HQ Warehouse` (internal)
* To: `Clinic A` (internal, a location with a database)
* Date: `9th Jan 2017`
* Transactions:
  * Item: `Ibuprofen 200mg pack size 200`, Category: `Pills and Tablets`, Quantity: `1000`, Expiration: `April/2020`, Lot: `X8823`

Now, on the 9th of January 2017 onwards, `HQ Warehouse` has a stock of `Ibuprofen` with quantity `39300` for the `April/2020`/`X8823` batch (deducted by 1000). The other Ibuprofen batch at HQ remains the same. The system automatically transfers First Expiration In First Out (FEFO). `Clinic A` now has a stock of that one Ibuprofen batch, quantity `1000`.

#### Dispense
Finally, to the patient:

* From: `Clinic A` (internal)
* To: `Patient Name` (external patient)
  * patient details such as dob, gender, district
* Date: `9th Jan 2017`
* Transactions:
  * Item: `Ibuprofen 200mg pack size 200`, Category: `Pills and Tablets`, Quantity: `20`, Expiration: `April/2020`, Lot: `X8823`

Now, `Clinic A` has a stock of Ibuprofen with quantity `980`


## Local development setup

    git clone git@github.com:kdoran/moriana-react.git
    npm i
    npm start

## Update all dependencies

first run:

    npm i -g npm-check-updates

normally:

    npm-check-updates -u
    npm i

## Javascript Layout

React/Redux app. Follows parts of [this article](https://medium.com/javascript-scene/10-tips-for-better-redux-architecture-69250425af44), e.g. having related constants, actions, and reducers in the same file.

* `app.js` starting point for app
* `/comonents/` non-store connected react components
* `/containers/` store-connected react compnents, mostly page containers
* `/store/` actions, thunks, and reducers for each module
  * i.e. `items.js` holds action creators, ajax promise requests, and reducers for an inventory's list of items.
* `/styles/` any .less styles that overrides the bootstrap/bootswatch paper theme
* `/utils/` functions used across components and reducers

## Tests

Tests always run in the console during local development. `tests/run-tests.js` is the starting point, and anything included as a -spec file in the tests dir will run.
